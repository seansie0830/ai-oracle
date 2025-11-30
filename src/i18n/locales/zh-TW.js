export default {
    common: {
        cancel: '取消',
        save: '儲存',
        dismiss: '關閉',
        send: '發送',
        loading: '載入中...',
        debugMode: '除錯模式已啟用',
        switchToReal: '切換至真實模式',
        copy: '複製',
        copied: '已複製',
        failedToCopy: '複製失敗',
    },
    chat: {
        title: '神秘神諭',
        subtitle: '神聖的占卜體驗',
        placeholder: '尋求神諭的智慧...',
        thinking: '正在占卜宇宙能量...',
        welcomeDebug: '歡迎，追尋者。我是神秘神諭。[除錯模式] 嘗試 /markdown, /draw, /spread, 或 /deck 來測試功能。',
        welcome: '歡迎，追尋者。我是神秘神諭。請求塔羅牌占卜，我將為您解讀牌意。',
        clearChat: '清除對話',
        settings: '設定',
    },
    apiKeyModal: {
        title: '設定神諭',
        subtitle: '選擇您的提供者並輸入 API 金鑰',
        debugMessage: "您正在使用模擬 LLM 服務進行測試。此模式下不需要 API 金鑰。",
        chooseProvider: '選擇提供者',
        apiKey: 'API 金鑰',
        getKey: '取得金鑰',
        model: '模型',
        selectModel: '選擇模型',
        enterKeyToFetch: '輸入 API 金鑰以取得模型',
        fetchingModels: '正在取得模型...',
        noModelsFound: '找不到模型',
        trustDevice: '信任此裝置',
        trustDeviceSubtitle: '將 API 金鑰儲存在瀏覽器中。僅在個人、安全的裝置上啟用。',
        language: '語言 / Language',
        saveConfig: '儲存設定',
        disabledInDebug: '此功能在除錯模式下已停用。切換至真實模式以設定您的 API。',
        fetchError: '無法取得模型。請檢查您的 API 金鑰。',
    },
    errorModal: {
        suggestions: '建議：',
        supportedProviders: '支援的提供者：',
        testMode: '測試模式：',
        testModeMessage: '這是用於 UI 測試的模擬錯誤。真實服務的處理方式可能不同。',
        technicalDetails: '技術細節',
        errorCode: '錯誤代碼：',
        timestamp: '時間戳記：',
        copyError: '複製錯誤詳情',
    },
    mock: {
        markdownDemo: `# Markdown 渲染測試

神諭現在使用**格式化文本**說話！

## 支援的功能

1. **粗體文字** 和 *斜體文字*
2. \`行內程式碼\` 格式
3. 列表（有序和無序）
4. 連結等等！

### 程式碼區塊

\`\`\`javascript
const magic = () => {
  console.log("✨ 神秘代碼 ✨");
}
\`\`\`

### 塔羅智慧

> 牌面顯示 Markdown 為神聖訊息帶來了清晰度。

**嘗試這些指令：**
- \`/draw\` - 抽取單張牌
- \`/spread\` - 抽取三張牌牌陣
- \`/markdown\` - 再次顯示此訊息

---

*願您的解讀永遠充滿光明！* 🔮`,
        errors: {
            mystical: '宇宙能量正在變動。神諭此刻無法占卜。',
            network: '網路連線中斷',
            timeout: '請求在 30 秒後逾時',
            streaming: '串流連線中斷',
            rateLimit: '超出速率限制。請在 60 秒後重試。',
            generic: '模擬 LLM 錯誤：神秘連線發生錯誤'
        },
        responses: [
            '牌面低語著關於「{query}」的秘密... 神秘能量揭示了前方轉化與啟蒙的道路，預示著您即將踏上一段深刻的個人成長之旅，並在其中發現新的視角與潛力。',
            '我感覺到您關於「{query}」的問題舉足輕重。神諭顯示一段探索之旅正等著您，這段旅程將充滿意想不到的發現和挑戰，但最終會引導您走向更深層次的理解與智慧。',
            '宇宙力量因應您的提問「{query}」而排列。向內觀照，因為答案一直存在於您的靈魂之中，等待您透過冥想與反思來發掘，並將這些內在的智慧應用於您的現實生活。',
            '啊，您尋求關於「{query}」的智慧。古老的塔羅訴說著平衡、耐心以及尚未揭曉的隱藏真理，提醒您在面對複雜情境時，保持冷靜與沉著，並相信時間會揭示一切。',
            '您的話語「{query}」與靈性領域共鳴。靈體建議您在未來的道路上要謹慎與勇氣並存，因為前方的道路可能充滿未知，但只要您堅定信念，便能克服一切障礙，達成目標。'
        ]
    }
}
