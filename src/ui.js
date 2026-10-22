// src/ui.js

/**
 * Handles all DOM manipulation and UI rendering for the Lockin app.
 */
class UIManager {
    constructor() {
        this.appContainer = document.getElementById('app');
        this.audioElement = null;
        this.isPlayingAudio = false;
    }

    /**
     * Helper to create an element with classes and text
     */
    createElement(tag, classes = [], text = "") {
        const el = document.createElement(tag);
        if (classes.length) el.classList.add(...classes);
        if (text) el.textContent = text;
        return el;
    }

    /**
     * Clears the main app container
     */
    clearApp() {
        this.appContainer.innerHTML = '';
        // Add a fade out/in effect
        this.appContainer.classList.remove('view');
        void this.appContainer.offsetWidth; // trigger reflow
        this.appContainer.classList.add('view');
    }

    /**
     * Renders the Welcome Screen
     */
    renderWelcomeScreen(onStartClick) {
        this.clearApp();

        const container = this.createElement('div', ['welcome-screen']);
        container.style.textAlign = 'center';

        const title = this.createElement('h1', [], 'Lockin');
        const subtitle = this.createElement('h2', [], 'Find your perfect study flow.');

        const desc = this.createElement('p', [],
            'Discover evidence-based study methods matched exactly to your learning style, attention span, and goals. Takes less than 3 minutes.'
        );
        desc.style.maxWidth = '80%';
        desc.style.margin = '0 auto 2rem auto';

        // Form for Name and Age
        const formContainer = this.createElement('div', ['user-info-form']);
        formContainer.style.display = 'flex';
        formContainer.style.flexDirection = 'column';
        formContainer.style.gap = '16px';
        formContainer.style.alignItems = 'center';
        formContainer.style.marginBottom = '2rem';

        const nameInput = this.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Your Name';
        nameInput.id = 'user-name';
        nameInput.classList.add('info-input');

        const ageInput = this.createElement('input');
        ageInput.type = 'number';
        ageInput.placeholder = 'Your Age (optional)';
        ageInput.id = 'user-age';
        ageInput.min = '5';
        ageInput.max = '100';
        ageInput.classList.add('info-input');

        formContainer.appendChild(nameInput);
        formContainer.appendChild(ageInput);

        const startBtn = this.createElement('button', ['btn', 'btn-primary'], 'Begin Questionnaire');
        startBtn.addEventListener('click', () => {
            const name = nameInput.value.trim() || 'Student';
            const age = ageInput.value.trim();
            onStartClick({ name, age });
        });

        container.appendChild(title);
        container.appendChild(subtitle);
        container.appendChild(desc);
        container.appendChild(formContainer);
        container.appendChild(startBtn);

        this.appContainer.appendChild(container);
    }

    /**
     * Renders a single question from the questionnaire
     */
    renderQuestion(questionObj, currentIndex, totalQuestions, onOptionSelected) {
        this.clearApp();

        const container = this.createElement('div', ['question-container']);

        // Progress Bar
        const progressContainer = this.createElement('div', ['progress-bar-container']);
        progressContainer.style.width = '100%';
        progressContainer.style.height = '8px';
        progressContainer.style.backgroundColor = 'var(--border)';
        progressContainer.style.borderRadius = 'var(--radius-sm)';
        progressContainer.style.marginBottom = '2rem';
        progressContainer.style.overflow = 'hidden';

        const progressFill = this.createElement('div', ['progress-fill']);
        progressFill.style.height = '100%';
        progressFill.style.backgroundColor = 'var(--primary)';
        progressFill.style.width = `${((currentIndex) / totalQuestions) * 100}%`;
        progressFill.style.transition = 'width 0.4s ease';

        progressContainer.appendChild(progressFill);
        container.appendChild(progressContainer);

        // Header / Question Progress
        const progressText = this.createElement('p', [], `Question ${currentIndex + 1} of ${totalQuestions}`);
        progressText.style.fontSize = '0.9rem';
        progressText.style.fontWeight = '600';
        progressText.style.color = 'var(--primary)';
        progressText.style.marginBottom = '0.5rem';
        progressText.style.textTransform = 'uppercase';
        progressText.style.letterSpacing = '1px';

        // Question Title
        const title = this.createElement('h2', [], questionObj.question);
        title.style.marginBottom = '2rem';

        container.appendChild(progressText);
        container.appendChild(title);

        // Options List
        const optionsContainer = this.createElement('div', ['options-list']);
        optionsContainer.style.display = 'flex';
        optionsContainer.style.flexDirection = 'column';
        optionsContainer.style.gap = '12px';

        questionObj.options.forEach(opt => {
            const btn = this.createElement('button', ['btn', 'btn-outline']);
            btn.style.justifyContent = 'flex-start';
            btn.style.textAlign = 'left';
            btn.textContent = opt.text;

            btn.addEventListener('click', () => {
                // Add active state styling
                btn.style.backgroundColor = 'var(--primary)';
                btn.style.color = 'white';
                // Small delay for UI feedback
                setTimeout(() => onOptionSelected(opt.value), 300);
            });

            optionsContainer.appendChild(btn);
        });

        container.appendChild(optionsContainer);
        this.appContainer.appendChild(container);

        // Trigger progress bar animation after render
        setTimeout(() => {
            progressFill.style.width = `${((currentIndex + 1) / totalQuestions) * 100}%`;
        }, 50);
    }

    /**
     * Renders the Results Screen
     */
    renderResults(planData, onRestartClick, onViewPlanClick) {
        this.clearApp();

        const container = this.createElement('div', ['results-container']);

        // Profile Summary
        const title = this.createElement('h1', [], 'Your Study Plan');
        title.style.color = 'var(--primary)';

        const summaryCard = this.createElement('div', ['summary-card']);
        summaryCard.style.backgroundColor = 'var(--primary-light)';
        summaryCard.style.padding = '1.5rem';
        summaryCard.style.borderRadius = 'var(--radius-md)';
        summaryCard.style.marginBottom = '2rem';
        summaryCard.style.borderLeft = '4px solid var(--primary)';

        const summaryTitle = this.createElement('h3', [], 'Learner Profile');
        const summaryText = this.createElement('p', [], planData.profileSummary);
        summaryText.style.color = 'var(--primary-dark)';
        summaryText.style.marginBottom = '1rem';
        summaryText.style.fontWeight = '600';

        summaryCard.appendChild(summaryTitle);
        summaryCard.appendChild(summaryText);

        // Add detailed bullet points
        const detailsList = this.createElement('ul');
        detailsList.style.color = 'var(--primary-dark)';
        detailsList.style.fontSize = '0.95rem';
        detailsList.style.marginLeft = '1.5rem';
        detailsList.style.display = 'flex';
        detailsList.style.flexDirection = 'column';
        detailsList.style.gap = '8px';

        if (planData.detailedProfile) {
            planData.detailedProfile.forEach(detail => {
                const li = this.createElement('li');
                li.innerHTML = detail; // allows bolding
                detailsList.appendChild(li);
            });
        }
        summaryCard.appendChild(detailsList);

        container.appendChild(title);
        container.appendChild(summaryCard);

        // Recommended Methods
        const methodsTitle = this.createElement('h2', [], 'Recommended Methods');
        methodsTitle.style.fontSize = '1.4rem';
        methodsTitle.style.borderBottom = '1px solid var(--border)';
        methodsTitle.style.paddingBottom = '0.5rem';
        container.appendChild(methodsTitle);

        const methodsList = this.createElement('div', ['methods-list']);
        methodsList.style.display = 'flex';
        methodsList.style.flexDirection = 'column';
        methodsList.style.gap = '1rem';
        methodsList.style.marginBottom = '2.5rem';

        planData.methods.forEach(method => {
            if (!method) return; // safety check

            const card = this.createElement('div', ['method-card']);
            card.style.border = '1px solid var(--border)';
            card.style.borderRadius = 'var(--radius-md)';
            card.style.padding = '1.25rem';
            card.style.backgroundColor = 'rgba(255,255,255,0.5)';
            card.style.transition = 'var(--transition)';

            // Hover effect logic
            card.onmouseenter = () => card.style.transform = 'translateY(-2px)';
            card.onmouseleave = () => card.style.transform = 'translateY(0)';

            const headerRow = this.createElement('div');
            headerRow.style.display = 'flex';
            headerRow.style.justifyContent = 'space-between';
            headerRow.style.alignItems = 'center';
            headerRow.style.marginBottom = '0.5rem';

            const mName = this.createElement('a', ['method-link'], method.name);
            mName.href = method.link || '#';
            mName.target = '_blank';
            mName.rel = 'noopener noreferrer';
            mName.title = `Read more about ${method.name}`;
            mName.style.margin = '0';
            mName.style.fontWeight = '600';
            mName.style.fontSize = '1.15rem';
            mName.style.display = 'inline-block';

            const catBadge = this.createElement('span', ['badge'], method.category);
            catBadge.style.fontSize = '0.75rem';
            catBadge.style.padding = '4px 8px';
            catBadge.style.backgroundColor = 'var(--secondary-light)';
            catBadge.style.color = 'var(--secondary-dark)';
            catBadge.style.borderRadius = '12px';
            catBadge.style.fontWeight = '600';
            catBadge.style.textTransform = 'uppercase';

            headerRow.appendChild(mName);
            headerRow.appendChild(catBadge);

            const mDesc = this.createElement('p', [], method.description);
            mDesc.style.margin = '0';
            mDesc.style.fontSize = '0.95rem';

            card.appendChild(headerRow);
            card.appendChild(mDesc);
            methodsList.appendChild(card);
        });

        container.appendChild(methodsList);

        // --- NEW: BLURTING SANDBOX ---
        const sandboxContainer = this.createElement('div', ['sandbox-container']);

        const sandboxTitle = this.createElement('h2', [], 'Active Workspace');
        sandboxTitle.style.fontSize = '1.4rem';
        sandboxTitle.style.margin = '0';
        sandboxTitle.style.color = 'var(--text-main)';

        const sandboxDesc = this.createElement('p', [], 'Use this space for the "Blurting Method". Type out everything you remember, then check against your notes.');
        sandboxDesc.style.margin = '0 0 1rem 0';
        sandboxDesc.style.color = 'var(--text-muted)';
        sandboxDesc.style.fontSize = '0.9rem';

        const textarea = this.createElement('textarea', ['sandbox-textarea']);
        textarea.id = 'sandbox-textarea';
        textarea.placeholder = 'Start typing your notes here...';

        const saveBtn = this.createElement('button', ['btn', 'btn-outline'], 'Save Notes as .txt');
        saveBtn.id = 'sandbox-save';
        saveBtn.style.alignSelf = 'flex-start';

        sandboxContainer.appendChild(sandboxTitle);
        sandboxContainer.appendChild(sandboxDesc);
        sandboxContainer.appendChild(textarea);
        sandboxContainer.appendChild(saveBtn);

        container.appendChild(sandboxContainer);
        // ------------------------------

        // --- NEW: POMODORO TIMER ---
        const timerContainer = this.createElement('div', ['timer-container']);

        const timerTitle = this.createElement('h3', [], 'Focus Timer');
        timerTitle.style.margin = '0';
        timerTitle.style.color = 'var(--text-main)';

        const timerDisplay = this.createElement('div', ['timer-display'], '25:00');
        timerDisplay.id = 'pomodoro-display';

        const timerControls = this.createElement('div', ['timer-controls']);

        const startBtn = this.createElement('button', ['timer-btn', 'btn-start'], 'Start');
        startBtn.id = 'timer-start';

        const pauseBtn = this.createElement('button', ['timer-btn', 'btn-pause'], 'Pause');
        pauseBtn.id = 'timer-pause';
        pauseBtn.style.display = 'none'; // hide initially

        const resetBtn = this.createElement('button', ['timer-btn', 'btn-reset'], 'Reset');
        resetBtn.id = 'timer-reset';

        timerControls.appendChild(startBtn);
        timerControls.appendChild(pauseBtn);
        timerControls.appendChild(resetBtn);

        timerContainer.appendChild(timerTitle);
        timerContainer.appendChild(timerDisplay);
        timerContainer.appendChild(timerControls);

        container.appendChild(timerContainer);
        // -----------------------------

        // Button Group
        const btnGroup = this.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.flexDirection = 'column';
        btnGroup.style.gap = '12px';
        btnGroup.style.marginTop = '1rem';

        // View Weekly Plan Button
        const planBtn = this.createElement('button', ['btn', 'btn-primary'], 'View Weekly Action Plan');
        planBtn.style.width = '100%';
        planBtn.addEventListener('click', onViewPlanClick);
        btnGroup.appendChild(planBtn);

        // Restart Button
        const restartBtn = this.createElement('button', ['btn', 'btn-outline'], 'Retake Questionnaire');
        restartBtn.style.width = '100%';
        restartBtn.addEventListener('click', onRestartClick);
        btnGroup.appendChild(restartBtn);

        container.appendChild(btnGroup);

        this.appContainer.appendChild(container);

        // Ensure Audio Widget persists
        this.renderAudioWidget();

        // Force scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Renders the persistent Audio Widget
     */
    renderAudioWidget() {
        // Don't recreate if it exists in DOM
        if (document.getElementById('audio-widget-container')) {
            this.appContainer.appendChild(document.getElementById('audio-widget-container'));
            return;
        }

        const widget = this.createElement('div', ['audio-widget']);
        widget.id = 'audio-widget-container';

        const label = this.createElement('span', [], 'Focus Audio');
        label.style.fontWeight = '600';
        label.style.fontSize = '0.9rem';
        label.style.color = 'var(--text-main)';

        const controls = this.createElement('div', ['audio-controls']);
        const toggleBtn = this.createElement('button', []);
        toggleBtn.innerHTML = this.isPlayingAudio ? '❚❚' : '▶'; // pause / play icons

        if (!this.audioElement) {
            this.audioElement = this.createElement('audio');
            // Using a reliable lo-fi / ambient brain focus track (CC0 or public domain proxy)
            this.audioElement.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3';
            this.audioElement.loop = true;
            widget.appendChild(this.audioElement);
        }

        toggleBtn.addEventListener('click', () => {
            if (this.isPlayingAudio) {
                this.audioElement.pause();
                toggleBtn.innerHTML = '▶';
            } else {
                // Handle initial interaction promise rejection
                this.audioElement.play().catch(e => console.log("Audio play failed:", e));
                toggleBtn.innerHTML = '❚❚';
            }
            this.isPlayingAudio = !this.isPlayingAudio;
        });

        controls.appendChild(toggleBtn);
        widget.appendChild(label);
        widget.appendChild(controls);

        this.appContainer.appendChild(widget);
    }

    /**
     * Renders the Interactive Weekly Plan Checklist Screen
     */
    renderWeeklyPlan(planData, checklistState, onToggle, onBackClick) {
        this.clearApp();

        const container = this.createElement('div', ['plan-container']);

        const header = this.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '1rem';
        header.style.marginBottom = '2rem';

        const backBtn = this.createElement('button', ['btn', 'btn-outline'], '← Back');
        backBtn.style.padding = '8px 16px';
        backBtn.addEventListener('click', onBackClick);
        header.appendChild(backBtn);

        const title = this.createElement('h1', [], 'Weekly Action Plan');
        title.style.margin = '0';
        title.style.color = 'var(--primary)';
        header.appendChild(title);

        container.appendChild(header);

        const desc = this.createElement('p', [], 'Check off your study routines throughout the week to stay on track!');
        desc.style.marginBottom = '2rem';
        container.appendChild(desc);

        // Interactive Checklist
        const routineList = this.createElement('div', ['routine-list']);
        routineList.style.display = 'flex';
        routineList.style.flexDirection = 'column';
        routineList.style.gap = '12px';

        planData.weeklyRoutine.forEach(item => {
            const isChecked = checklistState[item.id] || false;

            const card = this.createElement('div', ['routine-item']);
            if (isChecked) card.classList.add('checked');

            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.style.padding = '1.25rem';
            card.style.border = '1px solid var(--border)';
            card.style.borderRadius = 'var(--radius-md)';
            card.style.backgroundColor = isChecked ? 'rgba(248, 250, 252, 0.7)' : 'rgba(255,255,255,0.8)';
            card.style.cursor = 'pointer';
            card.style.transition = 'var(--transition)';

            // Custom Checkbox mapping to CSS
            const checkbox = this.createElement('input', ['routine-checkbox']);
            checkbox.type = 'checkbox';
            checkbox.checked = isChecked;
            checkbox.style.width = '24px';
            checkbox.style.height = '24px';
            checkbox.style.marginRight = '16px';
            checkbox.style.cursor = 'pointer';
            checkbox.style.accentColor = 'var(--secondary)';

            const textContainer = this.createElement('div', ['routine-content']);
            const text = this.createElement('p', ['routine-text'], item.text);
            text.style.margin = '0';
            text.style.fontSize = '1.05rem';
            text.style.color = isChecked ? 'var(--text-muted)' : 'var(--text-main)';
            if (isChecked) text.style.textDecoration = 'line-through';

            textContainer.appendChild(text);

            // Toggle logic attached to the card
            card.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
                onToggle(item.id, checkbox.checked);
            });

            // Prevent double-toggling if they click the actual checkbox
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                onToggle(item.id, checkbox.checked);
            });

            card.appendChild(checkbox);
            card.appendChild(textContainer);
            routineList.appendChild(card);
        });

        container.appendChild(routineList);
        this.appContainer.appendChild(container);

        // Ensure Audio Widget persists
        this.renderAudioWidget();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
