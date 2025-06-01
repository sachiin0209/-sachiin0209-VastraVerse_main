document.addEventListener('DOMContentLoaded', function() {
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');
  const suggestedQuestions = document.querySelectorAll('.suggested-question');

  // Store conversation history for context
  let conversationHistory = [];

  // Function to add a user message to the chat
  function addUserMessage(message) {
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'flex items-start justify-end mb-4';
    userMessageDiv.innerHTML = `
      <div class="mr-3 bg-pink-500 p-3 rounded-lg rounded-tr-none max-w-md text-white">
        <p>${message}</p>
      </div>
      <div class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center shrink-0">
        <i class="fas fa-user text-white text-xs"></i>
      </div>
    `;
    chatMessages.appendChild(userMessageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add to conversation history
    conversationHistory.push({
      role: "user",
      content: message
    });
  }

  // Function to add a bot message to the chat word-by-word
  function addBotMessage(message) {
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'flex items-start mb-4';
    botMessageDiv.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
        <i class="fas fa-robot text-white text-xs"></i>
      </div>
      <div class="ml-3 bg-gray-700 p-3 rounded-lg rounded-tl-none max-w-md chat-message">
        <div id="bot-typing-content"></div>
      </div>
    `;

    chatMessages.appendChild(botMessageDiv);
    
    // Initial scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const botTextContainer = botMessageDiv.querySelector('#bot-typing-content');
    
    // Split by words but preserve HTML tags
    const parts = splitTextPreservingHTML(message);
    let index = 0;
    
    // Track if user has scrolled up
    let userHasScrolled = false;
    
    // Add scroll event listener to detect user scrolling
    const scrollHandler = () => {
      // If user scrolls up (not at bottom), mark as scrolled
      userHasScrolled = chatMessages.scrollTop + chatMessages.clientHeight < chatMessages.scrollHeight - 50;
    };
    
    chatMessages.addEventListener('scroll', scrollHandler);

    // Add to conversation history once completed
    conversationHistory.push({
      role: "assistant",
      content: message
    });

    // Display message word by word
    const interval = setInterval(() => {
      if (index < parts.length) {
        botTextContainer.innerHTML += parts[index];
        
        // Only auto-scroll if user hasn't scrolled up
        if (!userHasScrolled) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        index++;
      } else {
        clearInterval(interval);
        // Remove scroll event listener when typing is complete
        chatMessages.removeEventListener('scroll', scrollHandler);
      }
    }, 50); // Adjust typing speed (ms per word)
  }
  
  // Function to split text while preserving HTML tags
  function splitTextPreservingHTML(text) {
    // This regex will match HTML tags or words
    const regex = /(<[^>]+>)|([^<]+)/g;
    const parts = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        // This is an HTML tag, keep it as is
        parts.push(match[1]);
      } else if (match[2]) {
        // This is text, split it into words
        const words = match[2].split(/\s+/);
        for (let i = 0; i < words.length; i++) {
          parts.push(words[i]);
          if (i < words.length - 1) {
            parts.push(' '); // Add space between words
          }
        }
      }
    }
    
    return parts;
  }

  // Function to show typing indicator
  function showTypingIndicator() {
    typingIndicator.classList.remove('hidden');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to hide typing indicator
  function hideTypingIndicator() {
    typingIndicator.classList.add('hidden');
  }

  // Function to get response from backend API
  async function getGeminiResponse(message) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error fetching response from API:', error);
      return "I'm sorry, I encountered an error processing your request. Please try again later.";
    }
  }

  // Handle form submission
  chatForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const message = messageInput.value.trim();

    if (message === '') return;

    // Add user message to chat
    addUserMessage(message);
    messageInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
      // Get response from Gemini API
      const response = await getGeminiResponse(message);

      // Hide typing indicator and add bot response
      hideTypingIndicator();
      addBotMessage(response);

      // Add suggested follow-up questions based on the context
      if (message.toLowerCase().includes('saree')) {
        addSuggestedQuestions(['How to drape a saree?', 'What saree to wear for a wedding?', 'Regional saree varieties']);
      } else if (message.toLowerCase().includes('festival')) {
        addSuggestedQuestions(['What to wear for Diwali?', 'Holi celebration attire', 'Navratri special outfits']);
      } else {
        addSuggestedQuestions(['Tell me about lehengas', 'What is a dhoti?', 'Traditional Kerala outfits']);
      }
    } catch (error) {
      hideTypingIndicator();
      addBotMessage("I'm sorry, I encountered an error. Please try again later.");
      console.error('Error:', error);
    }
  });

  // Handle suggested questions
  suggestedQuestions.forEach(button => {
    button.addEventListener('click', function() {
      const question = this.textContent;
      messageInput.value = question;
      chatForm.dispatchEvent(new Event('submit'));
    });
  });

  // Function to add new suggested questions
  function addSuggestedQuestions(questions) {
    // Remove existing suggested questions container
    let suggestedContainer = chatMessages.querySelector('.suggested-container');
    if (suggestedContainer) {
      suggestedContainer.remove();
    }

    suggestedContainer = document.createElement('div');
    suggestedContainer.className = 'suggested-container flex justify-center flex-wrap gap-2 mb-4';

    questions.forEach(question => {
      const button = document.createElement('button');
      button.className = 'suggested-question bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-full text-sm transition-colors';
      button.textContent = question;

      button.addEventListener('click', function() {
        messageInput.value = question;
        chatForm.dispatchEvent(new Event('submit'));
      });

      suggestedContainer.appendChild(button);
    });

    chatMessages.appendChild(suggestedContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Add initial welcome message
  addBotMessage("Namaste! I'm your Cultural Fashion Assistant. I can help you learn about Indian traditional outfits, festival attire, and cultural practices. What would you like to know about?");

  // Add initial suggested questions
  addSuggestedQuestions(['What is a saree?', 'Tell me about Diwali outfits', 'How to wear a turban?']);
});
  