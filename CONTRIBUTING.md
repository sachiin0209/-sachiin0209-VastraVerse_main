# 🤝 Contributing to VastraVerse

Welcome to *VastraVerse* — a web application that explores Indian culture, traditions, and fashion with detailed cultural information and an interactive AI chatbot.  
This document will guide you through contributing effectively and professionally as part of *GirlScript Summer of Code 2025*. 🚀

---

## 📑 Table of Contents
- [🌟 Getting Started](#-getting-started)
- [🛠 Development Setup](#-development-setup)
- [🔄 How to Contribute](#-how-to-contribute)
- [📝 Coding Guidelines](#-coding-guidelines)
- [🧪 Testing](#-testing)
- [🔍 Code Review Process ](#-code-review-process)
- [📖 Documentation](#-documentation)
- [💡 Feature Requests & Bug Reports](#-feature-requests--bug-reports)
- [🚀 Good First Issues](#-good-first-issues)
- [📞 Communication](#-communication)
- [🌐 Community Guidelines](#-community-guidelines)
- [📜 Code of Conduct](#-code-of-conduct)
- [🎉 Recognition](#-recognition)
- [❓ Need Help?](#-need-help)


---

## 🌟 Getting Started

### Prerequisites

Make sure you have the following installed before you start:

- Git  
- Python 3.9 or higher  
- pip (Python package installer)  
- Node.js v18 or higher (check with `node -v` in your terminal)
- A code editor like VS Code  
- A running instance of ComfyUI (required for the AI Virtual Try-On feature)

### Tech Stack Overview

- Frontend: HTML, CSS (Tailwind CSS), JavaScript  
- Backend: Python, Flask  
- AI Chatbot: Google Gemini API  
- AI Image Generation: ComfyUI, Stable Diffusion v1.5, IP-Adapter  
- Database: Browser localStorage (for user data and chat history)  
- Python Libraries: Flask, google-generativeai, Flask-Cors, python-dotenv, Pillow, requests, PyTorch, diffusers, transformers, etc. (see requirements.txt)

---

## 🛠 Development Setup

1. *Fork the Repository*  
   - Visit the [VastraVerse repository](https://github.com/original-repo/VastraVerse) on GitHub.  
   - Click the *"Fork"* button in the top-right corner.  
   - This will create a copy of the repository in your GitHub account.  

2. *Clone Your Fork*  
   - Clone your forked repository:  
     ```bash
     git clone https://github.com/YOUR-USERNAME/VastraVerse.git
     ```
       
   - Navigate to the project directory:  
     ```bash
     cd VastraVerse
     ```
       
   - Add the original repository as upstream:  
     ```bash
     git remote add upstream https://github.com/original-repo/VastraVerse.git
     ```
       

3. *Set Up Python Virtual Environment*  
   - Create a virtual environment:  
     ```bash
     python -m venv venv
     ```
       
   - Activate it:  
     - On macOS/Linux:  
       ```bash
       source venv/bin/activate
       ```
         
     - On Windows:  
       ```bash
       venv\Scripts\activate
       ```
         

4. *Install Dependencies*  
   - Install Python dependencies:  
     ```bash
     pip install --upgrade pip
     pip install -r requirements.txt
     ```
       
   - If you are working on frontend code, install Node.js dependencies:  
     ```bash
     npm install
     ```

5. *Configure Environment Variables* 
    - Create a .env file in the root directory with the following:
      # Replace with your own API key from Google AI Studio
       GEMINI_API_KEY="your_real_gemini_api_key"

      # ComfyUI server URL (do not change unless you have a custom setup)
       COMFYUI_SERVER="http://localhost:8188"

- Make sure to replace your_real_gemini_api_key with your actual Gemini API key from [Google AI Studio](https://aistudio.google.com/).
   

6. *Set Up ComfyUI*  
   - Install [ComfyUI](https://github.com/comfyanonymous/ComfyUI).  
   -  Download the required Stable Diffusion v1.5 checkpoint.
   - Download the required IP-Adapter model (place under ComfyUI/models/ipadapter/).

7. *Run the Flask Application*  
   - Start the Flask backend:  
     ```bash
     python comfyserver.py
     ```
       
   - Open the app in your browser at:  
     
     http://localhost:5000

---

---

## 🔄 How to Contribute

### Step 1: Pick an Issue
1. Browse the *open issues* in the repository.  
2. Look for labels such as good first issue, beginner-friendly, or help wanted.  
3. Comment on the issue mentioning you’d like to work on it.  
4. Wait for a maintainer to *assign* the issue to you before starting.  
5. Make sure the issue is still active (some may already be solved in other branches).  

---

### Step 2: Create a Branch
```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name   # For new features
git checkout -b fix/issue-description       # For bug fixes
```

> *Tip:* Use lowercase letters and hyphens for branch names to keep them consistent.

---

### Step 3: Make Your Changes
- Follow *coding best practices* for the tech stack used in this repository.  
- Keep functions small and *do one thing only*.  
- Add comments for *any complex logic*.  
- Test changes locally before committing.  

---

### Step 4: Commit Your Changes
```bash
git add .
git commit -m "feat: add new homepage layout"
```

*Commit Message Format:*
- feat: New features.  
- fix: Bug fixes.  
- docs: Documentation changes.  
- style: Formatting or style changes (no code logic changes).  
- refactor: Code structure changes without altering functionality.  
- test: Adding or updating tests.  
- chore: Maintenance tasks (build, dependency updates).  

---

### Step 5: Push and Create a Pull Request
```bash
git push origin feature/your-feature-name
```

1. Go to your fork on GitHub.  
2. Click *"Compare & pull request"*.  
3. Fill out the PR template with:  
   - Clear description of changes.  
   - Issue link.  
   - Screenshots (if UI changes).  
   - Testing steps.  

---

## 📝 Coding Guidelines

### HTML Guidelines
```html
<!-- ✅ Good: Use semantic HTML -->
<header>
  <h1>Project Title</h1>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<!-- ❌ Avoid: Using too many divs without meaning -->
<div>
  <div>Project Title</div>
</div>
```
- Always use *semantic tags* (header, section, article, footer) instead of generic `div`s for better accessibility.  
- Use *alt text* for all images.  

---

### CSS/Tailwind Guidelines
```css
/* ✅ Good: Use class names that describe the purpose */
.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

/* ❌ Avoid: Vague names */
.blue-button {
  background-color: blue;
}
```

- Keep CSS organized and avoid inline styles where possible.  
- In Tailwind, *reuse utility classes* for consistency.  

---

### JavaScript/Python Guidelines
```javascript
// ✅ Good: Use clear variable names
const userAge = 25;

// ❌ Avoid: Non-descriptive
const x = 25;
```

- Keep functions short and descriptive.  
- Use comments only where logic is not obvious.  


---

## 🧪 Testing

### Automated Testing
- Backend tests are written using *PyTest*.
- Frontend linting is handled by *ESLint*.
- Run these before pushing changes:

```bash
npm run lint
npm run test
```

---
### Manual Testing Checklist
- The application runs without errors.  
- UI is responsive across devices.  
- All accessibility features work.  
- API requests return correct responses.  
- No console warnings.  

---

## 🔍 Code Review Process
- *Every pull request* will be reviewed by at least one project maintainer before it is merged.
- *Reviews check for:*
  - Code quality and readability.
  - Correct functionality and testing.
  - Consistency with project guidelines and style.
  - Clear and meaningful commit messages.
- *Review feedback* will be shared in the PR comments.  
  - If changes are needed, please update your PR by pushing new commits to the same branch.
  - Ask for clarification if any feedback is unclear — we are here to help.
- *Approval and merge:*
  - Once the reviewer is satisfied, they will approve and merge the PR.
  - PRs may be merged manually or via GitHub’s “Squash and merge” option for a cleaner commit history.
- *Response time:*  
  - We aim to review PRs within *2–3  days*.
  - During busy periods, review  may take longer.
- Please avoid working on new major changes until your current PR is reviewed, to keep the process smooth.


---


## 📖 Documentation
- Update *README.md* if new features are added.  
- Add *inline comments* for complex code.  
- Keep *folder structure documentation* updated.  

---

## 💡 Feature Requests & Bug Reports

### Reporting Bugs
Include:
1. Steps to reproduce the issue.  
2. Expected vs actual behavior.  
3. Screenshots or recordings.  
4. Console or terminal errors (if any).  

### Requesting Features
Include:
1. Problem your feature solves.  
2. Proposed solution.  
3. Why it benefits the project.  


Please submit all feature requests and bug reports via *GitHub Issues* using the correct template provided in this repository.

---

## 🚀 Good First Issues
- Improve button hover effects for better UX.
- Add small CSS animations for page transitions.
- Fixing typos in docs.  
- Improving responsiveness for mobile view.  

---

## 📞 Communication
- Use *GitHub Issues* for bug reports.  
- Use *GitHub Discussions* for questions.  
- Be polite and constructive.  

---

## 🌐 Community Guidelines
- Respect all contributors.  
- Provide clear, helpful feedback.  
- No spam or irrelevant comments.  
- Assume good intentions from others.
- Critique ideas, not people.
- Use inclusive language.

---

## 📜 Code of Conduct
All contributors are expected to follow these principles to keep our community welcoming and productive:
1. *Be respectful* — Value each other’s ideas, skills, and contributions.
2. *Use constructive feedback* — Critique the work, not the person.
3. *Communicate clearly* — Keep discussions relevant and professional.
4. *Collaborate openly* — Share knowledge and help others when possible.
5. *Stay inclusive* — Use language and behavior that make everyone feel welcome, regardless of background, experience level, or identity.
6. *Keep it safe* — Do not share sensitive information or malicious code.

*Violations* of this code may result in warnings, PR rejections, or removal from the project in severe cases.  
Our goal is to keep this a positive and collaborative space for all.

➡ ➡ For full details, please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 🎉 Recognition
Contributors will:
- Be added to the *Contributors List*.  
- Receive acknowledgment in release notes.  
- Earn *GirlScript Summer of Code* points.  

---

## ❓ Need Help?
1. Check the documentation.  
2. Search existing discussions.  
3. Open a *question* issue if still unresolved.  

---

🙏 *Thank You!*  
Your contribution helps this project grow.  
This project is part of *GirlScript Summer of Code 2025*.  
Let’s build something impactful together! 🚀