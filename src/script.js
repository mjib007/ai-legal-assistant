// ===========================================
// AI 法律助手 - 專業版
// 版本: 2.0 (升級版)
// ===========================================

// 🚦 風險等級定義
const RISK_LEVELS = {
    GREEN: { 
        color: '#28a745', 
        label: '低風險', 
        action: '可直接處理',
        icon: '✅'
    },
    YELLOW: { 
        color: '#ffc107', 
        label: '中風險', 
        action: '需要審查',
        icon: '⚠️'
    },
    RED: { 
        color: '#dc3545', 
        label: '高風險', 
        action: '需要專業意見',
        icon: '🚫'
    }
};

// 📚 擴展的台灣法律知識庫
const taiwanLegalDatabase = {
    "民法": {
        content: "民法是規範私人之間權利義務關係的法律，包含人格權、物權、債權、親屬、繼承等五編。",
        risk: "GREEN",
        keywords: ["民法", "私法", "契約", "物權", "債權"],
        relatedTopics: ["契約法", "物權法", "損害賠償"]
    },
    "合約糾紛": {
        content: "合約糾紛可透過協商、調解、仲裁或訴訟解決。建議先嘗試友好協商，必要時尋求專業律師協助。",
        risk: "YELLOW",
        keywords: ["合約", "契約", "糾紛", "爭議"],
        relatedTopics: ["調解程序", "仲裁制度", "訴訟流程"]
    },
    "法律扶助": {
        content: "符合資格者可向法律扶助基金會申請，提供免費法律諮詢、訴訟代理等服務。",
        risk: "GREEN",
        keywords: ["法扶", "法律扶助", "免費諮詢"],
        relatedTopics: ["申請條件", "服務內容", "聯絡方式"]
    },
    "時效": {
        content: "民法規定請求權時效為15年，但特定情況有較短時效，如侵權行為為2年。時效完成後，債務人得拒絕給付。",
        risk: "RED",
        keywords: ["時效", "消滅時效", "請求權"],
        relatedTopics: ["時效中斷", "時效完成", "除斥期間"]
    },
    "違約金": {
        content: "違約金不得過高，民法第252條規定法院得減至相當數額。實務上約為契約總額的20-30%較為合理。",
        risk: "YELLOW",
        keywords: ["違約金", "損害賠償", "懲罰性違約金"],
        relatedTopics: ["違約責任", "損害計算", "法院減額"]
    }
};

// 🔄 合約審核工作流程
const contractReviewWorkflow = [
    {
        step: 1,
        title: "基本資訊檢查",
        checks: ["當事人資格", "合約標的", "履行期限", "權利義務"],
        riskFactors: ["資格不符", "標的不明", "期限過短"]
    },
    {
        step: 2,
        title: "風險評估",
        checks: ["違約責任", "損害賠償", "管轄法院", "適用法律"],
        riskFactors: ["責任過重", "賠償無限", "管轄不當"]
    },
    {
        step: 3,
        title: "合規檢查",
        checks: ["強制規定", "消保法", "公平交易", "主管機關"],
        riskFactors: ["違法條款", "不公平條款", "未經核准"]
    }
];

// 📨 發送訊息功能
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
            // 模擬AI思考時間
            setTimeout(() => {
                const response = generateAdvancedResponse(message);
                addMessage(response.content, 'bot-message', response.risk);
            }, 1000);
        }
    }
}

// 🎯 範例問題功能
function askExample(question) {
    document.getElementById('user-input').value = question;
    sendMessage();
}

// 💬 新增訊息到聊天區（升級版）
function addMessage(text, className, riskLevel = null) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    
    if (className === 'user-message') {
        messageDiv.innerHTML = `<strong>您：</strong>${text}`;
    } else {
        let riskBadge = '';
        if (riskLevel && RISK_LEVELS[riskLevel]) {
            const risk = RISK_LEVELS[riskLevel];
            riskBadge = `<span class="risk-badge" style="background-color: ${risk.color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 10px;">${risk.icon} ${risk.label}</span>`;
        }
        messageDiv.innerHTML = `<strong>AI 助手：</strong>${text}${riskBadge}`;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 🧠 進階回應生成（專業版）
function generateAdvancedResponse(question) {
    // 檢查合約審核關鍵字
    if (question.includes('合約') || question.includes('契約') || question.includes('審核')) {
        return handleContractReview(question);
    }
    
    // 搜尋台灣法律知識庫
    for (let key in taiwanLegalDatabase) {
        const item = taiwanLegalDatabase[key];
        if (item.keywords.some(keyword => question.includes(keyword))) {
            return {
                content: `${item.content}\n\n📋 相關主題：${item.relatedTopics.join('、')}`,
                risk: item.risk
            };
        }
    }
    
    // 預設回應
    return {
        content: "這是一個很好的法律問題。建議您諮詢專業律師以獲得更準確的法律建議。您也可以嘗試以下指令：\n• /review-contract - 合約審核\n• /risk-check - 風險檢查",
        risk: "YELLOW"
    };
}

// 📄 合約審核處理
function handleContractReview(question) {
    const reviewSteps = contractReviewWorkflow.map(step => 
        `**${step.step}. ${step.title}**\n✓ ${step.checks.join('\n✓ ')}\n⚠️ 注意：${step.riskFactors.join('、')}`
    ).join('\n\n');
    
    return {
        content: `🔍 **合約審核工作流程**\n\n${reviewSteps}\n\n📋 **建議**：請依照上述步驟逐項檢查，如發現高風險項目請立即尋求專業法律意見。`,
        risk: "YELLOW"
    };
}

// ⚡ 指令處理功能
function handleCommand(command) {
    switch(command.toLowerCase()) {
        case '/review-contract':
            const reviewResult = {
                content: "🔍 **合約審核模式啟動**\n\n請提供合約內容或描述具體條款，我將協助您進行專業審核。\n\n**審核重點：**\n✅ 基本資訊檢查\n⚠️ 風險評估分析\n🔒 合規性確認",
                risk: "YELLOW"
            };
            addMessage(reviewResult.content, 'bot-message', reviewResult.risk);
            break;
            
        case '/risk-check':
            addMessage("⚠️ **風險檢查功能**\n\n🟢 低風險：一般法律諮詢\n🟡 中風險：合約條款審核\n🔴 高風險：時效問題、重大違約", 'bot-message', 'YELLOW');
            break;
            
        default:
            addMessage("❓ 未知指令。可用指令：\n• /review-contract - 合約審核\n• /risk-check - 風險檢查", 'bot-message', 'GREEN');
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
    console.log('🚀 AI 法律助手專業版已啟動');
    console.log('📚 台灣法律知識庫已載入');
    console.log('🔧 專業工作流程已就緒');
});