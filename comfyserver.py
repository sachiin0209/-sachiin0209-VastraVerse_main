from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import google.generativeai as genai
from typing import List, Dict
import logging
import os
import re
import requests
import json
import time
import base64
from io import BytesIO
from PIL import Image
from dotenv import load_dotenv
import uuid

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, static_url_path='', static_folder='.')
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-1.5-flash-latest"

# ComfyUI server configuration
COMFYUI_SERVER = os.getenv("COMFYUI_SERVER", "http://localhost:8188")

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Serve index.html at root
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# Serve chatbot.html at /chatbot.html
@app.route('/chatbot.html')
def serve_chatbot():
    return send_from_directory('.', 'chatbot.html')

# Serve all other static files
@app.route('/<path:filename>')
def serve_file(filename):
    if os.path.exists(filename):
        return send_from_directory('.', filename)
    else:
        return "File not found", 404

# Add API status route at /api
@app.route("/api")
def api_status():
    return jsonify({
        "status": "running",
        "message": "VastraVerse API is running with ComfyUI integration",
        "endpoints": {
            "/generate": "POST - Generate image from pose and prompt using ComfyUI"
        }
    })

# Chatbot API endpoint with markdown formatting
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    messages = data.get('messages', [])
    response = get_model_response(MODEL, messages)
    
    # Format the response to convert markdown to HTML
    formatted_response = format_markdown_to_html(response)
    
    return jsonify({"response": formatted_response})

# ComfyUI workflow for virtual try-on based on f1.json
def get_comfyui_workflow(reference_image_name, prompt, negative_prompt="bad anatomy, blurry, distorted, extra limbs, watermark, text"):
    workflow = {
        # Load Stable Diffusion model
        "4": {
            "inputs": {
                "ckpt_name": "v1-5-pruned-emaonly.safetensors"
            },
            "class_type": "CheckpointLoaderSimple"
        },

        # Latent image for generation
        "5": {
            "inputs": {
                "width": 512,
                "height": 768,
                "batch_size": 1
            },
            "class_type": "EmptyLatentImage"
        },

        # Prompt encoding
        "6": {
            "inputs": {
                "text": prompt,
                "clip": ["4", 1]
            },
            "class_type": "CLIPTextEncode"
        },

        # Negative prompt encoding
        "7": {
            "inputs": {
                "text": negative_prompt,
                "clip": ["4", 1]
            },
            "class_type": "CLIPTextEncode"
        },

        # Load input image
        "20": {
            "inputs": {
                "image": reference_image_name,
                "upload": "image"
            },
            "class_type": "LoadImage"
        },

        # IPAdapter loader
        "19": {
            "inputs": {
                "model": ["4", 0],
                "preset": "PLUS (high strength)"
            },
            "class_type": "IPAdapterUnifiedLoader"
        },

        # IPAdapter usage
        "18": {
            "inputs": {
                "model": ["19", 0],
                "ipadapter": ["19", 1],
                "image": ["20", 0],
                "weight": 1.0,
                "weight_type": "prompt is more important",
                "start_at": 0.0,
                "end_at": 1.0
            },
            "class_type": "IPAdapter"
        },

        # Sampling with updated step count (50)
        "3": {
            "inputs": {
                "model": ["18", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0],
                "seed": int(time.time()) % 1000000000,
                "steps": 60,
                "cfg": 9,
                "sampler_name": "euler",
                "scheduler": "normal",
                "denoise": 1
            },
            "class_type": "KSampler"
        },

        # Decode latent to image
        "8": {
            "inputs": {
                "samples": ["3", 0],
                "vae": ["4", 2]
            },
            "class_type": "VAEDecode"
        },

        # Final preview image
        "14": {
            "inputs": {
                "images": ["8", 0]
            },
            "class_type": "PreviewImage"
        }
    }

    return workflow

# Image generation endpoint using ComfyUI
@app.route("/generate", methods=["POST"])
def generate_image():
    print("Received request for image generation using ComfyUI...")
    image_file = request.files.get("image")
    prompt = request.form.get("prompt", "")
    negative_prompt = "bad anatomy, blurry, distorted, extra limbs, watermark, text"

    if not image_file or not prompt:
        return jsonify({"error": "Image and prompt are required"}), 400

    try:
        # Save the uploaded image temporarily
        input_image_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}.png")
        image_file.save(input_image_path)
        
        # Upload image to ComfyUI
        with open(input_image_path, 'rb') as f:
            response = requests.post(
                f"{COMFYUI_SERVER}/upload/image",
                files={"image": f}
            )
        
        if response.status_code != 200:
            return jsonify({"error": f"Failed to upload image to ComfyUI: {response.text}"}), 500
        
        image_name = response.json()["name"]
        
        # Create and queue the workflow
        workflow = get_comfyui_workflow(image_name, prompt, negative_prompt)
        
        response = requests.post(
            f"{COMFYUI_SERVER}/prompt",
            json={"prompt": workflow}
        )
        
        if response.status_code != 200:
            return jsonify({"error": f"Failed to queue workflow in ComfyUI: {response.text}"}), 500
        
        prompt_id = response.json()["prompt_id"]
        
        # Poll for completion
        max_attempts = 60  # Maximum number of attempts (60 * 2 seconds = 2 minutes timeout)
        attempts = 0
        output_image = None
        
        while attempts < max_attempts:
            time.sleep(2)  # Wait for 2 seconds between polls
            history_response = requests.get(f"{COMFYUI_SERVER}/history/{prompt_id}")
            
            if history_response.status_code != 200:
                attempts += 1
                continue
            
            history_data = history_response.json()
            
            if prompt_id in history_data and "outputs" in history_data[prompt_id]:
                outputs = history_data[prompt_id]["outputs"]
                if "14" in outputs and outputs["14"].get("images"):
                    image_data = outputs["14"]["images"][0]
                    image_filename = image_data["filename"]
                    image_subfolder = image_data.get("subfolder", "")
                    image_type = image_data.get("type", "output")
                    
                    # Get the generated image
                    image_url = f"{COMFYUI_SERVER}/view?filename={image_filename}&subfolder={image_subfolder}&type={image_type}"
                    image_response = requests.get(image_url)
                    
                    if image_response.status_code == 200:
                        output_image = BytesIO(image_response.content)
                        break
            
            attempts += 1
        
        # Clean up the temporary file
        if os.path.exists(input_image_path):
            os.remove(input_image_path)
        
        if output_image:
            output_image.seek(0)
            return send_file(output_image, mimetype="image/png", download_name="output.png")
        else:
            return jsonify({"error": "Timed out waiting for image generation"}), 500
            
    except Exception as e:
        logger.error(f"Error in generate_image: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Helper function to format markdown to HTML
def format_markdown_to_html(text):
    if not text:
        return text
    
    # Process double asterisks for line breaks and bold text
    # Step 1: Replace ** followed by a word with a line break and bold start
    text = re.sub(r'\*\*\s*([^*]+)', r'<br><strong>\1', text)
    
    # Step 2: Replace remaining single asterisks for bold text
    # This handles cases where there's a single * for bold
    text = re.sub(r'\*([^*]+)\*', r'<strong>\1</strong>', text)
    
    # Step 3: Close any remaining unclosed <strong> tags
    if '<strong>' in text and '</strong>' not in text:
        text += '</strong>'
    
    # Step 4: Handle bullet points (often represented as *)
    text = re.sub(r'^\s*\*\s+(.+)$', r'<br>• \1', text, flags=re.MULTILINE)
    
    # Step 5: Handle any remaining double asterisks as line breaks
    text = text.replace('**', '<br>')
    
    # Log the formatted text for debugging
    logger.info(f"Formatted text: {text}")
    
    return text

# Helper function for chatbot
def get_model_response(model: str, messages: List[Dict[str, str]]) -> str:
    try:
        system_prompt = """You are a comprehensive expert on Indian culture, traditions, and customs. Answer questions EXACTLY as they are asked, without adding unnecessary context about specific festivals unless explicitly requested.

Guidelines for responses:
1. For "Why" questions:
   - Answer ONLY what is specifically asked
   - Do NOT add context about any festival unless explicitly mentioned in the question
   - Provide complete historical and cultural context
   - Include regional variations if relevant
   - Explain modern significance

2. Response structure:
   [Question Topic]:
   • Historical Background
   • Cultural Significance
   • Regional Variations
   • Modern Context
   • Specific Details
   • Additional Information

3. For specific item/custom questions:
   - Focus ONLY on the item/custom asked about
   - Explain its significance
   - Describe variations
   - Detail modern practices
   - Include relevant facts

4. For attire questions:
   - Explain the specific garment/accessory
   - Detail its cultural significance
   - Describe regional variations
   - Include material and style information
   - Mention modern adaptations

5. Remember:
   - Answer EXACTLY what is asked
   - Don't add festival context unless specifically requested
   - Provide comprehensive information about the specific topic
   - Include historical and cultural significance
   - Be accurate and respectful
   - Use clear, organized formatting
   - End with "Let me know if you need any further assistance."
   
6. Formatting:
   - Use ** to start a new section with bold heading
   - Use * around text to make it bold
   - Use bullet points for lists
"""
        logger.info(f"Processing request for model: {model}")
        logger.info(f"Messages received: {messages}")
        
        prompt = system_prompt + "\n\n" + "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])
        
        model_instance = genai.GenerativeModel(model)
        
        response = model_instance.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.4,
                max_output_tokens=2048,
                top_p=0.4,
            ),
        )

        bot_reply = response.text
        
        bot_reply = re.sub(r"\n*Note:.*", "", bot_reply, flags=re.IGNORECASE|re.DOTALL)
        
        if bot_reply.strip() and not bot_reply.strip().endswith("Let me know if you need any further assistance."):
            bot_reply = bot_reply.strip() + "\n\nLet me know if you need any further assistance."
        return bot_reply
    except Exception as e:
        logger.error(f"Error in get_model_response: {str(e)}")
        return f"Error: {str(e)}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)