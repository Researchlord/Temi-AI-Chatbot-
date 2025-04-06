const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");

const chatBotName = "Temi";
const chatBotOwner = "Emmanuel Ogunbamerun also known as Dev Emma";

// API Setup
const API_KEY = "YOUR_API_KEY_HERE";  // Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let userMessage = "";
const chatHistory = [];

// Scroll to bottom
const scrollToBottom = () => {
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
};

// Typing effect
const typingEffect = (text, element) => {
    element.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text[i++];
            scrollToBottom();
        } else {
            clearInterval(interval);
        }
    }, 40);
};

// Generate AI response using API
const generateResponse = async (botMsgDiv) => {
    const textElement = botMsgDiv.querySelector(".message-text");

    // Check for hardcoded responses
    if (userMessage.toLowerCase().includes("what is your name")) {
        return typingEffect("I am Temi, how may I help you?", textElement);
    } else if (
        userMessage.toLowerCase().includes("who created you") ||
        userMessage.toLowerCase().includes("who is your creator")
    ) {
        return typingEffect(`I was created by ${chatBotOwner}.`, textElement);
    }

    // Add user message to chat history
    chatHistory.push({
        role: "user",
        parts: [{ text: userMessage }],
    });

    try {
        // Send request to API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: chatHistory }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        // Extract response text
        const responseText = data.candidates[0].content.parts[0].text.trim();

        // Display response with typing effect
        typingEffect(responseText, textElement);
    } catch (error) {
        console.error("API Error:", error);
        typingEffect("Oops! Something went wrong. Please try again.", textElement);
    }
};

// Handle form submission
const handleFormSubmit = (e) => {
    e.preventDefault();
    userMessage = promptInput.value.trim();
    if (!userMessage) return;

    promptInput.value = "";

    // User message
    const userMsgDiv = document.createElement("div");
    userMsgDiv.classList.add("user-message");
    userMsgDiv.textContent = userMessage;
    chatsContainer.appendChild(userMsgDiv);

    // Bot response
    const botMsgDiv = document.createElement("div");
    botMsgDiv.classList.add("bot-message");
    botMsgDiv.innerHTML = `<p class="message-text">Thinking...</p>`;
    chatsContainer.appendChild(botMsgDiv);

    scrollToBottom();

    setTimeout(() => {
        generateResponse(botMsgDiv);
    }, 600);
};

promptForm.addEventListener("submit", handleFormSubmit);
