const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
const botSelector = document.querySelector("#bot-selector");
const thinkingBar = document.querySelector(".thinking-bar");

// OpenAI API Key
const OPENAI_API_KEY = 'OPENAI_API_KEY';

const createChatli = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatli.innerHTML = chatContent;
    return chatli;
}

const handleChat = async (event) => {
    event.preventDefault();
    const userMessage = chatInput.value.trim().toLowerCase();
    const selectedBot = botSelector.value;
    if (!userMessage) return;

    chatbox.append(createChatli(chatInput.value.trim(), "outgoing"));
    chatInput.value = "";
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    thinkingBar.style.display = "block";

    await new Promise(resolve => setTimeout(resolve, 1200));

    let botResponse;
    if (selectedBot === "openai") {
        botResponse = await getBotResponse(userMessage);
    } else {
        botResponse = getDefaultResponse(userMessage);
    }

    thinkingBar.style.display = "none";
    chatbox.append(createChatli(botResponse, "incoming"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
}

const getDefaultResponse = (message) => {
    const defaultResponses = {
        "hi": "Hello! How can I help you?",
        "how are you?": "I'm just a bot, but I'm doing well! How about you?",
        "what is your name?": "I am a Default-Bot. Nice to meet you!",
        "help": "Sure! What do you need help with?",
        "what can you do?": "I can assist you with basic queries and provide information!",
        "tell me a joke.": "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "what is the weather like?": "I'm not sure, but you can check your local weather app for updates!",
        "what time is it?": "I can't tell the time, but you can check the clock on your device!",
        "where are you located?": "I exist in the digital space, ready to assist you anytime!",
        "can you tell me a fact?": "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3000 years old and still edible!",
        "what is your favorite color?": "As a bot, I don't have personal preferences, but I hear blue is quite popular!",
        "do you have any hobbies?": "I enjoy answering questions and helping users like you!",
        "can you sing?": "I can't sing, but I can share lyrics if you'd like!",
        "what is your purpose?": "My purpose is to assist you by providing information and answering your questions!",
        "are you a real person?": "No, I'm just a computer program designed to help with your queries!"
    };
    
    return defaultResponses[message] || "Sorry, I don't understand that.";
}

const getBotResponse = async (message) => {
    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                prompt: message,
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error from OpenAI:", errorData);
            return `Error: ${errorData.error.message}`;
        }

        const data = await response.json();
        return data.choices[0].text.trim();
    } catch (error) {
        console.error("Network error:", error);
        return "Network error. Please try again later.";
    }
};

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        handleChat(event);
    }
});
