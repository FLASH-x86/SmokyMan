// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const soundToggle = document.getElementById('soundToggle');
let isDarkMode = false;
let isSoundEnabled = true;

// Sound effects
const sounds = {
    cut: new Howl({ src: ['/static/sounds/cut.mp3'] }),
    gameOver: new Howl({ src: ['/static/sounds/game-over.mp3'] }),
    success: new Howl({ src: ['/static/sounds/success.mp3'] })
};

// Theme toggle
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Sound toggle
soundToggle.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundToggle.innerHTML = isSoundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Chart.js configuration
const ctx = document.getElementById('smokingChart').getContext('2d');
const smokingChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022'],
        datasets: [{
            label: 'Pourcentage de fumeurs en France',
            data: [30, 28, 26, 25, 24, 23, 22],
            borderColor: '#e74c3c',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 35
            }
        }
    }
});

// Game implementation
const canvas = document.getElementById('gameCanvas');
const ctx2 = canvas.getContext('2d');
const startButton = document.getElementById('startGame');
const scoreElement = document.getElementById('score');

// Adjust canvas size for mobile
function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    canvas.width = Math.min(containerWidth, 400);
    canvas.height = Math.min(canvas.width * 0.75, 300);
}

// Initial resize and on window resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let score = 0;
let gameInterval;
let cigarettes = [];

class Cigarette {
    constructor() {
        this.x = Math.random() * (canvas.width - 20);
        this.y = -20;
        this.speed = 2 + Math.random() * 2;
        this.width = 20;
        this.height = 40;
    }

    draw() {
        ctx2.fillStyle = '#e74c3c';
        ctx2.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
        return this.y > canvas.height;
    }
}

function gameLoop() {
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spawn new cigarettes
    if (Math.random() < 0.02) {
        cigarettes.push(new Cigarette());
    }

    // Update and draw cigarettes
    cigarettes = cigarettes.filter(cigarette => {
        cigarette.draw();
        return !cigarette.update();
    });

    // Check for game over
    if (cigarettes.length > 10) {
        gameOver();
    }
}

function gameOver() {
    clearInterval(gameInterval);
    if (isSoundEnabled) sounds.gameOver.play();
    alert('Game Over! Score: ' + score);
    score = 0;
    scoreElement.textContent = score;
    cigarettes = [];
    startButton.disabled = false;
}

// Touch support for the game
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    touchStartX = touch.clientX - rect.left;
    touchStartY = touch.clientY - rect.top;
    
    // Handle cigarette clicks
    cigarettes = cigarettes.filter(cigarette => {
        if (touchStartX >= cigarette.x && touchStartX <= cigarette.x + cigarette.width &&
            touchStartY >= cigarette.y && touchStartY <= cigarette.y + cigarette.height) {
            score++;
            scoreElement.textContent = score;
            if (isSoundEnabled) sounds.cut.play();
            return false;
        }
        return true;
    });
}, { passive: false });

// Mobile menu improvements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Prevent body scroll when menu is open
navLinks.addEventListener('touchmove', (e) => {
    if (navLinks.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });

startButton.addEventListener('click', () => {
    score = 0;
    scoreElement.textContent = score;
    cigarettes = [];
    startButton.disabled = true;
    gameInterval = setInterval(gameLoop, 20);
});

// Quiz implementation
const quizData = [
    {
        question: "Combien de cigarettes fumez-vous par jour ?",
        options: ["0", "1-5", "6-10", "11-20", "Plus de 20"],
        points: [0, 1, 2, 3, 4]
    },
    {
        question: "Fumez-vous dans l'heure qui suit votre réveil ?",
        options: ["Non", "Oui"],
        points: [0, 2]
    },
    {
        question: "Trouvez-vous difficile de ne pas fumer dans les endroits où c'est interdit ?",
        options: ["Non", "Oui"],
        points: [0, 1]
    }
];

const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submitQuiz');

function createQuiz() {
    quizData.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.innerHTML = `
            <h4>${question.question}</h4>
            ${question.options.map((option, i) => `
                <label>
                    <input type="radio" name="q${index}" value="${question.points[i]}">
                    ${option}
                </label>
            `).join('')}
        `;
        quizContainer.appendChild(questionDiv);
    });
}

submitButton.addEventListener('click', () => {
    let totalPoints = 0;
    quizData.forEach((_, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected) totalPoints += parseInt(selected.value);
    });

    let result;
    if (totalPoints <= 2) result = "Faible dépendance";
    else if (totalPoints <= 4) result = "Dépendance modérée";
    else result = "Forte dépendance";

    alert(`Votre score: ${totalPoints}\nNiveau de dépendance: ${result}`);
});

createQuiz();

// Form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isSoundEnabled) sounds.success.play();
    alert('Message envoyé avec succès !');
    contactForm.reset();
});

// Loading screen handling
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading');
    if (loadingScreen) {
        // Hide loading screen after a short delay
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 500);
    }
}); 