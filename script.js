/**
 * VastraVerse Main Script
 * Handles UI interactions, theme switching, navigation, and user authentication
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check user authentication state immediately
    checkAuthState();
  
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check user's preference from localStorage
    const darkMode = localStorage.getItem('vastraverse_dark_mode') !== 'false'; // Default to dark mode
    
    // Set initial theme
    if (darkMode) {
      html.classList.add('dark');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      html.classList.remove('dark');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Toggle theme on button click
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        
        // Update icon
        themeToggle.innerHTML = isDark ? 
          '<i class="fas fa-sun"></i>' : 
          '<i class="fas fa-moon"></i>';
        
        // Save preference to localStorage
        localStorage.setItem('vastraverse_dark_mode', isDark);
        
        // Apply animations to elements
        document.querySelectorAll('.theme-transition').forEach(el => {
          el.classList.add('animate-theme-change');
          setTimeout(() => {
            el.classList.remove('animate-theme-change');
          }, 500);
        });
      });
    }
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('py-2', 'shadow-lg');
          navbar.classList.remove('py-4');
        } else {
          navbar.classList.add('py-4');
          navbar.classList.remove('py-2', 'shadow-lg');
        }
      });
    }
    
    // Newsletter subscription
    const newsletterForms = document.querySelectorAll('form');
    newsletterForms.forEach(form => {
      if (form.querySelector('input[type="email"]') && !form.id) {
        form.addEventListener('submit', e => {
          e.preventDefault();
          
          const emailInput = form.querySelector('input[type="email"]');
          if (emailInput && emailInput.value) {
            // Save email to localStorage
            let subscribers = JSON.parse(localStorage.getItem('vastraverse_subscribers')) || [];
            
            // Only add if not already subscribed
            if (!subscribers.includes(emailInput.value)) {
              subscribers.push(emailInput.value);
              localStorage.setItem('vastraverse_subscribers', JSON.stringify(subscribers));
            }
            
            // Show notification
            showNotification('Thanks for subscribing to our newsletter!', 'success');
            
            // Clear input
            emailInput.value = '';
          }
        });
      }
    });
    
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', handleSignup);
    }
    
    // Handle logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Initialize page-specific features based on current page
    initializePageFeatures();

    // Example for traditions search
    const traditionNames = [
      "Bharatanatyam", "Kathakali", "Madhubani", "Dhokra", "Kathak", "Carnatic", "Bandhani"
      // ...add all tradition names
    ];
    const traditionInput = document.getElementById('traditionSearch');
    if (traditionInput) attachAutocomplete(traditionInput, traditionNames);

    // Example for outfits search
    const outfitNames = [
      "Saree", "Kurta Pajama", "Lehenga Choli", "Dhoti Kurta", "Salwar Kameez", "Mekhela Chador", "Pathani Suit", "Mundu", "Kasavu Set", "Bandhgala", "Phiran", "Ghaghara Choli"
      // ...add all outfit names
    ];
    const outfitInput = document.getElementById('outfitSearch');
    if (outfitInput) attachAutocomplete(outfitInput, outfitNames);

    // Example for FAQ search
    const faqQuestions = [
      "What is the Cultural Dressing Virtual Photoshoot?",
      "How does the AI try-on work?",
      "Is my data safe?",
      // ...add all FAQ questions
    ];
    const faqInput = document.getElementById('faqSearch');
    if (faqInput) attachAutocomplete(faqInput, faqQuestions);

    // Example for blog search
    const blogTitles = [
      "The Evolution of Sarees: From Ancient Drapes to Modern Fashion",
      "Karwa Chauth: Traditions, Outfits and Modern Celebrations",
      // ...add all blog titles
    ];
    const blogInput = document.querySelector('input[placeholder=\"Search articles...\"]');
    if (blogInput) attachAutocomplete(blogInput, blogTitles);

    // Example for outfit dictionary
    const dictionaryNames = [
      "Saree", "Lehenga Choli", "Salwar Kameez", "Juttis", "Kolhapuri Chappals", "Payal", "Kamarband", "Jhumka"
      // ...add all dictionary names
    ];
    const dictInput = document.querySelector('input[placeholder=\"Search by name...\"]');
    if (dictInput) attachAutocomplete(dictInput, dictionaryNames);
  });
  
  // Check authentication state and update UI accordingly
  function checkAuthState() {
    const currentUser = JSON.parse(localStorage.getItem('vastraverse_current_user'));
    const authSections = document.querySelectorAll('.auth-section');
    const guestSections = document.querySelectorAll('.guest-section');
    const userProfileElements = document.querySelectorAll('.user-profile-name');
    
    if (currentUser) {
      // User is logged in
      authSections.forEach(section => section.classList.remove('hidden'));
      guestSections.forEach(section => section.classList.add('hidden'));
      
      // Update user profile elements with user's name
      userProfileElements.forEach(element => {
        element.textContent = currentUser.name;
      });
      
      // Update mobile menu if it exists
      const mobileUserSection = document.getElementById('mobileUserSection');
      if (mobileUserSection) {
        mobileUserSection.innerHTML = `
          <div class="px-4 py-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Signed in as</p>
            <p class="truncate text-sm font-medium text-gray-800 dark:text-gray-200">${currentUser.email}</p>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700">
            <a href="profile.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Your Profile</a>
            <a href="#" id="mobileLogoutBtn" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Sign out</a>
          </div>
        `;
        
        // Add event listener to mobile logout button
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
        if (mobileLogoutBtn) {
          mobileLogoutBtn.addEventListener('click', handleLogout);
        }
      }
    } else {
      // No user logged in
      authSections.forEach(section => section.classList.add('hidden'));
      guestSections.forEach(section => section.classList.remove('hidden'));
    }
  }
  
  // Handle login form submission
  function handleLogin(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) return;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validate inputs
    if (!email || !password) {
      showNotification('Please enter both email and password', 'error');
      return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('vastraverse_users')) || [];
    
    // Find user with matching email
    const user = users.find(user => user.email === email);
    
    if (!user) {
      showNotification('No account found with this email', 'error');
      return;
    }
    
    // Simple password check (in a real app, you'd use proper password hashing)
    if (user.password !== password) {
      showNotification('Incorrect password', 'error');
      return;
    }
    
    // Set current user in localStorage (without password)
    const currentUser = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    localStorage.setItem('vastraverse_current_user', JSON.stringify(currentUser));
    
    // Show success notification
    showNotification('Login successful! Welcome back, ' + user.name, 'success');
    
    // Clear form
    emailInput.value = '';
    passwordInput.value = '';
    
    // Update UI based on auth state
    checkAuthState();
    
    // Redirect to home page or requested page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
  
  // Handle signup form submission
  function handleSignup(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('signupConfirmPassword');
    
    if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) return;
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('vastraverse_users')) || [];
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      showNotification('An account with this email already exists', 'error');
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      created: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('vastraverse_users', JSON.stringify(users));
    
    // Set as current user (without password)
    const currentUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };
    localStorage.setItem('vastraverse_current_user', JSON.stringify(currentUser));
    
    // Show success notification
    showNotification('Account created successfully! Welcome, ' + name, 'success');
    
    // Clear form
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    
    // Update UI based on auth state
    checkAuthState();
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
  
  // Handle logout
  function handleLogout(e) {
    e.preventDefault();
    
    // Remove current user from localStorage
    localStorage.removeItem('vastraverse_current_user');
    
    // Show notification
    showNotification('You have been logged out', 'success');
    
    // Update UI based on auth state
    checkAuthState();
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
  
  // Show notification
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.add('opacity-0', 'translate-y-2');
      notification.style.transition = 'opacity 0.5s, transform 0.5s';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }
  
  // Handle page-specific initializations
  function initializePageFeatures() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    switch (page) {
      case 'index.html':
      case '':
        // Home page specific code
        initializeHomePage();
        break;
      case 'chatbot.html':
        // Chatbot page specific code
        initializeChatbot();
        break;
      case 'Festival Calendar.html':
      case 'festival-calendar.html':
        // Festival calendar specific code
        initializeFestivalCalendar();
        break;
      case 'login.html':
      case 'signup.html':
        // Login/signup specific code
        // Already handled by event listeners
        break;
      case 'profile.html':
        // Profile page specific code
        initializeProfilePage();
        break;
      // Add other page initializations as needed
    }
  }
  
  // Home page specific initializations
  function initializeHomePage() {
    console.log('Home page loaded');
    
    // Example: Initialize a slider if it exists
    const featuredSlider = document.getElementById('featuredSlider');
    if (featuredSlider) {
      // Simple slider functionality
      let currentSlide = 0;
      const slides = featuredSlider.querySelectorAll('.slide');
      
      if (slides.length > 0) {
        // Show first slide
        slides[0].classList.remove('hidden');
        
        // Set up auto rotation
        setInterval(() => {
          slides[currentSlide].classList.add('hidden');
          currentSlide = (currentSlide + 1) % slides.length;
          slides[currentSlide].classList.remove('hidden');
        }, 5000);
      }
    }
  }
  
  // Chatbot page specific initializations
  function initializeChatbot() {
    console.log('Chatbot page loaded');
    
    // This would typically connect to a real chatbot service
    // For now, we'll create a simple echo bot
    
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('messages');
    
    if (chatForm && chatInput && messagesContainer) {
      // Load chat history from localStorage
      const chatHistory = JSON.parse(localStorage.getItem('vastraverse_chat_history')) || [];
      
      // Display existing messages
      chatHistory.forEach(msg => {
        const messageEl = document.createElement('div');
        messageEl.className = msg.type === 'user' ? 
          'flex justify-end mb-4' : 
          'flex justify-start mb-4';
        
        messageEl.innerHTML = `
          <div class="${msg.type === 'user' ? 
            'bg-pink-500 text-white' : 
            'bg-gray-700 text-gray-200'} rounded-lg px-4 py-2 max-w-xs sm:max-w-md">
            <p>${msg.text}</p>
            <p class="text-xs opacity-70 text-right mt-1">${formatTime(msg.timestamp)}</p>
          </div>
        `;
        
        messagesContainer.appendChild(messageEl);
      });
      
      // Auto scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Handle form submission
      chatForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        
        // Simulate bot response after a short delay
        setTimeout(() => {
          const responses = [
            "I can help you discover traditional Indian outfits for various occasions.",
            "Which region's traditional fashion are you interested in?",
            "For Diwali, sarees and kurta-pajamas are popular choices.",
            "Would you like to know about specific festival attire?",
            "Each Indian state has its unique traditional dress. Which state interests you?",
            "I'm your VastraVerse assistant, here to guide you through Indian fashion traditions!"
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          addMessage(randomResponse, 'bot');
        }, 1000);
      });
      
      // Function to add a message to the chat
      function addMessage(text, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = type === 'user' ? 
          'flex justify-end mb-4' : 
          'flex justify-start mb-4';
        
        const timestamp = new Date().getTime();
        
        messageEl.innerHTML = `
          <div class="${type === 'user' ? 
            'bg-pink-500 text-white' : 
            'bg-gray-700 text-gray-200'} rounded-lg px-4 py-2 max-w-xs sm:max-w-md">
            <p>${text}</p>
            <p class="text-xs opacity-70 text-right mt-1">${formatTime(timestamp)}</p>
          </div>
        `;
        
        messagesContainer.appendChild(messageEl);
        
        // Auto scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Save to chat history
        const chatHistory = JSON.parse(localStorage.getItem('vastraverse_chat_history')) || [];
        chatHistory.push({
          text,
          type,
          timestamp
        });
        
        // Limit history to last 50 messages
        if (chatHistory.length > 50) {
          chatHistory.shift();
        }
        
        localStorage.setItem('vastraverse_chat_history', JSON.stringify(chatHistory));
      }
      
      // Format timestamp
      function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
  }
  
  // Festival calendar specific initializations
  function initializeFestivalCalendar() {
    console.log('Festival Calendar page loaded');
    
    // This would dynamically populate festival data
    // For now, we'll just log that the page loaded
  }
  
  // Profile page initialization
  function initializeProfilePage() {
    console.log('Profile page loaded');
    
    const currentUser = JSON.parse(localStorage.getItem('vastraverse_current_user'));
    
    if (!currentUser) {
      // Redirect to login if not logged in
      window.location.href = 'login.html';
      return;
    }
    
    // Populate user details
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (userNameElement) {
      userNameElement.textContent = currentUser.name;
    }
    
    if (userEmailElement) {
      userEmailElement.textContent = currentUser.email;
    }
    
    // Handle profile update form
    const profileUpdateForm = document.getElementById('profileUpdateForm');
    if (profileUpdateForm) {
      // Populate form with current user data
      const nameInput = document.getElementById('profileName');
      const emailInput = document.getElementById('profileEmail');
      
      if (nameInput) nameInput.value = currentUser.name;
      if (emailInput) emailInput.value = currentUser.email;
      
      // Handle form submission
      profileUpdateForm.addEventListener('submit', e => {
        e.preventDefault();
        
        if (!nameInput || !emailInput) return;
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        if (!name || !email) {
          showNotification('Please fill in all fields', 'error');
          return;
        }
        
        // Get all users
        const users = JSON.parse(localStorage.getItem('vastraverse_users')) || [];
        
        // Find and update current user
        const userIndex = users.findIndex(user => user.id === currentUser.id);
        
        if (userIndex === -1) {
          showNotification('User not found', 'error');
          return;
        }
        
        // Check if email is already used by another user
        if (email !== currentUser.email && users.some(user => user.email === email && user.id !== currentUser.id)) {
          showNotification('Email is already in use by another account', 'error');
          return;
        }
        
        // Update user data
        users[userIndex].name = name;
        users[userIndex].email = email;
        
        // Save updated users array
        localStorage.setItem('vastraverse_users', JSON.stringify(users));
        
        // Update current user
        const updatedCurrentUser = {
          ...currentUser,
          name,
          email
        };
        
        localStorage.setItem('vastraverse_current_user', JSON.stringify(updatedCurrentUser));
        
        // Show success notification
        showNotification('Profile updated successfully', 'success');
        
        // Update UI
        if (userNameElement) userNameElement.textContent = name;
        if (userEmailElement) userEmailElement.textContent = email;
        
        // Update auth state to refresh UI across the site
        checkAuthState();
      });
    }
    
    // Handle password change form
    const passwordChangeForm = document.getElementById('passwordChangeForm');
    if (passwordChangeForm) {
      passwordChangeForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const currentPasswordInput = document.getElementById('currentPassword');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
        
        if (!currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) return;
        
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;
        
        if (!currentPassword || !newPassword || !confirmNewPassword) {
          showNotification('Please fill in all password fields', 'error');
          return;
        }
        
        if (newPassword !== confirmNewPassword) {
          showNotification('New passwords do not match', 'error');
          return;
        }
        
        // Get all users
        const users = JSON.parse(localStorage.getItem('vastraverse_users')) || [];
        
        // Find current user
        const userIndex = users.findIndex(user => user.id === currentUser.id);
        
        if (userIndex === -1) {
          showNotification('User not found', 'error');
          return;
        }
        
        // Check current password
        if (users[userIndex].password !== currentPassword) {
          showNotification('Current password is incorrect', 'error');
          return;
        }
        
        // Update password
        users[userIndex].password = newPassword;
        
        // Save updated users array
        localStorage.setItem('vastraverse_users', JSON.stringify(users));
        
        // Show success notification
        showNotification('Password changed successfully', 'success');
        
        // Clear form
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmNewPasswordInput.value = '';
      });
    }
  }
  
  // Dark mode toggle for the image upload functionality
  document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('vastraverse_dark_mode');
    if (savedTheme === 'true' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      html.classList.add('dark');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      html.classList.remove('dark');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Toggle dark mode
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('vastraverse_dark_mode', isDark);
        if (themeToggle) {
          themeToggle.innerHTML = isDark ?
            '<i class="fas fa-sun"></i>' :
            '<i class="fas fa-moon"></i>';
        }
      });
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', function(event) {
        if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target) && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      });
    }

    // Image upload and preview
    const imageUpload = document.getElementById('imageUpload');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const generateButton = document.getElementById('generateButton');
    const originalImageDisplay = document.getElementById('originalImageDisplay'); // Corrected ID
    const generatedImageSection = document.getElementById('generatedImageSection'); // Corrected ID
    const generatedResults = document.getElementById('generatedResults'); // Added ID for the new results section
    const downloadButton = document.getElementById('downloadButton');
    const shareButton = document.getElementById('shareButton');
    const tryAgainButton = document.getElementById('tryAgainButton'); // Added ID for try again button

    if (imageUpload && uploadPlaceholder) {
      // Initialize generate button state
      if (generateButton) {
        generateButton.disabled = true;
      }

      // File input change event
      imageUpload.addEventListener('change', function() {
        handleFileSelect(this.files[0]);
      });

      // Drag and drop events
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadPlaceholder.addEventListener(eventName, preventDefaults, false);
      });

      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      ['dragenter', 'dragover'].forEach(eventName => {
        uploadPlaceholder.addEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        uploadPlaceholder.addEventListener(eventName, unhighlight, false);
      });

      function highlight() {
        uploadPlaceholder.classList.add('dragover');
      }

      function unhighlight() {
        uploadPlaceholder.classList.remove('dragover');
      }

      uploadPlaceholder.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFileSelect(files[0]);
      });

      // Handle file selection
      function handleFileSelect(file) {
        if (!file) return;

        if (!file.type.match('image.*')) {
          showNotification('Please select an image file (JPEG, PNG, etc.)', 'error');
          return;
        }

        // Assign the selected file to the file input's files property
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        imageUpload.files = dataTransfer.files;

        const reader = new FileReader();

        reader.onload = function(e) {
          imagePreview.src = e.target.result;
          if (originalImageDisplay) { // Update original image display
            originalImageDisplay.src = e.target.result;
          }
          uploadPlaceholder.classList.add('hidden');
          imagePreviewContainer.classList.remove('hidden');
          imagePreviewContainer.classList.add('flex'); // Ensure flex display for centering

          // Enable generate button
          if (generateButton) {
            generateButton.disabled = false;
          }
        };

        reader.readAsDataURL(file);
      }

      // Handle remove image button
      const removeImage = document.getElementById('removeImage');
      if (removeImage) {
        removeImage.addEventListener('click', function() {
          imagePreview.src = '#';
          if (originalImageDisplay) {
            originalImageDisplay.src = '#';
          }
          imageUpload.value = '';
          imagePreviewContainer.classList.add('hidden');
          imagePreviewContainer.classList.remove('flex');
          uploadPlaceholder.classList.remove('hidden');
          if (generateButton) {
            generateButton.disabled = true;
          }
          if (generatedResults) { // Hide results section on removing image
            generatedResults.classList.add('hidden');
          }
        });
      }

      // Handle outfit style selection to update prompt (if these elements exist)
      const outfitStyle = document.getElementById('outfitStyle');
      const regionSelect = document.getElementById('regionSelect');
      const transformPrompt = document.getElementById('transformPrompt');

      if (outfitStyle && regionSelect && transformPrompt) {
        outfitStyle.addEventListener('change', updateTransformPrompt);
        regionSelect.addEventListener('change', updateTransformPrompt);

        // Initial prompt update on load
        updateTransformPrompt();
      }

      function updateTransformPrompt() {
        const style = outfitStyle ? outfitStyle.value : '';
        const region = regionSelect ? regionSelect.value : '';

        let defaultPrompt = "";

        if (style === 'saree') {
          defaultPrompt = `A full-body photograph of the same person in the input image, in the exact same pose and expression, now wearing a traditional silk saree`;

          if (region === 'south') {
            defaultPrompt += ` in South Indian Kanjeevaram style with gold zari border draped elegantly,`;
          } else if (region === 'east') {
            defaultPrompt += ` in Bengali Tant style with red border draped over shoulder,`;
          } else if (region === 'west') {
            defaultPrompt += ` in Gujarati style with decorative Bandhani pattern,`;
          } else {
            defaultPrompt += ` with a gold-embroidered border draped over shoulder,`;
          }
        } else if (style === 'lehenga') {
          defaultPrompt = `A full-body photograph of the same person in the input image, in the exact same pose and expression, now wearing a traditional embroidered lehenga choli`;
        } else if (style === 'kurta') {
          defaultPrompt = `A full-body photograph of the same person in the input image, in the exact same pose and expression, now wearing a traditional kurta pajama`;
        } else if (style === 'sherwani') {
          defaultPrompt = `A full-body photograph of the same person in the input image, in the exact same pose and expression, now wearing a traditional embroidered sherwani`;
        } else if (style === 'salwar') {
          defaultPrompt = `A full-body photograph of the same person in the input image, in the exact same pose and expression, now wearing a traditional salwar kameez`;
        } else if (style === 'dhoti') {
          defaultPrompt = `A full-body photograph of the same person in the input image, in the exact same pose and expression, now wearing a traditional white dhoti kurta`;
        } else if (style === 'custom') {
           defaultPrompt = `A full-body photograph of the same person in the input image, in the exact same pose and expression, now wearing a traditional Indian outfit`;
        }

        // Add quality descriptors to all prompts
        defaultPrompt += ` preserving their face, hairstyle, and posture, photorealistic, DSLR quality, rich colors, studio lighting`;

        // Update the prompt textarea
        if (transformPrompt) {
          transformPrompt.value = defaultPrompt;
        }
      }


      // Generate button functionality
      if (generateButton) {
        generateButton.addEventListener('click', function () {
          if (!imageUpload.files[0]) {
            showNotification('Please upload an image first', 'error');
            return;
          }

          if (!transformPrompt || !transformPrompt.value.trim()) {
            showNotification('Please provide a transformation prompt', 'error');
            return;
          }

          const formData = new FormData();
          formData.append('image', imageUpload.files[0]);
          formData.append('prompt', transformPrompt.value);

          if (generatedResults) {
             generatedResults.classList.remove('hidden');
          }
          const generatedImageDiv = document.querySelector('.generated-image');
          const loadingOverlay = document.querySelector('.loading-overlay');

          if (generatedImageDiv) generatedImageDiv.style.display = 'block';
          if (loadingOverlay) loadingOverlay.style.display = 'flex';


          console.log("Attempting to send image generation request..."); // Added console log

          // Make API request to server.py
          fetch('http://localhost:5000/generate', {
            method: 'POST',
            body: formData
          })
            .then(response => {
              if (!response.ok) throw new Error("Image generation failed");
              return response.blob();
            })
            .then(blob => {
              const imageUrl = URL.createObjectURL(blob);
              if (generatedImage) {
                generatedImage.src = imageUrl;
              }
              if (loadingOverlay) loadingOverlay.style.display = 'none';

              // Enable download
              if (downloadButton) {
                downloadButton.onclick = () => {
                  const a = document.createElement('a');
                  a.href = imageUrl;
                  a.download = 'generated_outfit.png';
                  a.click();
                };
              }
            })
            .catch(err => {
              console.error(err);
              showNotification("Failed to generate image.", 'error');
              if (loadingOverlay) loadingOverlay.style.display = 'none';
            });
        });
      }

      // Download button functionality (handled within generateButton click)

      // Share button functionality
      if (shareButton) {
        shareButton.addEventListener('click', function() {
          // In a real implementation, this would open sharing options
          showNotification('In a complete implementation, this would open sharing options for your image', 'info');
        });
      }

      // Try Again button functionality
      if (tryAgainButton) {
        tryAgainButton.addEventListener('click', function() {
          // Reset the form and hide results
          if (imageUpload) imageUpload.value = '';
          if (imagePreview) imagePreview.src = '#';
          if (originalImageDisplay) originalImageDisplay.src = '#';
          if (imagePreviewContainer) {
            imagePreviewContainer.classList.add('hidden');
            imagePreviewContainer.classList.remove('flex');
          }
          if (uploadPlaceholder) uploadPlaceholder.classList.remove('hidden');
          if (generateButton) generateButton.disabled = true;
          if (generatedResults) generatedResults.classList.add('hidden');
          const generatedImageDiv = document.querySelector('.generated-image');
          if (generatedImageDiv) generatedImageDiv.style.display = 'none';
          if (transformPrompt) transformPrompt.value = ''; // Clear prompt
          if (outfitStyle) outfitStyle.value = 'custom'; // Reset outfit style dropdown
          if (regionSelect) regionSelect.value = ''; // Reset region dropdown
          updateTransformPrompt(); // Update prompt based on reset dropdowns
        });
      }
    }

    // Animation on scroll (if needed, ensure elements have .fade-in or .slide-up classes)
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
      observer.observe(el);
    });
  });

  // --- Autocomplete & Search Suggestion ---
  (function() {
    // Inject minimal CSS for suggestion dropdown if not already present
    if (!document.getElementById('vastraverse-autocomplete-style')) {
      const style = document.createElement('style');
      style.id = 'vastraverse-autocomplete-style';
      style.textContent = `
        .autocomplete-suggestions {
          position: absolute;
          z-index: 1000;
          background: #222;
          color: #fff;
          border: 1px solid #ec4899;
          border-radius: 0.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          max-height: 220px;
          overflow-y: auto;
          width: 100%;
          margin-top: 2px;
        }
        .autocomplete-suggestion {
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .autocomplete-suggestion.active, .autocomplete-suggestion:hover {
          background: #ec4899;
          color: #fff;
        }
      `;
      document.head.appendChild(style);
    }

    // Main autocomplete function
    window.attachAutocomplete = function(input, suggestions) {
      let dropdown;
      let currentFocus = -1;
      input.setAttribute('autocomplete', 'off');
      input.parentNode.style.position = 'relative';

      function closeDropdown() {
        if (dropdown) {
          dropdown.parentNode.removeChild(dropdown);
          dropdown = null;
        }
        currentFocus = -1;
      }

      function showSuggestions(val) {
        closeDropdown();
        if (!val && !input.matches(':focus')) return;
        const filtered = suggestions.filter(s => s.toLowerCase().includes(val.toLowerCase()));
        if (filtered.length === 0) return;
        dropdown = document.createElement('div');
        dropdown.className = 'autocomplete-suggestions';
        filtered.forEach((s, idx) => {
          const item = document.createElement('div');
          item.className = 'autocomplete-suggestion';
          item.innerHTML = s.replace(new RegExp(val, 'ig'), match => `<b>${match}</b>`);
          item.addEventListener('mousedown', function(e) {
            e.preventDefault();
            input.value = s;
            closeDropdown();
            input.dispatchEvent(new Event('input'));
          });
          dropdown.appendChild(item);
        });
        input.parentNode.appendChild(dropdown);
      }

      input.addEventListener('input', function(e) {
        showSuggestions(this.value);
      });
      input.addEventListener('focus', function(e) {
        showSuggestions(this.value);
      });
      input.addEventListener('blur', function(e) {
        setTimeout(closeDropdown, 100); // Delay to allow click
      });
      input.addEventListener('keydown', function(e) {
        if (!dropdown) return;
        const items = dropdown.querySelectorAll('.autocomplete-suggestion');
        if (e.key === 'ArrowDown') {
          currentFocus++;
          if (currentFocus >= items.length) currentFocus = 0;
          setActive(items);
          e.preventDefault();
        } else if (e.key === 'ArrowUp') {
          currentFocus--;
          if (currentFocus < 0) currentFocus = items.length - 1;
          setActive(items);
          e.preventDefault();
        } else if (e.key === 'Enter') {
          if (currentFocus > -1 && items[currentFocus]) {
            items[currentFocus].dispatchEvent(new Event('mousedown'));
            e.preventDefault();
          }
        }
      });
      function setActive(items) {
        items.forEach((item, idx) => {
          item.classList.toggle('active', idx === currentFocus);
        });
      }
    };
  })();
