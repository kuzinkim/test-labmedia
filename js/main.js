document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".step");
    const nextBtn = document.getElementById("next");
    const stepProgress = document.getElementById("stepProgress");

    let currentStep = 1;
    const totalSteps = steps.length;

    function updateStepDisplay() {
        steps.forEach((step) => step.classList.remove("active"));
        const current = document.querySelector(`.step[data-step="${currentStep}"]`);
        current.classList.add("active");

        stepProgress.style.width = `${(currentStep - 1) / (totalSteps - 1) * 100}%`;
        nextBtn.disabled = true;

        if (currentStep === 2) {
            swiper.update();
            updateSliderProgress(swiper);
        }

        if (currentStep === steps.length) {
            nextBtn.textContent = "Перейти к квизу";
        } else {
            nextBtn.textContent = "Продолжить";
        }
    }

    nextBtn.addEventListener("click", () => {
        if (currentStep === steps.length) {
            window.location.href = "quiz.html";
        } else {
            currentStep++;
            updateStepDisplay();
        }
    });

    // Шаг 1: табы
    const tabButtons = document.querySelectorAll(".tabs-list button");
    const tabContents = document.querySelectorAll("#tabContent > div");
    const tabsClicked = new Set();
    const innerProgress = document.getElementById("innerProgress");

    const initiallyActive = document.querySelector(".tabs-list button.active");
    if (initiallyActive) {
        const tabId = initiallyActive.dataset.tab;
        tabsClicked.add(tabId);

        tabContents.forEach(content => {
            content.style.display = content.dataset.tab === tabId ? "block" : "none";
        });

        innerProgress.style.width = `${(tabsClicked.size / tabButtons.length) * 100}%`;
    }

    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            tabButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const tabId = btn.dataset.tab;

            tabContents.forEach(content => {
                content.style.display = content.dataset.tab === tabId ? "block" : "none";
            });

            tabsClicked.add(tabId);
            innerProgress.style.width = `${(tabsClicked.size / tabButtons.length) * 100}%`;

            if (tabsClicked.size === tabButtons.length) {
                nextBtn.disabled = false;
            }
        });
    });

    // Шаг 2: слайдер
    const swiper = new Swiper(".swiper", {
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".arrow-right",
            prevEl: ".arrow-left",
          },
        on: {
            slideChange: function () {
                updateSliderProgress(this);
            },
        },
    });

    function updateSliderProgress(swiperInstance) {
        const percent = ((swiperInstance.activeIndex + 1) / swiperInstance.slides.length) * 100;
        document.getElementById("sliderProgress").style.width = `${percent}%`;

        if (swiperInstance.activeIndex === swiperInstance.slides.length - 1) {
            nextBtn.disabled = false;
        }
    }

    updateSliderProgress(swiper);

    // Шаг 3: аккордеон
    const accButtons = document.querySelectorAll(".acc-btn");
    const accProgress = document.getElementById("accordionProgress");
    const opened = new Set();

    accButtons.forEach((btn, idx) => {
        btn.addEventListener("click", () => {
            const content = btn.nextElementSibling;
            const item = btn.closest(".item");
            const isOpen = content.style.display === "block";
    
            if (isOpen) {
                content.style.display = "none";
                item.classList.remove("active");
                opened.delete(idx);
            } else {
                content.style.display = "block";
                item.classList.add("active");
                opened.add(idx);
            }
    
            accProgress.style.width = `${(opened.size / accButtons.length) * 100}%`;
            nextBtn.disabled = opened.size !== accButtons.length;
        });
    });

    // Шаг 4: флип-карточки
    const cards = document.querySelectorAll(".card");
    const flipped = new Set();
    const flipProgress = document.getElementById("flipProgress");

    document.querySelectorAll('.flip-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation(); // на всякий случай
            const card = e.target.closest('.card');
            card.classList.toggle('flipped');

            if (card.classList.contains('flipped')) {
                flipped.add(card.dataset.index);
            } else {
                flipped.delete(card.dataset.index);
            }

            flipProgress.style.width = `${(flipped.size / cards.length) * 100}%`;

            nextBtn.disabled = flipped.size !== cards.length;
        });
    });
    updateStepDisplay();
});
