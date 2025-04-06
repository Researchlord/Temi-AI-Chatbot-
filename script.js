
const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");

const chatBotName = "Temi";
const chatBotOwner = "Emmanuel Ogunbamerun also known as Dev Emma";

const API_KEY = "AIzaSyAKWNxQOx_nIRFN4S-zdEKBu8-YEZLoJBg";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let userMessage = "";
const chatHistory = [];

const scrollToBottom = () => {
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
};

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

const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const generateResponse = async (botMsgDiv) => {
    const textElement = botMsgDiv.querySelector(".message-text");

    if (userMessage.toLowerCase().includes("what is your name")) {
        return typingEffect("I am Temi, how may I help you?", textElement);
    } else if (
        userMessage.toLowerCase().includes("who created you") ||
        userMessage.toLowerCase().includes("who is your creator")
    ) {
        return typingEffect(`I was created by ${chatBotOwner}.`, textElement);
    }

    chatHistory.push({
        role: "user",
        parts: [{ text: userMessage }],
    });

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: chatHistory }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        const responseText = data.candidates[0].content.parts[0].text.trim();
        typingEffect(responseText, textElement);
    } catch (error) {
        console.error("API Error:", error);
        typingEffect("Oops! Something went wrong. Please try again.", textElement);
    }
};

const handleFormSubmit = (e) => {
    e.preventDefault();
    userMessage = promptInput.value.trim();
    if (!userMessage) return;

    promptInput.value = "";

    const userMsgDiv = document.createElement("div");
    userMsgDiv.classList.add("message", "user-message");
    userMsgDiv.innerHTML = `
        <div class="message-text">${userMessage}</div>
        <span class="timestamp">${getTimestamp()}</span>
    `;
    chatsContainer.appendChild(userMsgDiv);

    const botMsgDiv = document.createElement("div");
    botMsgDiv.classList.add("message", "bot-message");
    botMsgDiv.innerHTML = `
        <img src="https://cdn-icons-png.flaticon.com/512/4086/4086679.png" alt="Bot" class="bot-avatar">
        <div class="message-bubble">
            <p class="message-text">Thinking...</p>
            <span class="timestamp">${getTimestamp()}</span>
        </div>
    `;
    chatsContainer.appendChild(botMsgDiv);

    scrollToBottom();
    setTimeout(() => generateResponse(botMsgDiv), 600);
};

promptForm.addEventListener("submit", handleFormSubmit);
