export default {
    common: {
        cancel: 'Cancel',
        save: 'Save',
        dismiss: 'Dismiss',
        send: 'Send',
        loading: 'Loading...',
        debugMode: 'Debug Mode Active',
        switchToReal: 'Switch to Real Mode',
        copy: 'Copy',
        copied: 'Copied',
        failedToCopy: 'Failed to copy',
    },
    chat: {
        title: 'Mystic Oracle',
        subtitle: 'The Divine Divination Experience',
        placeholder: 'Seek the wisdom of the oracle...',
        thinking: 'Divining the cosmic energies...',
        welcomeDebug: 'Welcome, seeker. I am the Mystic Oracle. [DEBUG MODE] Type /help to see all available commands, or try /draw, /spread, /deck to test features.',
        welcome: 'Welcome, seeker. I am the Mystic Oracle. Ask me for a tarot reading and I shall divine the cards for you.',
        clearChat: 'Clear Chat',
        settings: 'Settings',
    },
    apiKeyModal: {
        title: 'Configure Oracle',
        subtitle: 'Select your provider and enter API key',
        debugMessage: "You're using the Mock LLM Service for testing. No API key is required in this mode.",
        chooseProvider: 'Choose Provider',
        apiKey: 'API Key',
        getKey: 'Get Key',
        model: 'Model',
        selectModel: 'Select a model',
        enterKeyToFetch: 'Enter API key to fetch models',
        fetchingModels: 'Fetching models...',
        noModelsFound: 'No models found',
        trustDevice: 'Trust this device',
        trustDeviceSubtitle: 'Save API key in browser storage. Only enable on personal, secure devices.',
        language: 'Language / 語言',
        saveConfig: 'Save Configuration',
        disabledInDebug: 'This feature is disabled in debug mode. Switch to real mode to configure your API settings.',
        fetchError: 'Failed to fetch models. Check your API Key.',
    },
    errorModal: {
        suggestions: 'Suggestions:',
        supportedProviders: 'Supported Providers:',
        testMode: 'Test Mode:',
        testModeMessage: 'This is a simulated error for UI testing. Real service would handle differently.',
        technicalDetails: 'Technical Details',
        errorCode: 'Error Code:',
        timestamp: 'Timestamp:',
        copyError: 'Copy Error Details',
    },
    mock: {
        helpText: `# 📖 Available Commands

## 🎴 Tarot Card Commands (Full Deck - 78 Cards)
- **/draw** or **/card** - Draw a single random card from the full deck
- **/draw-reversed** or **/card-reversed** - Draw a single card, forced reversed orientation
- **/spread** or **/spread-three** - Draw a three-card spread (past/present/future)
- **/celtic-cross** or **/spread-celtic** - Draw a Celtic Cross spread (10 cards)

## 🌟 Major Arcana Only Commands (22 Cards)
- **/draw-major** or **/card-major** - Draw a single major arcana card
- **/spread-major** or **/spread-three-major** - Three-card spread (major arcana only)
- **/celtic-major** - Celtic Cross spread (major arcana only)

## 🃏 Interactive Deck
- **/deck** - Show interactive deck (select your own card)
- **/deck-multiple** - Show interactive deck for multiple cards

## ✨ Testing & Demos
- **/markdown** or **/md** - Show markdown rendering demo
- **/help** - Show this help message

## ⚠️ Error Testing Commands
- **/error** or **/error-mystical** - Simulate mystical error
- **/error-network** - Simulate network error
- **/error-timeout** - Simulate timeout error
- **/error-stream** - Simulate streaming error
- **/error-rate** - Simulate rate limit error

---

**Tip:** All commands start with **/** - Type any natural question to get a mock tarot reading response!`,
        markdownDemo: `# Markdown Rendering Test

The oracle now speaks in **formatted text**!

## Features Supported

1. **Bold text** and *italic text*
2. **inline code** formatting
3. Lists (ordered and unordered)
4. Links and more!

### Code Blocks

**Example:**
const magic = () => {
  console.log("✨ Mystical code ✨");
}

### Tarot Wisdom

> The cards reveal that markdown brings clarity to the divine messages.

**Try these commands:**
- **/draw** - Draw a single card
- **/spread** - Draw a three-card spread
- **/markdown** - Show this message again

---

*May your readings be ever illuminating!* 🔮`,
        errors: {
            mystical: 'The cosmic energies are in flux. The oracle cannot divine at this moment.',
            network: 'Network connection lost',
            timeout: 'Request timeout after 30 seconds',
            streaming: 'Streaming connection interrupted',
            rateLimit: 'Rate limit exceeded. Please try again in 60 seconds.',
            generic: 'Mock LLM Error: Something went wrong with the mystical connection'
        },
        responses: [
            'The cards whisper secrets about "{query}"... The mystic energies reveal a path of transformation and enlightenment ahead.',
            'I sense your question about "{query}" carries great weight. The oracle shows a journey of discovery awaits you.',
            'The cosmic forces align in response to your query: "{query}". Look within, for the answer has always resided in your soul.',
            'Ah, you seek wisdom regarding "{query}". The ancient tarot speaks of balance, patience, and hidden truths yet to be unveiled.',
            'Your words "{query}" resonate with the ethereal realm. The spirits suggest caution mixed with courage on your path forward.'
        ]
    },
    gallery: {
        title: 'Tarot Card Gallery',
        subtitle: 'Explore the complete 78-card Rider-Waite deck',
        backToOracle: 'Back to Oracle',
        searchPlaceholder: 'Search cards...',
        filters: {
            all: 'All Cards',
            major: 'Major Arcana',
            wands: 'Wands',
            cups: 'Cups',
            swords: 'Swords',
            pentacles: 'Pentacles'
        },
        noCardsFound: 'No cards found matching your search.',
        majorArcana: 'Major Arcana',
        minorArcana: 'Minor Arcana',
        meaning: 'Meaning',
        keywords: 'Keywords'
    },
    cards: {
        the_fool: {
            meaning: 'The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner\'s luck, improvisation and believing in the universe.',
            keywords: 'Beginnings, Innocence, Spontaneity, Free Spirit'
        },
        the_magician: {
            meaning: 'The Magician represents manifestation, resourcefulness, power, inspired action.',
            keywords: 'Manifestation, Resourcefulness, Power, Inspired Action'
        },
        the_high_priestess: {
            meaning: 'The High Priestess represents intuition, sacred knowledge, divine feminine, the subconscious mind.',
            keywords: 'Intuition, Sacred Knowledge, Divine Feminine, Subconscious Mind'
        },
        the_empress: {
            meaning: 'The Empress represents fertility, femininity, beauty, nature, abundance, maternity.',
            keywords: 'Fertility, Femininity, Beauty, Nature, Abundance'
        },
        the_emperor: {
            meaning: 'The Emperor represents authority, establishment, structure, a father figure.',
            keywords: 'Authority, Establishment, Structure, Father Figure'
        },
        the_hierophant: {
            meaning: 'The Hierophant represents spiritual wisdom, religious beliefs, conformity, tradition, institutions.',
            keywords: 'Spiritual Wisdom, Religious Beliefs, Conformity, Tradition'
        },
        the_lovers: {
            meaning: 'The Lovers represent love, harmony, relationships, values alignment, choices.',
            keywords: 'Love, Harmony, Relationships, Values Alignment, Choices'
        },
        the_chariot: {
            meaning: 'The Chariot represents control, willpower, success, action, determination.',
            keywords: 'Control, Willpower, Success, Action, Determination'
        },
        strength: {
            meaning: 'Strength represents strength, courage, persuasion, influence, compassion.',
            keywords: 'Strength, Courage, Persuasion, Influence, Compassion'
        },
        the_hermit: {
            meaning: 'The Hermit represents soul-searching, introspection, being alone, inner guidance.',
            keywords: 'Soul-searching, Introspection, Being Alone, Inner Guidance'
        },
        wheel_of_fortune: {
            meaning: 'Wheel of Fortune represents good luck, karma, life cycles, destiny, a turning point.',
            keywords: 'Good Luck, Karma, Life Cycles, Destiny, Turning Point'
        },
        justice: {
            meaning: 'Justice represents justice, fairness, truth, cause and effect, law.',
            keywords: 'Justice, Fairness, Truth, Cause and Effect, Law'
        },
        the_hanged_man: {
            meaning: 'The Hanged Man represents pause, surrender, letting go, new perspectives.',
            keywords: 'Pause, Surrender, Letting Go, New Perspectives'
        },
        death: {
            meaning: 'Death represents endings, change, transformation, transition.',
            keywords: 'Endings, Change, Transformation, Transition'
        },
        temperance: {
            meaning: 'Temperance represents balance, moderation, patience, purpose.',
            keywords: 'Balance, Moderation, Patience, Purpose'
        },
        the_devil: {
            meaning: 'The Devil represents shadow self, attachment, addiction, restriction, sexuality.',
            keywords: 'Shadow Self, Attachment, Addiction, Restriction, Sexuality'
        },
        the_tower: {
            meaning: 'The Tower represents sudden change, upheaval, chaos, revelation, awakening.',
            keywords: 'Sudden Change, Upheaval, Chaos, Revelation, Awakening'
        },
        the_star: {
            meaning: 'The Star represents hope, faith, purpose, renewal, spirituality.',
            keywords: 'Hope, Faith, Purpose, Renewal, Spirituality'
        },
        the_moon: {
            meaning: 'The Moon represents illusion, fear, anxiety, subconscious, intuition.',
            keywords: 'Illusion, Fear, Anxiety, Subconscious, Intuition'
        },
        the_sun: {
            meaning: 'The Sun represents positivity, fun, warmth, success, vitality.',
            keywords: 'Positivity, Fun, Warmth, Success, Vitality'
        },
        judgement: {
            meaning: 'Judgement represents judgement, rebirth, inner calling, absolution.',
            keywords: 'Judgement, Rebirth, Inner Calling, Absolution'
        },
        the_world: {
            meaning: 'The World represents completion, integration, accomplishment, travel.',
            keywords: 'Completion, Integration, Accomplishment, Travel'
        },
        // Wands
        ace_of_wands: {
            meaning: 'Ace of Wands represents inspiration, new opportunities, growth, potential.',
            keywords: 'Inspiration, New Opportunities, Growth, Potential'
        },
        '2_of_wands': {
            meaning: '2 of Wands represents future planning, progress, decisions, discovery.',
            keywords: 'Future Planning, Progress, Decisions, Discovery'
        },
        '3_of_wands': {
            meaning: '3 of Wands represents progress, expansion, foresight, overseas opportunities.',
            keywords: 'Progress, Expansion, Foresight, Overseas Opportunities'
        },
        '4_of_wands': {
            meaning: '4 of Wands represents celebration, joy, harmony, relaxation, homecoming.',
            keywords: 'Celebration, Joy, Harmony, Relaxation, Homecoming'
        },
        '5_of_wands': {
            meaning: '5 of Wands represents conflict, disagreements, competition, tension, diversity.',
            keywords: 'Conflict, Disagreements, Competition, Tension, Diversity'
        },
        '6_of_wands': {
            meaning: '6 of Wands represents success, public recognition, progress, self-confidence.',
            keywords: 'Success, Public Recognition, Progress, Self-Confidence'
        },
        '7_of_wands': {
            meaning: '7 of Wands represents challenge, competition, protection, perseverance.',
            keywords: 'Challenge, Competition, Protection, Perseverance'
        },
        '8_of_wands': {
            meaning: '8 of Wands represents movement, fast paced change, action, alignment, air travel.',
            keywords: 'Movement, Fast Paced Change, Action, Alignment, Air Travel'
        },
        '9_of_wands': {
            meaning: '9 of Wands represents resilience, courage, persistence, test of faith, boundaries.',
            keywords: 'Resilience, Courage, Persistence, Test of Faith, Boundaries'
        },
        '10_of_wands': {
            meaning: '10 of Wands represents burden, extra responsibility, hard work, completion.',
            keywords: 'Burden, Extra Responsibility, Hard Work, Completion'
        },
        page_of_wands: {
            meaning: 'Page of Wands represents inspiration, ideas, discovery, limitless potential, free spirit.',
            keywords: 'Inspiration, Ideas, Discovery, Limitless Potential, Free Spirit'
        },
        knight_of_wands: {
            meaning: 'Knight of Wands represents energy, passion, inspired action, adventure, impulsiveness.',
            keywords: 'Energy, Passion, Inspired Action, Adventure, Impulsiveness'
        },
        queen_of_wands: {
            meaning: 'Queen of Wands represents courage, confidence, independence, social butterfly, determination.',
            keywords: 'Courage, Confidence, Independence, Social Butterfly, Determination'
        },
        king_of_wands: {
            meaning: 'King of Wands represents natural-born leader, vision, entrepreneur, honor.',
            keywords: 'Natural-born Leader, Vision, Entrepreneur, Honor'
        },
        // Cups
        ace_of_cups: {
            meaning: 'Ace of Cups represents love, new relationships, compassion, creativity.',
            keywords: 'Love, New Relationships, Compassion, Creativity'
        },
        '2_of_cups': {
            meaning: '2 of Cups represents unified love, partnership, mutual attraction.',
            keywords: 'Unified Love, Partnership, Mutual Attraction'
        },
        '3_of_cups': {
            meaning: '3 of Cups represents celebration, friendship, creativity, collaborations.',
            keywords: 'Celebration, Friendship, Creativity, Collaborations'
        },
        '4_of_cups': {
            meaning: '4 of Cups represents meditation, contemplation, apathy, re-evaluation.',
            keywords: 'Meditation, Contemplation, Apathy, Re-evaluation'
        },
        '5_of_cups': {
            meaning: '5 of Cups represents regret, failure, disappointment, pessimism.',
            keywords: 'Regret, Failure, Disappointment, Pessimism'
        },
        '6_of_cups': {
            meaning: '6 of Cups represents revisiting the past, childhood memories, innocence, joy.',
            keywords: 'Revisiting the Past, Childhood Memories, Innocence, Joy'
        },
        '7_of_cups': {
            meaning: '7 of Cups represents opportunities, choices, wishful thinking, illusion.',
            keywords: 'Opportunities, Choices, Wishful Thinking, Illusion'
        },
        '8_of_cups': {
            meaning: '8 of Cups represents disappointment, abandonment, withdrawal, escapism.',
            keywords: 'Disappointment, Abandonment, Withdrawal, Escapism'
        },
        '9_of_cups': {
            meaning: '9 of Cups represents contentment, satisfaction, gratitude, wish come true.',
            keywords: 'Contentment, Satisfaction, Gratitude, Wish Come True'
        },
        '10_of_cups': {
            meaning: '10 of Cups represents divine love, blissful relationships, harmony, alignment.',
            keywords: 'Divine Love, Blissful Relationships, Harmony, Alignment'
        },
        page_of_cups: {
            meaning: 'Page of Cups represents creative opportunities, intuitive messages, curiosity, possibility.',
            keywords: 'Creative Opportunities, Intuitive Messages, Curiosity, Possibility'
        },
        knight_of_cups: {
            meaning: 'Knight of Cups represents creativity, romance, charm, imagination, beauty.',
            keywords: 'Creativity, Romance, Charm, Imagination, Beauty'
        },
        queen_of_cups: {
            meaning: 'Queen of Cups represents compassionate, caring, emotionally stable, intuitive, in flow.',
            keywords: 'Compassionate, Caring, Emotionally Stable, Intuitive, In Flow'
        },
        king_of_cups: {
            meaning: 'King of Cups represents emotionally balanced, compassionate, diplomatic.',
            keywords: 'Emotionally Balanced, Compassionate, Diplomatic'
        },
        // Swords
        ace_of_swords: {
            meaning: 'Ace of Swords represents breakthroughs, new ideas, mental clarity, success.',
            keywords: 'Breakthroughs, New Ideas, Mental Clarity, Success'
        },
        '2_of_swords': {
            meaning: '2 of Swords represents difficult decisions, weighing up options, an impasse, avoidance.',
            keywords: 'Difficult Decisions, Weighing Up Options, An Impasse, Avoidance'
        },
        '3_of_swords': {
            meaning: '3 of Swords represents heartbreak, emotional pain, sorrow, grief, hurt.',
            keywords: 'Heartbreak, Emotional Pain, Sorrow, Grief, Hurt'
        },
        '4_of_swords': {
            meaning: '4 of Swords represents rest, relaxation, meditation, contemplation, recuperation.',
            keywords: 'Rest, Relaxation, Meditation, Contemplation, Recuperation'
        },
        '5_of_swords': {
            meaning: '5 of Swords represents conflict, disagreements, competition, defeat, winning at all costs.',
            keywords: 'Conflict, Disagreements, Competition, Defeat, Winning at All Costs'
        },
        '6_of_swords': {
            meaning: '6 of Swords represents transition, change, rite of passage, releasing baggage.',
            keywords: 'Transition, Change, Rite of Passage, Releasing Baggage'
        },
        '7_of_swords': {
            meaning: '7 of Swords represents betrayal, deception, getting away with something, acting strategically.',
            keywords: 'Betrayal, Deception, Getting Away with Something, Acting Strategically'
        },
        '8_of_swords': {
            meaning: '8 of Swords represents negative thoughts, self-imposed restriction, imprisonment, victim mentality.',
            keywords: 'Negative Thoughts, Self-imposed Restriction, Imprisonment, Victim Mentality'
        },
        '9_of_swords': {
            meaning: '9 of Swords represents anxiety, worry, fear, depression, nightmares.',
            keywords: 'Anxiety, Worry, Fear, Depression, Nightmares'
        },
        '10_of_swords': {
            meaning: '10 of Swords represents painful endings, deep wounds, betrayal, loss, crisis.',
            keywords: 'Painful Endings, Deep Wounds, Betrayal, Loss, Crisis'
        },
        page_of_swords: {
            meaning: 'Page of Swords represents new ideas, curiosity, thirst for knowledge, new ways of communicating.',
            keywords: 'New Ideas, Curiosity, Thirst for Knowledge, New Ways of Communicating'
        },
        knight_of_swords: {
            meaning: 'Knight of Swords represents ambitious, action-oriented, driven to succeed, fast-thinking.',
            keywords: 'Ambitious, Action-oriented, Driven to Succeed, Fast-thinking'
        },
        queen_of_swords: {
            meaning: 'Queen of Swords represents independent, unbiased judgement, clear boundaries, direct communication.',
            keywords: 'Independent, Unbiased Judgement, Clear Boundaries, Direct Communication'
        },
        king_of_swords: {
            meaning: 'King of Swords represents mental clarity, intellectual power, authority, truth.',
            keywords: 'Mental Clarity, Intellectual Power, Authority, Truth'
        },
        // Pentacles
        ace_of_pentacles: {
            meaning: 'Ace of Pentacles represents a new financial or career opportunity, manifestation, abundance.',
            keywords: 'New Financial or Career Opportunity, Manifestation, Abundance'
        },
        '2_of_pentacles': {
            meaning: '2 of Pentacles represents multiple priorities, time management, prioritization, adaptability.',
            keywords: 'Multiple Priorities, Time Management, Prioritization, Adaptability'
        },
        '3_of_pentacles': {
            meaning: '3 of Pentacles represents teamwork, collaboration, learning, implementation.',
            keywords: 'Teamwork, Collaboration, Learning, Implementation'
        },
        '4_of_pentacles': {
            meaning: '4 of Pentacles represents saving money, security, conservatism, scarcity, control.',
            keywords: 'Saving Money, Security, Conservatism, Scarcity, Control'
        },
        '5_of_pentacles': {
            meaning: '5 of Pentacles represents financial loss, poverty, lack mindset, isolation, worry.',
            keywords: 'Financial Loss, Poverty, Lack Mindset, Isolation, Worry'
        },
        '6_of_pentacles': {
            meaning: '6 of Pentacles represents giving, receiving, sharing wealth, generosity, charity.',
            keywords: 'Giving, Receiving, Sharing Wealth, Generosity, Charity'
        },
        '7_of_pentacles': {
            meaning: '7 of Pentacles represents long-term view, sustainable results, perseverance, investment.',
            keywords: 'Long-term View, Sustainable Results, Perseverance, Investment'
        },
        '8_of_pentacles': {
            meaning: '8 of Pentacles represents apprenticeship, repetitive tasks, mastery, skill development.',
            keywords: 'Apprenticeship, Repetitive Tasks, Mastery, Skill Development'
        },
        '9_of_pentacles': {
            meaning: '9 of Pentacles represents abundance, luxury, self-sufficiency, financial independence.',
            keywords: 'Abundance, Luxury, Self-sufficiency, Financial Independence'
        },
        '10_of_pentacles': {
            meaning: '10 of Pentacles represents wealth, financial security, family, long-term success, contribution.',
            keywords: 'Wealth, Financial Security, Family, Long-term Success, Contribution'
        },
        page_of_pentacles: {
            meaning: 'Page of Pentacles represents manifestation, financial opportunity, skill development.',
            keywords: 'Manifestation, Financial Opportunity, Skill Development'
        },
        knight_of_pentacles: {
            meaning: 'Knight of Pentacles represents hard work, productivity, routine, conservatism.',
            keywords: 'Hard Work, Productivity, Routine, Conservatism'
        },
        queen_of_pentacles: {
            meaning: 'Queen of Pentacles represents practical, homely, motherly, down-to-earth, security.',
            keywords: 'Practical, Homely, Motherly, Down-to-earth, Security'
        },
        king_of_pentacles: {
            meaning: 'King of Pentacles represents wealth, business, leadership, security, discipline, abundance.',
            keywords: 'Wealth, Business, Leadership, Security, Discipline, Abundance'
        }
    }
}
