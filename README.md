# VastraVerse: Explore Indian Culture & Fashion with AI

Welcome to *VastraVerse*, an interactive web application dedicated to exploring the rich tapestry of Indian culture, traditions, and fashion. Discover detailed information about traditional outfits, regional styles, festivals, and ceremonies, enhanced with cutting-edge AI features like a knowledgeable chatbot and a virtual clothing try-on experience.

---

### 📺 Demo Video

Check out the demo of **VastraVerse** in action:

[![Watch the video](https://img.youtube.com/vi/K3LUcsrhW78/maxresdefault.jpg)](https://youtu.be/K3LUcsrhW78)

> Click the thumbnail or [watch on YouTube](https://youtu.be/K3LUcsrhW78)

---

## 🌟 Features

### 🧵 Comprehensive Cultural Information
Browse extensive content on various aspects of Indian culture, including:

- Traditional Outfits (Sarees, Kurtas, Lehengas, etc.)
- Regional Styles & Traditions
- Indian Festivals & Calendar
- Cultural Guides
- Ceremonies & Rituals
- Outfit Dictionary
- Blog Articles

### 🤖 AI-Powered Chatbot
Engage with an intelligent chatbot (powered by *Google Gemini*) knowledgeable about Indian culture. Ask questions about traditions, clothing, festivals, and more.

### 👗 AI Virtual Try-On
Upload your photo and use our AI-powered feature (leveraging *ComfyUI* and *Stable Diffusion* with *IP-Adapter*) to virtually try on different traditional Indian outfits based on text prompts.

### 👤 User Accounts
Sign up and log in to personalize your experience.  
> *Note:* Current implementation uses browser localStorage (see *Security Warning* below).

### 💡 Interactive UI
Enjoy a user-friendly interface with:
- Dark/Light Mode
- Responsive Design
- Search Functionality

---

## 🛠 Technology Stack

- *Frontend:* HTML, CSS (*Tailwind CSS*), JavaScript  
- *Backend:* Python, Flask  
- *AI Chatbot:* Google Gemini API  
- *AI Image Generation:* ComfyUI, Stable Diffusion v1.5, IP-Adapter  
- *Database:* Browser localStorage (for user data, chat history - see Security Warning)  
- *Python Libraries:*  
  Flask, google-generativeai, Flask-Cors, python-dotenv, Pillow, requests, PyTorch, diffusers, transformers, etc. (see requirements.txt)

---

## ⚙ Setup and Installation

Follow these steps to set up and run VastraVerse locally.

### 1. Prerequisites

- Git  
- Python 3.9 or higher  
- pip (Python package installer)  
- A running instance of *ComfyUI* (for the Virtual Try-On feature)

### 2. Clone the Repository

```bash
git clone https://github.com/sachiin0209/-sachiin0209-VastraVerse_main.git
cd -sachiin0209-VastraVerse_main
code ./
```

### 3. Set up Python Environment

It is recommended to use a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate
pip install -r requirements.txt
```
Note: The requirements.txt includes PyTorch with CUDA 11.8 (+cu118). If you don't have an NVIDIA GPU or have a different CUDA version, adjust the PyTorch install as per the PyTorch official guide.

### 4. Configure Environment Variables
Create a .env file in the root directory with:

```
# Your Google Gemini API Key (https://aistudio.google.com/app/apikey)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# URL of your running ComfyUI instance (default: http://localhost:8188)
COMFYUI_SERVER="http://localhost:8188"
```
Replace "YOUR_GEMINI_API_KEY" with your actual API key.

### 5. Set up ComfyUI
- Follow instructions on the ComfyUI GitHub repo to install and run it.
- Download and place these models in ComfyUI's model folders:
- Checkpoint: v1-5-pruned-emaonly.safetensors (Stable Diffusion v1.5)
- IP-Adapter Model: ip-adapter_sd15.bin (usually under ComfyUI/models/ipadapter/)
Launch the ComfyUI server (default http://localhost:8188).

### 6. Run the Flask Application
```bash
python comfyserver.py
```
Open your browser at http://localhost:5000 (or http://127.0.0.1:5000).

## Usage
- Browse Content: Explore traditional outfits, festivals, and culture from the navigation menu.
- Chatbot: Ask the AI chatbot questions about Indian culture.
- Virtual Try-On:
            - Upload a clear photo of yourself.
            - Enter a text prompt describing the outfit (e.g., “wearing a red Banarasi saree”).
            - Click Generate and wait for the AI to render the image.
- Download or share the generated image.
