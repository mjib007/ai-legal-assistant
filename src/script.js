// 🧠 Session 管理功能
function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('legal-assistant-session');
    if (!sessionId) {
        sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('legal-assistant-session', sessionId);
    }
    return sessionId;
}
// 🧠 真正的 AI 回應生成（連接 n8n + OpenAI）
async function generateAdvancedResponse(question) {
    try {
        // 顯示載入中訊息
        addMessage("🤔 LegalMind AI 正在思考中...", 'bot-message');
        
        // 呼叫 n8n webhook
        const response = await fetch('https://mjib007.zeabur.app/webhook/legal-assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question,
                sessionId: getOrCreateSessionId()
})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // 移除載入中訊息
        const chatMessages = document.getElementById('chat-messages');
        const lastMessage = chatMessages.lastElementChild;
        if (lastMessage && lastMessage.textContent.includes('正在思考中')) {
            chatMessages.removeChild(lastMessage);
        }

        // 回傳格式化的回應
        return {
            content: result.data.content,
            risk: result.data.risk,
            risk_color: result.data.risk_color,
            risk_icon: result.data.risk_icon,
            risk_label: result.data.risk_label,
            related_topics: result.data.related_topics || [],
            recommendations: result.data.recommendations || []
        };

    } catch (error) {
        console.error('AI 呼叫失敗:', error);
        
        // 移除載入中訊息
        const chatMessages = document.getElementById('chat-messages');
        const lastMessage = chatMessages.lastElementChild;
        if (lastMessage && lastMessage.textContent.includes('正在思考中')) {
            chatMessages.removeChild(lastMessage);
        }
        
        // 回傳錯誤訊息（但仍保持格式）
        return {
            content: "抱歉，AI 服務暫時無法使用。請稍後再試，或檢查網路連線。\n\n💡 提示：確保 n8n workflow 正在運行中。",
            risk: "YELLOW",
            risk_color: "#ffc107",
            risk_icon: "⚠️",
            risk_label: "系統提醒"
        };
    }
}

// 🎯 修改發送訊息功能（支援真正 AI）
function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user-message');
        input.value = '';
        
        // 檢查是否為專業指令
        if (message.startsWith('/')) {
            handleCommand(message);
        } else {
            // 呼叫真正的 AI
            generateAdvancedResponse(message).then(response => {
                addMessage(response.content, 'bot-message', response.risk, response);
            });
        }
    }
}

// 💬 升級版新增訊息功能（支援完整資訊顯示）
function addMessage(text, className, riskLevel = null, fullResponse = null) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    
    if (className === 'user-message') {
        messageDiv.innerHTML = `<strong>您：</strong>${text}`;
    } else {
        let riskBadge = '';
        let additionalInfo = '';
        
        // 風險標籤
        if (riskLevel && fullResponse) {
            riskBadge = `<span class="risk-badge" style="background-color: ${fullResponse.risk_color}; color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; margin-left: 10px; font-weight: bold;">${fullResponse.risk_icon} ${fullResponse.risk_label}</span>`;
        }
        
        // 相關主題和建議
        if (fullResponse && fullResponse.related_topics && fullResponse.related_topics.length > 0) {
            additionalInfo += `<div style="margin-top: 10px; padding: 8px; background-color: #f8f9fa; border-left: 3px solid #007bff; border-radius: 4px;">`;
            additionalInfo += `<small><strong>📚 相關主題：</strong>${fullResponse.related_topics.join('、')}</small>`;
            additionalInfo += `</div>`;
        }
        
        if (fullResponse && fullResponse.recommendations && fullResponse.recommendations.length > 0) {
            additionalInfo += `<div style="margin-top: 8px; padding: 8px; background-color: #fff3cd; border-left: 3px solid #ffc107; border-radius: 4px;">`;
            additionalInfo += `<small><strong>💡 建議：</strong><br>• ${fullResponse.recommendations.join('<br>• ')}</small>`;
            additionalInfo += `</div>`;
        }
        
        // 處理換行和格式
            const formattedText = text.replace(/\n/g, '<br>').replace(/\d+\.\s/g, '<br>$&');
            messageDiv.innerHTML = `<strong>LegalMind AI：</strong>${formattedText}${riskBadge}${additionalInfo}`;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
// 🎯 範例問題功能
function askExample(question) {
    // 直接呼叫 sendMessage 的邏輯，但先設定問題
    addMessage(question, 'user-message');
    
    // 檢查是否為專業指令
    if (question.startsWith('/')) {
        handleCommand(question);
    } else {
        // 呼叫真正的 AI
        generateAdvancedResponse(question).then(response => {
            addMessage(response.content, 'bot-message', response.risk, response);
        });
    }
}

// ⌨️ 按Enter鍵發送訊息
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 🎉 系統初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 LegalMind AI 已啟動');
    console.log('📚 真正的 AI 驅動系統已就緒');
    console.log('🔗 連接到：https://mjib007.zeabur.app/webhook/legal-assistant');
});