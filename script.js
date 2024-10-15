const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

const createChatli = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatli.innerHTML = chatContent;
    return chatli;
}

const handleChat = (event) => {
    event.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.append(createChatli(userMessage, "outgoing"));
    chatInput.value = "";
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const botResponse = getBotResponse(userMessage);
        chatbox.append(createChatli(botResponse, "incoming"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 500);
}

const getBotResponse = (message) => {
    if (message.toLowerCase().includes("hello")) {
        return "Hello! How can I assist you today?";
    }
    if (message.toLowerCase().includes("help")) {
        return "Sure, I'm here to help! What do you need assistance with?";
    }
    return "I'm sorry, I didn't understand that.";
}

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        handleChat(event);
    }
});
