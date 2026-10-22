// src/data.js

const STUDY_METHODS = [
    // --- Memory ---
    {
        id: "active_recall",
        name: "Active Recall",
        description: "Test yourself by recalling information without looking at notes.",
        category: "Memory",
        tags: ["verbal", "independent", "memory"],
        link: "https://learningcenter.unc.edu/tips-and-tools/studying-101-study-smarter-not-harder/"
    },
    {
        id: "spaced_repetition",
        name: "Spaced Repetition",
        description: "Review material over spaced intervals instead of cramming.",
        category: "Memory",
        tags: ["structured", "memory", "long-term"],
        link: "https://collegeinfogeek.com/spaced-repetition-memory-technique/"
    },
    {
        id: "flashcards",
        name: "Flashcards",
        description: "Use question-and-answer cards to strengthen memory retrieval.",
        category: "Memory",
        tags: ["visual", "verbal", "memory", "quick"],
        link: "https://www.apa.org/ed/precollege/ptn/2016/05/flashcards-learning"
    },

    // --- Comprehension ---
    {
        id: "elaboration",
        name: "Elaboration",
        description: "Explain ideas in your own words and connect them to prior knowledge.",
        category: "Comprehension",
        tags: ["verbal", "deep-learning"],
        link: "https://www.learningscientists.org/elaboration"
    },
    {
        id: "dual_coding",
        name: "Dual Coding",
        description: "Combine text with visuals such as diagrams.",
        category: "Comprehension",
        tags: ["visual", "creative"],
        link: "https://www.learningscientists.org/dual-coding"
    },
    {
        id: "feynman",
        name: "Feynman Technique",
        description: "Teach a concept in simple terms to identify gaps.",
        category: "Comprehension",
        tags: ["verbal", "active", "explaining"],
        link: "https://fs.blog/feynman-technique/"
    },

    // --- Organization ---
    {
        id: "cornell",
        name: "Cornell Note-Taking",
        description: "Structure notes into sections for clarity.",
        category: "Organization",
        tags: ["structured", "writing", "visual"],
        link: "https://lsc.cornell.edu/how-to-study/taking-notes/cornell-note-taking-system/"
    },
    {
        id: "mind_mapping",
        name: "Mind Mapping",
        description: "Create visual diagrams linking related ideas.",
        category: "Organization",
        tags: ["visual", "creative", "big-picture"],
        link: "https://www.mindmapping.com/"
    },
    {
        id: "time_blocking",
        name: "Time Blocking",
        description: "Schedule study tasks into specific time slots.",
        category: "Organization",
        tags: ["structured", "focus", "time-management"],
        link: "https://todoist.com/productivity-methods/time-blocking"
    },

    // --- Attention ---
    {
        id: "pomodoro",
        name: "Pomodoro Technique",
        description: "Study in focused sessions with short breaks.",
        category: "Attention",
        tags: ["structured", "focus", "short-attention"],
        link: "https://francescocirillo.com/pages/pomodoro-technique"
    },
    {
        id: "environment_control",
        name: "Environment Control",
        description: "Reduce distractions before studying.",
        category: "Attention",
        tags: ["focus", "independent"],
        link: "https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral"
    },
    {
        id: "task_chunking",
        name: "Task Chunking",
        description: "Break large tasks into smaller parts.",
        category: "Attention",
        tags: ["structured", "focus", "overwhelmed"],
        link: "https://hbr.org/2022/04/how-to-break-down-a-project-into-manageable-tasks"
    },

    // --- Expression / Practice ---
    {
        id: "practice_testing",
        name: "Practice Testing",
        description: "Answer exam-style questions to apply knowledge.",
        category: "Expression / Practice",
        tags: ["active", "application", "testing"],
        link: "https://www.retrievalpractice.org/"
    },
    {
        id: "teaching_back",
        name: "Teaching Back",
        description: "Explain the material out loud to reinforce understanding.",
        category: "Expression / Practice",
        tags: ["verbal", "active", "explaining", "social"],
        link: "https://cft.vanderbilt.edu/guides-sub-pages/active-learning/"
    },
    {
        id: "blurting",
        name: "Blurting Method",
        description: "Write everything remembered from memory and review gaps.",
        category: "Expression / Practice",
        tags: ["active", "memory", "writing"],
        link: "https://exampro.co.uk/blog/what-is-the-blurting-method"
    }
];

const QUESTIONNAIRE = [
    {
        id: "q1_learning_style",
        question: "1. Which of the following describes you best when trying to understand something new?",
        options: [
            { text: "I need to see it mapped out or drawn.", value: "visual" },
            { text: "I need to talk through it or hear it explained.", value: "verbal" },
            { text: "I need to write it down in a structured way.", value: "structured" },
            { text: "I need to jump in and practice immediately.", value: "active" }
        ]
    },
    {
        id: "q2_memory",
        question: "2. How easily do you remember factual information (like dates or vocabulary)?",
        options: [
            { text: "I remember things easily after seeing them once.", value: "good_memory" },
            { text: "I need to review things multiple times to make them stick.", value: "needs_repetition" },
            { text: "I forget things quickly unless I test myself.", value: "needs_testing" }
        ]
    },
    {
        id: "q3_focus",
        question: "3. How would you describe your ability to stay focused?",
        options: [
            { text: "I can sit and study for hours without a problem.", value: "high_focus" },
            { text: "My mind wanders quickly; I need frequent breaks.", value: "short_attention" },
            { text: "I get distracted easily by my surroundings.", value: "distracted" }
        ]
    },
    {
        id: "q4_organization",
        question: "4. How do you approach organizing your study materials?",
        options: [
            { text: "Everything is color-coded, labeled, and highly structured.", value: "highly_organized" },
            { text: "I take unstructured notes and try to make sense of them later.", value: "unstructured" },
            { text: "I mostly rely on the textbook or slides provided.", value: "passive" },
            { text: "I feel overwhelmed when figuring out where to start.", value: "overwhelmed" }
        ]
    },
    {
        id: "q5_time",
        question: "5. What does your study schedule typically look like?",
        options: [
            { text: "I have dedicated blocks of time every day.", value: "consistent" },
            { text: "I study whenever I have free time.", value: "erratic" },
            { text: "I tend to cram the night before an exam.", value: "cramming" }
        ]
    },
    {
        id: "q6_comprehension",
        question: "6. When faced with a complex concept, what is your first instinct?",
        options: [
            { text: "Break it down into smaller, manageable parts.", value: "chunking" },
            { text: "Try to explain it out loud as if teaching someone else.", value: "explaining" },
            { text: "Draw a diagram to see how everything connects.", value: "visualizing" },
            { text: "Connect it to something I already know.", value: "elaborating" }
        ]
    },
    {
        id: "q7_confidence",
        question: "7. How confident do you feel explaining what you've studied to a classmate?",
        options: [
            { text: "Very confident, explaining helps me learn.", value: "explaining_pro" },
            { text: "Somewhat confident, but I might forget details.", value: "explaining_mid" },
            { text: "Not confident at all, I'd rather take a written test.", value: "explaining_low" }
        ]
    },
    {
        id: "q8_boredom",
        question: "8. When studying gets boring or difficult, what usually happens?",
        options: [
            { text: "I push through it until I'm done.", value: "resilient" },
            { text: "I switch to a different subject or task.", value: "switcher" },
            { text: "I lose motivation and stop.", value: "quitting" }
        ]
    },
    {
        id: "q9_review",
        question: "9. How do you usually prepare for an exam?",
        options: [
            { text: "Reviewing highlighted notes linearly from start to finish.", value: "linear" },
            { text: "Doing as many practice tests and questions as possible.", value: "testing" },
            { text: "Writing out everything I remember onto a blank page.", value: "active" }
        ]
    },
    {
        id: "q10_environment",
        question: "10. What environment do you prefer for studying?",
        options: [
            { text: "Absolute silence and isolation.", value: "isolated" },
            { text: "Background noise like a coffee shop or music.", value: "noise" },
            { text: "In a group where we can discuss topics.", value: "social" }
        ]
    }
];
