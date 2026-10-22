// src/app.js

class LockinApp {
    constructor() {
        this.ui = new UIManager();
        this.currentQuestionIndex = 0;
        this.responses = {};
        this.planData = null;
        this.checklistState = {};

        // Initial state
        this.init();
    }

    init() {
        this.ui.renderWelcomeScreen((userInfo) => this.startQuestionnaire(userInfo));
    }

    startQuestionnaire(userInfo) {
        this.userInfo = userInfo || { name: 'Student', age: null };
        this.currentQuestionIndex = 0;
        this.responses = {};
        this.planData = null;
        this.checklistState = {};
        this.resetTimer(); // Reset advanced state on new run
        this.renderCurrentQuestion();
    }

    renderCurrentQuestion() {
        const questionObj = QUESTIONNAIRE[this.currentQuestionIndex];

        this.ui.renderQuestion(
            questionObj,
            this.currentQuestionIndex,
            QUESTIONNAIRE.length,
            (selectedValue) => this.handleOptionSelect(questionObj.id, selectedValue)
        );
    }

    handleOptionSelect(questionId, selectedValue) {
        // Save the response
        this.responses[questionId] = selectedValue;

        // Move to the next question or finish
        if (this.currentQuestionIndex < QUESTIONNAIRE.length - 1) {
            this.currentQuestionIndex++;
            this.renderCurrentQuestion();
        } else {
            this.finishQuestionnaire();
        }
    }

    finishQuestionnaire() {
        // Show a brief loading state conceptually
        this.ui.clearApp();

        const loader = this.ui.createElement('div', [], 'Analyzing profile...');
        loader.style.textAlign = 'center';
        loader.style.fontSize = '1.2rem';
        loader.style.color = 'var(--text-muted)';
        loader.style.marginTop = '2rem';
        loader.classList.add('view');

        this.ui.appContainer.appendChild(loader);

        setTimeout(() => {
            // Generate Plan from logic.js
            this.planData = generateStudyPlan(this.responses, this.userInfo);

            // Show Results Screen
            this.showResults();
        }, 800); // 800ms artificial delay for perceived "calculation" value
    }

    showResults() {
        this.ui.renderResults(
            this.planData,
            () => this.init(),
            () => this.showWeeklyPlan()
        );
        this.initAdvancedFeatures();
    }

    showWeeklyPlan() {
        this.ui.renderWeeklyPlan(
            this.planData,
            this.checklistState,
            (itemId, isChecked) => this.handleChecklistToggle(itemId, isChecked),
            () => this.showResults() // Go back to results
        );
    }

    handleChecklistToggle(itemId, isChecked) {
        this.checklistState[itemId] = isChecked;
        // Re-render to update UI with new state
        this.showWeeklyPlan();
    }

    // --- Advanced Features Logic ---

    initAdvancedFeatures() {
        // Pomodoro Timer Binding
        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');
        const resetBtn = document.getElementById('timer-reset');

        if (startBtn) startBtn.addEventListener('click', () => this.startTimer());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pauseTimer());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetTimer());

        // Initial Timer Render
        this.updateTimerDisplay();

        // Sandbox Download Binding
        const saveBtn = document.getElementById('sandbox-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.downloadNotes());
        }
    }

    startTimer() {
        if (this.isTimerRunning) return;
        this.isTimerRunning = true;

        document.getElementById('timer-start').style.display = 'none';
        document.getElementById('timer-pause').style.display = 'inline-block';

        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.updateTimerDisplay();
            } else {
                this.pauseTimer();
                alert("Time's up! Great focus block. Take a 5 minute break.");
                this.resetTimer();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isTimerRunning = false;
        clearInterval(this.timerInterval);

        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');
        if (startBtn) startBtn.style.display = 'inline-block';
        if (pauseBtn) pauseBtn.style.display = 'none';
    }

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = 25 * 60;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const display = document.getElementById('pomodoro-display');
        if (!display) return;

        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    downloadNotes() {
        const textarea = document.getElementById('sandbox-textarea');
        if (!textarea || !textarea.value.trim()) {
            alert("No notes to save! Try Blurting something out first.");
            return;
        }

        const text = textarea.value;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `lockin-notes-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.lockinApp = new LockinApp();
});
