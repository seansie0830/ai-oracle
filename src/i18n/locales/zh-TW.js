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
        welcomeDebug: '歡迎，追尋者。我是神秘神諭。[除錯模式] 輸入 /help 查看所有可用指令，或嘗試 /draw, /spread, /deck 來測試功能。',
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
        helpText: `# 📖 可用指令

## 🎴 塔羅牌指令（完整牌組 - 78 張牌）
- **/draw** 或 **/card** - 從完整牌組中抽取單張隨機牌
- **/draw-reversed** 或 **/card-reversed** - 抽取單張牌，強制逆位
- **/spread** 或 **/spread-three** - 抽取三張牌牌陣（過去/現在/未來）
- **/celtic-cross** 或 **/spread-celtic** - 抽取凱爾特十字牌陣（10 張牌）

## 🌟 僅大阿爾克那指令（22 張牌）
- **/draw-major** 或 **/card-major** - 抽取單張大阿爾克那牌
- **/spread-major** 或 **/spread-three-major** - 三張牌牌陣（僅大阿爾克那）
- **/celtic-major** - 凱爾特十字牌陣（僅大阿爾克那）

## 🃏 互動式牌組
- **/deck** - 顯示互動式牌組（自行選擇牌）
- **/deck-multiple** - 顯示互動式牌組以選擇多張牌

## ✨ 測試與展示
- **/markdown** 或 **/md** - 顯示 Markdown 渲染展示
- **/help** - 顯示此說明訊息

## ⚠️ 錯誤測試指令
- **/error** 或 **/error-mystical** - 模擬神秘錯誤
- **/error-network** - 模擬網路錯誤
- **/error-timeout** - 模擬逾時錯誤
- **/error-stream** - 模擬串流錯誤
- **/error-rate** - 模擬速率限制錯誤

---

**提示：** 所有指令都以 **/** 開頭。輸入任何自然問題以獲得模擬塔羅牌解讀回應！`,
        markdownDemo: `# Markdown 渲染測試

神諭現在使用**格式化文本**說話！

## 支援的功能

1. **粗體文字** 和 *斜體文字*
2. **行內程式碼** 格式
3. 列表（有序和無序）
4. 連結等等！

### 程式碼區塊

**範例：**
const magic = () => {
  console.log("✨ 神秘代碼 ✨");
}

### 塔羅智慧

> 牌面顯示 Markdown 為神聖訊息帶來了清晰度。

**嘗試這些指令：**
- **/draw** - 抽取單張牌
- **/spread** - 抽取三張牌牌陣
- **/markdown** - 再次顯示此訊息

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
    },
    gallery: {
        title: '塔羅牌畫廊',
        subtitle: '探索完整的 78 張萊德偉特塔羅牌',
        backToOracle: '返回神諭',
        searchPlaceholder: '搜尋卡牌...',
        filters: {
            all: '所有卡牌',
            major: '大阿爾克那',
            wands: '權杖',
            cups: '聖杯',
            swords: '寶劍',
            pentacles: '錢幣'
        },
        noCardsFound: '找不到符合搜尋條件的卡牌。',
        majorArcana: '大阿爾克那',
        minorArcana: '小阿爾克那',
        meaning: '牌義',
        keywords: '關鍵字'
    },
    cards: {
        the_fool: {
            meaning: '愚者代表新的開始，對未來充滿信心，缺乏經驗，不知道會發生什麼，初學者的運氣，即興創作和相信宇宙。',
            keywords: '開始，天真，自發性，自由精神'
        },
        the_magician: {
            meaning: '魔術師代表顯化，足智多謀，力量，受啟發的行動。',
            keywords: '顯化，足智多謀，力量，受啟發的行動'
        },
        the_high_priestess: {
            meaning: '女祭司代表直覺，神聖知識，神聖女性，潛意識。',
            keywords: '直覺，神聖知識，神聖女性，潛意識'
        },
        the_empress: {
            meaning: '皇后代表豐饒，女性特質，美麗，自然，富足，母性。',
            keywords: '豐饒，女性特質，美麗，自然，富足'
        },
        the_emperor: {
            meaning: '皇帝代表權威，建立，結構，父親形象。',
            keywords: '權威，建立，結構，父親形象'
        },
        the_hierophant: {
            meaning: '教皇代表精神智慧，宗教信仰，從眾，傳統，制度。',
            keywords: '精神智慧，宗教信仰，從眾，傳統'
        },
        the_lovers: {
            meaning: '戀人代表愛，和諧，關係，價值觀一致，選擇。',
            keywords: '愛，和諧，關係，價值觀一致，選擇'
        },
        the_chariot: {
            meaning: '戰車代表控制，意志力，成功，行動，決心。',
            keywords: '控制，意志力，成功，行動，決心'
        },
        strength: {
            meaning: '力量代表力量，勇氣，說服力，影響力，同情心。',
            keywords: '力量，勇氣，說服力，影響力，同情心'
        },
        the_hermit: {
            meaning: '隱士代表自我反省，內省，獨處，內在指引。',
            keywords: '自我反省，內省，獨處，內在指引'
        },
        wheel_of_fortune: {
            meaning: '命運之輪代表好運，業力，生命週期，命運，轉折點。',
            keywords: '好運，業力，生命週期，命運，轉折點'
        },
        justice: {
            meaning: '正義代表正義，公平，真理，因果，法律。',
            keywords: '正義，公平，真理，因果，法律'
        },
        the_hanged_man: {
            meaning: '倒吊人代表暫停，臣服，放手，新視角。',
            keywords: '暫停，臣服，放手，新視角'
        },
        death: {
            meaning: '死神代表結束，改變，轉化，過渡。',
            keywords: '結束，改變，轉化，過渡'
        },
        temperance: {
            meaning: '節制代表平衡，適度，耐心，目標。',
            keywords: '平衡，適度，耐心，目標'
        },
        the_devil: {
            meaning: '惡魔代表陰影自我，依戀，成癮，限制，性。',
            keywords: '陰影自我，依戀，成癮，限制，性'
        },
        the_tower: {
            meaning: '高塔代表突然的改變，動盪，混亂，啟示，覺醒。',
            keywords: '突然的改變，動盪，混亂，啟示，覺醒'
        },
        the_star: {
            meaning: '星星代表希望，信念，目標，更新，靈性。',
            keywords: '希望，信念，目標，更新，靈性'
        },
        the_moon: {
            meaning: '月亮代表幻覺，恐懼，焦慮，潛意識，直覺。',
            keywords: '幻覺，恐懼，焦慮，潛意識，直覺'
        },
        the_sun: {
            meaning: '太陽代表積極，樂趣，溫暖，成功，活力。',
            keywords: '積極，樂趣，溫暖，成功，活力'
        },
        judgement: {
            meaning: '審判代表審判，重生，內在呼喚，赦免。',
            keywords: '審判，重生，內在呼喚，赦免'
        },
        the_world: {
            meaning: '世界代表完成，整合，成就，旅行。',
            keywords: '完成，整合，成就，旅行'
        },
        // Wands (權杖)
        ace_of_wands: {
            meaning: '權杖王牌代表靈感，新機會，成長，潛力。',
            keywords: '靈感，新機會，成長，潛力'
        },
        '2_of_wands': {
            meaning: '權杖二代表未來規劃，進展，決定，發現。',
            keywords: '未來規劃，進展，決定，發現'
        },
        '3_of_wands': {
            meaning: '權杖三代表進展，擴張，遠見，海外機會。',
            keywords: '進展，擴張，遠見，海外機會'
        },
        '4_of_wands': {
            meaning: '權杖四代表慶祝，喜悅，和諧，放鬆，回家。',
            keywords: '慶祝，喜悅，和諧，放鬆，回家'
        },
        '5_of_wands': {
            meaning: '權杖五代表衝突，分歧，競爭，緊張，多樣性。',
            keywords: '衝突，分歧，競爭，緊張，多樣性'
        },
        '6_of_wands': {
            meaning: '權杖六代表成功，公眾認可，進展，自信。',
            keywords: '成功，公眾認可，進展，自信'
        },
        '7_of_wands': {
            meaning: '權杖七代表挑戰，競爭，保護，堅持。',
            keywords: '挑戰，競爭，保護，堅持'
        },
        '8_of_wands': {
            meaning: '權杖八代表移動，快速變化，行動，一致，航空旅行。',
            keywords: '移動，快速變化，行動，一致，航空旅行'
        },
        '9_of_wands': {
            meaning: '權杖九代表韌性，勇氣，堅持，信念的考驗，界限。',
            keywords: '韌性，勇氣，堅持，信念的考驗，界限'
        },
        '10_of_wands': {
            meaning: '權杖十代表負擔，額外責任，辛勤工作，完成。',
            keywords: '負擔，額外責任，辛勤工作，完成'
        },
        page_of_wands: {
            meaning: '權杖侍者代表靈感，想法，發現，無限潛力，自由精神。',
            keywords: '靈感，想法，發現，無限潛力，自由精神'
        },
        knight_of_wands: {
            meaning: '權杖騎士代表能量，激情，受啟發的行動，冒險，衝動。',
            keywords: '能量，激情，受啟發的行動，冒險，衝動'
        },
        queen_of_wands: {
            meaning: '權杖皇后代表勇氣，自信，獨立，社交蝴蝶，決心。',
            keywords: '勇氣，自信，獨立，社交蝴蝶，決心'
        },
        king_of_wands: {
            meaning: '權杖國王代表天生的領導者，願景，企業家，榮譽。',
            keywords: '天生的領導者，願景，企業家，榮譽'
        },
        // Cups (聖杯)
        ace_of_cups: {
            meaning: '聖杯王牌代表愛，新關係，同情心，創造力。',
            keywords: '愛，新關係，同情心，創造力'
        },
        '2_of_cups': {
            meaning: '聖杯二代表統一的愛，夥伴關係，相互吸引。',
            keywords: '統一的愛，夥伴關係，相互吸引'
        },
        '3_of_cups': {
            meaning: '聖杯三代表慶祝，友誼，創造力，合作。',
            keywords: '慶祝，友誼，創造力，合作'
        },
        '4_of_cups': {
            meaning: '聖杯四代表冥想，沉思，冷漠，重新評估。',
            keywords: '冥想，沉思，冷漠，重新評估'
        },
        '5_of_cups': {
            meaning: '聖杯五代表遺憾，失敗，失望，悲觀。',
            keywords: '遺憾，失敗，失望，悲觀'
        },
        '6_of_cups': {
            meaning: '聖杯六代表重溫過去，童年回憶，純真，喜悅。',
            keywords: '重溫過去，童年回憶，純真，喜悅'
        },
        '7_of_cups': {
            meaning: '聖杯七代表機會，選擇，一廂情願，幻覺。',
            keywords: '機會，選擇，一廂情願，幻覺'
        },
        '8_of_cups': {
            meaning: '聖杯八代表失望，拋棄，退縮，逃避現實。',
            keywords: '失望，拋棄，退縮，逃避現實'
        },
        '9_of_cups': {
            meaning: '聖杯九代表滿足，滿意，感恩，願望成真。',
            keywords: '滿足，滿意，感恩，願望成真'
        },
        '10_of_cups': {
            meaning: '聖杯十代表神聖的愛，幸福的關係，和諧，一致。',
            keywords: '神聖的愛，幸福的關係，和諧，一致'
        },
        page_of_cups: {
            meaning: '聖杯侍者代表創造性的機會，直覺訊息，好奇心，可能性。',
            keywords: '創造性的機會，直覺訊息，好奇心，可能性'
        },
        knight_of_cups: {
            meaning: '聖杯騎士代表創造力，浪漫，魅力，想像力，美麗。',
            keywords: '創造力，浪漫，魅力，想像力，美麗'
        },
        queen_of_cups: {
            meaning: '聖杯皇后代表同情，關懷，情緒穩定，直覺，流動。',
            keywords: '同情，關懷，情緒穩定，直覺，流動'
        },
        king_of_cups: {
            meaning: '聖杯國王代表情緒平衡，同情，外交。',
            keywords: '情緒平衡，同情，外交'
        },
        // Swords (寶劍)
        ace_of_swords: {
            meaning: '寶劍王牌代表突破，新想法，頭腦清晰，成功。',
            keywords: '突破，新想法，頭腦清晰，成功'
        },
        '2_of_swords': {
            meaning: '寶劍二代表困難的決定，權衡選擇，僵局，逃避。',
            keywords: '困難的決定，權衡選擇，僵局，逃避'
        },
        '3_of_swords': {
            meaning: '寶劍三代表心碎，情感痛苦，悲傷，哀悼，傷害。',
            keywords: '心碎，情感痛苦，悲傷，哀悼，傷害'
        },
        '4_of_swords': {
            meaning: '寶劍四代表休息，放鬆，冥想，沉思，休養。',
            keywords: '休息，放鬆，冥想，沉思，休養'
        },
        '5_of_swords': {
            meaning: '寶劍五代表衝突，分歧，競爭，失敗，不惜一切代價獲勝。',
            keywords: '衝突，分歧，競爭，失敗，不惜一切代價獲勝'
        },
        '6_of_swords': {
            meaning: '寶劍六代表過渡，改變，通過儀式，釋放包袱。',
            keywords: '過渡，改變，通過儀式，釋放包袱'
        },
        '7_of_swords': {
            meaning: '寶劍七代表背叛，欺騙，僥倖逃脫，策略行事。',
            keywords: '背叛，欺騙，僥倖逃脫，策略行事'
        },
        '8_of_swords': {
            meaning: '寶劍八代表消極思想，自我強加的限制，監禁，受害者心態。',
            keywords: '消極思想，自我強加的限制，監禁，受害者心態'
        },
        '9_of_swords': {
            meaning: '寶劍九代表焦慮，擔憂，恐懼，抑鬱，噩夢。',
            keywords: '焦慮，擔憂，恐懼，抑鬱，噩夢'
        },
        '10_of_swords': {
            meaning: '寶劍十代表痛苦的結束，深深的創傷，背叛，損失，危機。',
            keywords: '痛苦的結束，深深的創傷，背叛，損失，危機'
        },
        page_of_swords: {
            meaning: '寶劍侍者代表新想法，好奇心，求知欲，新的溝通方式。',
            keywords: '新想法，好奇心，求知欲，新的溝通方式'
        },
        knight_of_swords: {
            meaning: '寶劍騎士代表雄心勃勃，行動導向，渴望成功，思維敏捷。',
            keywords: '雄心勃勃，行動導向，渴望成功，思維敏捷'
        },
        queen_of_swords: {
            meaning: '寶劍皇后代表獨立，公正的判斷，清晰的界限，直接的溝通。',
            keywords: '獨立，公正的判斷，清晰的界限，直接的溝通'
        },
        king_of_swords: {
            meaning: '寶劍國王代表頭腦清晰，智力，權威，真理。',
            keywords: '頭腦清晰，智力，權威，真理'
        },
        // Pentacles (錢幣)
        ace_of_pentacles: {
            meaning: '錢幣王牌代表新的財務或職業機會，顯化，富足。',
            keywords: '新的財務或職業機會，顯化，富足'
        },
        '2_of_pentacles': {
            meaning: '錢幣二代表多重優先事項，時間管理，優先順序，適應性。',
            keywords: '多重優先事項，時間管理，優先順序，適應性'
        },
        '3_of_pentacles': {
            meaning: '錢幣三代表團隊合作，協作，學習，實施。',
            keywords: '團隊合作，協作，學習，實施'
        },
        '4_of_pentacles': {
            meaning: '錢幣四代表省錢，安全，保守，稀缺，控制。',
            keywords: '省錢，安全，保守，稀缺，控制'
        },
        '5_of_pentacles': {
            meaning: '錢幣五代表經濟損失，貧困，匱乏心態，孤立，擔憂。',
            keywords: '經濟損失，貧困，匱乏心態，孤立，擔憂'
        },
        '6_of_pentacles': {
            meaning: '錢幣六代表給予，接受，分享財富，慷慨，慈善。',
            keywords: '給予，接受，分享財富，慷慨，慈善'
        },
        '7_of_pentacles': {
            meaning: '錢幣七代表長遠眼光，可持續的結果，堅持，投資。',
            keywords: '長遠眼光，可持續的結果，堅持，投資'
        },
        '8_of_pentacles': {
            meaning: '錢幣八代表學徒，重複性任務，精通，技能發展。',
            keywords: '學徒，重複性任務，精通，技能發展'
        },
        '9_of_pentacles': {
            meaning: '錢幣九代表富足，奢華，自給自足，財務獨立。',
            keywords: '富足，奢華，自給自足，財務獨立'
        },
        '10_of_pentacles': {
            meaning: '錢幣十代表財富，財務安全，家庭，長期成功，貢獻。',
            keywords: '財富，財務安全，家庭，長期成功，貢獻'
        },
        page_of_pentacles: {
            meaning: '錢幣侍者代表顯化，財務機會，技能發展。',
            keywords: '顯化，財務機會，技能發展'
        },
        knight_of_pentacles: {
            meaning: '錢幣騎士代表辛勤工作，生產力，常規，保守。',
            keywords: '辛勤工作，生產力，常規，保守'
        },
        queen_of_pentacles: {
            meaning: '錢幣皇后代表務實，家庭，母性，腳踏實地，安全。',
            keywords: '務實，家庭，母性，腳踏實地，安全'
},
        king_of_pentacles: {
            meaning: '錢幣國王代表財富，商業，領導力，安全，紀律，富足。',
            keywords: '財富，商業，領導力，安全，紀律，富足'
        }
    }
}