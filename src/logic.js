// src/logic.js

/**
 * Evaluates the user's questionnaire responses and returns a personalized learning profile and 3-5 study methods.
 * @param {Object} responses - Key-value pair of question IDs to selected option values.
 * @param {Object} userInfo - Name and age of the user.
 * @returns {Object} { profileSummary, methods, weeklyRoutine }
 */
function generateStudyPlan(responses, userInfo = { name: 'Student', age: null }) {
    const recommendedMethods = new Set();
    const profileTraits = [];

    // --- Adaptation Logic Rules ---

    // Q1: Learning Style
    if (responses.q1_learning_style === "visual") {
        recommendedMethods.add("dual_coding");
        recommendedMethods.add("mind_mapping");
        profileTraits.push("Visual Learner");
    } else if (responses.q1_learning_style === "verbal") {
        recommendedMethods.add("teaching_back");
        recommendedMethods.add("elaboration");
        profileTraits.push("Verbal/Auditory Learner");
    } else if (responses.q1_learning_style === "structured") {
        recommendedMethods.add("cornell");
        recommendedMethods.add("time_blocking");
        profileTraits.push("Structured Learner");
    } else if (responses.q1_learning_style === "active") {
        recommendedMethods.add("practice_testing");
        recommendedMethods.add("blurting");
        profileTraits.push("Kinesthetic/Active Learner");
    }

    // Q2: Memory
    if (responses.q2_memory === "needs_repetition") {
        recommendedMethods.add("spaced_repetition");
        profileTraits.push("Benefits from structured review");
    } else if (responses.q2_memory === "needs_testing") {
        recommendedMethods.add("active_recall");
        recommendedMethods.add("flashcards");
        profileTraits.push("Needs active retrieval practice");
    }

    // Q3: Focus
    if (responses.q3_focus === "short_attention" || responses.q3_focus === "distracted") {
        recommendedMethods.add("pomodoro");
        if (responses.q3_focus === "distracted") recommendedMethods.add("environment_control");
        profileTraits.push("Requires short, focused study bursts");
    }

    // Q4: Organization
    if (responses.q4_organization === "unstructured" || responses.q4_organization === "overwhelmed") {
        recommendedMethods.add("task_chunking");
        if (responses.q4_organization === "unstructured") recommendedMethods.add("cornell");
        profileTraits.push("Needs help breaking down complex tasks");
    }

    // Q5: Time
    if (responses.q5_time === "erratic" || responses.q5_time === "cramming") {
        recommendedMethods.add("time_blocking");
        if (responses.q5_time === "cramming") recommendedMethods.add("spaced_repetition");
        profileTraits.push("Needs a consistent schedule");
    }

    // Q6: Comprehension
    if (responses.q6_comprehension === "explaining") {
        recommendedMethods.add("feynman");
    }

    // Q7: Confidence
    if (responses.q7_confidence === "explaining_low") {
        recommendedMethods.add("feynman"); // specifically to build confidence
        recommendedMethods.add("elaboration");
    }

    // --- Formatting the Final Output ---

    // Ensure we have between 3 and 5 methods. 
    // Convert Set to Array and filter against the main STUDY_METHODS database
    let finalMethodsIds = Array.from(recommendedMethods);

    // Fallback if logic somehow yields < 3 methods
    if (finalMethodsIds.length < 3) {
        if (!finalMethodsIds.includes("active_recall")) finalMethodsIds.push("active_recall");
        if (!finalMethodsIds.includes("pomodoro") && finalMethodsIds.length < 3) finalMethodsIds.push("pomodoro");
        if (!finalMethodsIds.includes("practice_testing") && finalMethodsIds.length < 3) finalMethodsIds.push("practice_testing");
    }

    // Trim to max 5 methods to prevent overwhelming the user
    if (finalMethodsIds.length > 5) {
        // Prioritize a mix of categories if trimming
        // For simplicity in this demo, we'll just slice the first 5 unique ones
        finalMethodsIds = finalMethodsIds.slice(0, 5);
    }

    // Map IDs to actual full objects
    const finalMethods = finalMethodsIds.map(id => STUDY_METHODS.find(m => m.id === id));

    const name = userInfo && userInfo.name !== 'Student' ? userInfo.name : '';
    const namePrefix = name ? `${name}, you` : 'You';
    const ageInsight = userInfo && userInfo.age ? (parseInt(userInfo.age) < 18 ? " As a younger student, building these foundational habits now will give you a major advantage." : " Applying these techniques will help you maximize your study efficiency as an adult learner.") : '';


    // Generate Profile Summary String
    const profileSummary = `${namePrefix} are a ${profileTraits[0] || "Adaptive Learner"}. ` +
        `Based on your responses, you study best when you ${(profileTraits[1] || "").toLowerCase() || "apply active learning techniques"}.`;

    // Generate detailed profile bullet points
    const detailedProfile = [
        `You showed a preference for ${responses.q1_learning_style || "adaptive"} learning methods. This means you absorb information best when it is presented in a way that matches this style.`,
        `${responses.q3_focus === 'short_attention' || responses.q3_focus === 'distracted' ? 'You benefit from shorter, high-intensity study bursts rather than long marathon sessions.' : 'You have a good capacity for sustained focus, allowing you to dive deep into complex topics.'}`,
        `${responses.q4_organization === 'highly_organized' ? 'You already have great organizational habits. Let’s leverage that structure to maximize efficiency.' : 'Creating a clear structure before you start studying will save you time and reduce feeling overwhelmed.'}`,
        `Your responses indicate you should focus heavily on retrieval practice (testing yourself) and spacing your review sessions apart for maximum retention.${ageInsight}`
    ];

    // Generate an example weekly routine based on selected methods and user specific responses
    const routine = generateRoutine(finalMethods, responses);

    return {
        profileSummary,
        detailedProfile,
        methods: finalMethods,
        weeklyRoutine: routine
    };
}

/**
 * Generates a highly specific, dynamic, and varied weekly routine based on the chosen methods and user responses
 */
function generateRoutine(methods, responses) {
    const routine = [];

    // Helper to check if a method was assigned
    const hasMethod = (id) => methods.some(m => m.id === id);

    // Monday (Setup / Initial Learning)
    if (hasMethod("mind_mapping") || hasMethod("dual_coding")) {
        routine.push({ id: 'day1', text: "Monday: Map out this week's main concepts visually using diagrams or mind maps before diving deep.", checked: false });
    } else if (hasMethod("cornell")) {
        routine.push({ id: 'day1', text: "Monday: Set up Cornell Notes structures for all of your upcoming lectures this week.", checked: false });
    } else {
        routine.push({ id: 'day1', text: "Monday: Initial review session. Skim this week's materials and break down complex topics into smaller parts.", checked: false });
    }

    // Tuesday (Direct Application)
    if (hasMethod("pomodoro")) {
        routine.push({ id: 'day2', text: `Tuesday: Deep focus block. Complete 4 Pomodoro cycles (25m focus / 5m break) on your hardest subject.`, checked: false });
    } else if (hasMethod("task_chunking")) {
        routine.push({ id: 'day2', text: "Tuesday: Take your biggest assignment this week and chunk it into 3 microscopic, easy-to-start tasks. Do the first one.", checked: false });
    } else {
        routine.push({ id: 'day2', text: "Tuesday: Two hours of dedicated problem-solving and application of Monday's concepts.", checked: false });
    }

    // Wednesday (Retrieval / Explanation)
    if (responses.q7_confidence === "explaining_low") {
        routine.push({ id: 'day3', text: "Wednesday: Confidence building. Practice the Feynman Technique by explaining a concept out loud to an empty room.", checked: false });
    } else if (hasMethod("teaching_back")) {
        routine.push({ id: 'day3', text: "Wednesday: Find a study partner (or a willing friend) and spend 30 minutes teaching them this week's material.", checked: false });
    } else if (hasMethod("blurting")) {
        routine.push({ id: 'day3', text: "Wednesday: The Blurting Method. Close your books, write down everything you remember about a topic, then check what you missed.", checked: false });
    } else {
        routine.push({ id: 'day3', text: "Wednesday: Mid-week active recall session. Test yourself on the material covered so far without looking at your notes.", checked: false });
    }

    // Thursday (Environment / Reviewing)
    if (hasMethod("environment_control")) {
        routine.push({ id: 'day4', text: "Thursday: Change of scenery. Find a new, distraction-free environment (like a quiet library corner) for an uninterrupted study block.", checked: false });
    } else if (hasMethod("flashcards")) {
        routine.push({ id: 'day4', text: "Thursday: Rapid-fire review. Go through your flashcard deck for 30 minutes, focusing only on the cards you got wrong.", checked: false });
    } else {
        routine.push({ id: 'day4', text: "Thursday: Review and synthesize notes. Connect the discrete facts you've learned into a larger framework.", checked: false });
    }

    // Friday (Testing / Spacing)
    if (hasMethod("practice_testing")) {
        routine.push({ id: 'day5', text: "Friday: Mock exam context. Take a practice test under completely simulated exam conditions.", checked: false });
    } else if (hasMethod("spaced_repetition")) {
        routine.push({ id: 'day5', text: "Friday: Spaced Repetition day. Strictly review material from 2 weeks ago and 1 month ago to solidify long-term memory.", checked: false });
    } else {
        routine.push({ id: 'day5', text: "Friday: End of week wrap-up. Identify the areas you struggled with most this week and review those specifically.", checked: false });
    }

    // Weekend (Planning)
    if (hasMethod("time_blocking") || responses.q5_time === "cramming") {
        routine.push({ id: 'day6', text: "Sunday: Prevent cramming. Time-block exactly when you will study next week into your calendar.", checked: false });
    } else {
        routine.push({ id: 'day6', text: "Sunday: Rest, recharge, and generally organize your materials for the upcoming week.", checked: false });
    }

    return routine;
}
