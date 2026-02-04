// 簡單的法律問答資料庫
const legalDatabase = {
    "民法": "民法是規範私人之間權利義務關係的法律，包含人格權、物權、債權、親屬、繼承等五編。",
    "合約糾紛": "合約糾紛可透過協商、調解、仲裁或訴訟解決。建議先嘗試友好協商，必要時尋求專業律師協助。",
    "法律扶助": "符合資格者可向法律扶助基金會申請，提供免費法律諮詢、訴訟代理等服務。"
};

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user-message');
        input.value = '';
        
        // 模擬AI思考時間
        setTimeout(() => {
            const response = generateResponse(message);
            addMessage(response, 'bot-message');
        }, 1000);
    }
}

function askExample(question) {
    document.getElementById('user-input').value = question;
    sendMessage();
}

function addMessage(text, className) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    
    if (className === 'user-message') {
        messageDiv.innerHTML = `<strong>您：</strong>${text}`;
    } else {
        messageDiv.innerHTML = `<strong>AI 助手：</strong>${text}`;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateResponse(question) {
    // 簡單的關鍵字匹配
    for (let key in legalDatabase) {
        if (question.includes(key)) {
            return legalDatabase[key];
        }
    }
    
    return "這是一個很好的法律問題。建議您諮詢專業律師以獲得更準確的法律建議。";
}

// 按Enter鍵發送訊息
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});