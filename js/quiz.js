document.addEventListener("DOMContentLoaded", function () {
    const quizData = [
        { question: "Столица Франции?", options: ["Берлин", "Мадрид", "Париж", "Рим"], correct: 2 },
        { question: "2 + 2 = ?", options: ["3", "4", "5", "22"], correct: 1 },
        { question: "Какой цвет в флаге России сверху?", options: ["Белый", "Синий", "Красный"], correct: 0 },
        { question: "HTML расшифровывается как?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Mark Language"], correct: 0 },
        { question: "Сколько дней в високосном году?", options: ["365", "366", "367"], correct: 1 },
        { question: "Какой океан самый большой?", options: ["Индийский", "Атлантический", "Тихий"], correct: 2 },
        { question: "Какой газ необходим для дыхания?", options: ["Кислород", "Азот", "Углекислый газ"], correct: 0 },
        { question: "CSS отвечает за...", options: ["структуру", "стили", "динамику"], correct: 1 },
        { question: "Какая планета ближе всего к Солнцу?", options: ["Земля", "Меркурий", "Марс"], correct: 1 },
        { question: "Что делает тег <a>?", options: ["Создаёт таблицу", "Выделяет текст", "Создаёт ссылку"], correct: 2 }
    ];

    let currentQuestion = 0;
    let score = 0;
    let bestScore = localStorage.getItem('bestStepQuiz') || 0;

    const startScreen = document.getElementById('startScreen');
    const questionScreen = document.getElementById('questionScreen');
    const resultScreen = document.getElementById('resultScreen');
    const questionText = document.getElementById('questionText');
    const answersContainer = document.getElementById('answersContainer');
    const nextBtn = document.getElementById('nextBtn');
    const resultMessage = document.getElementById('resultMessage');
    const progressBar = document.getElementById('quizProgress');

    document.getElementById('startBtn').addEventListener('click', () => {
        startScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        loadQuestion();
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        resultScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        loadQuestion();
    });

    nextBtn.addEventListener('click', () => {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) return;

        const answer = parseInt(selected.value);
        if (answer === quizData[currentQuestion].correct) {
            score++;
        }

        currentQuestion++;

        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    });

    function loadQuestion() {
        const q = quizData[currentQuestion];
        questionText.textContent = `${currentQuestion + 1}. ${q.question}`;
        answersContainer.innerHTML = '';
        nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Завершить' : 'Далее';
        nextBtn.disabled = true;

        q.options.forEach((opt, i) => {
            const id = `opt_${i}`;
            const label = document.createElement('label');
            label.innerHTML = `<input type="radio" name="answer" id="${id}" value="${i}"> ${opt}`;
            answersContainer.appendChild(label);
        });

        answersContainer.addEventListener('change', () => {
            nextBtn.disabled = false;
        }, { once: true });

        updateProgress();
    }

    function updateProgress() {
        const percent = ((currentQuestion) / quizData.length) * 100;
        progressBar.style.width = percent + '%';
    }

    function showResult() {
        questionScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        progressBar.style.width = '100%';

        const percent = Math.round((score / quizData.length) * 100);
        const isPassed = percent >= 80;

        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestStepQuiz', bestScore);
        }

        resultMessage.className = 'result ' + (isPassed ? 'good' : 'bad');
        resultMessage.innerHTML = `
          <p>Ваш результат: <span>${score}/${quizData.length} (${percent}%)</span></p>
          ${isPassed
                ? `<p>Отличный результат! 🎉</p>`
                : `<p>Попробуй ещё раз, получится лучше! 😅<br>Лучший результат: <span>${bestScore}/${quizData.length}</span></p>`}
        `;
    }
})