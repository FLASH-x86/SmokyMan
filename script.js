document.addEventListener('DOMContentLoaded', () => {
    // Initialisation des particules
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#e74c3c'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#e74c3c',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    // Éléments du DOM
    const startBtn = document.getElementById('startBtn');
    const lungs = document.getElementById('lungs');
    const cigaretteCount = document.getElementById('cigaretteCount');
    const yearsLost = document.getElementById('yearsLost');
    const moneySpent = document.getElementById('moneySpent');
    const progressBar = document.getElementById('progressBar');
    const currentLevel = document.getElementById('currentLevel');
    const themeToggle = document.getElementById('themeToggle');
    const soundToggle = document.getElementById('soundToggle');
    const smokeSound = document.getElementById('smokeSound');
    const damageSound = document.getElementById('damageSound');
    const lungElements = document.querySelectorAll('.lung');
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Variables d'état
    let count = 0;
    let years = 0;
    let money = 0;
    let level = 1;
    let isAnimating = false;
    let isSoundEnabled = true;
    let isDarkMode = true;

    // Gestion du thème
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Vérifier le thème préféré de l'utilisateur
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    // Toggle du thème avec animation
    themeToggle.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        
        // Animation de transition
        body.style.transition = 'background-color 0.5s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 500);
        
        // Mise à jour de l'icône avec animation
        icon.style.transform = 'scale(0)';
        setTimeout(() => {
            icon.classList.replace(isDark ? 'fa-sun' : 'fa-moon', isDark ? 'fa-moon' : 'fa-sun');
            icon.style.transform = 'scale(1)';
        }, 250);
    });

    // Gestion du son avec animation
    const soundIcon = soundToggle.querySelector('i');
    let soundEnabled = true;

    // Sons pour le jeu
    const sounds = {
        click: new Howl({ src: ['sounds/click.mp3'] }),
        success: new Howl({ src: ['sounds/success.mp3'] }),
        failure: new Howl({ src: ['sounds/failure.mp3'] })
    };

    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundIcon.style.transform = 'scale(0)';
        setTimeout(() => {
            soundIcon.classList.replace(
                soundEnabled ? 'fa-volume-mute' : 'fa-volume-up',
                soundEnabled ? 'fa-volume-up' : 'fa-volume-mute'
            );
            soundIcon.style.transform = 'scale(1)';
            Howler.mute(!soundEnabled);
        }, 250);
    });

    // Messages aléatoires
    const messages = [
        "Chaque cigarette réduit votre espérance de vie...",
        "La fumée endommage vos poumons...",
        "Le tabac contient plus de 4000 substances toxiques...",
        "Votre santé se dégrade...",
        "Pensez à votre famille...",
        "Le tabac est la première cause de mortalité évitable...",
        "Vos poumons souffrent...",
        "L'argent dépensé pourrait être utilisé autrement...",
        "Votre entourage est aussi affecté..."
    ];

    startBtn.addEventListener('click', () => {
        if (!isAnimating) {
            isAnimating = true;
            count++;
            years = Math.floor(count / 20);
            money = count * 0.8;

            // Mise à jour des statistiques
            updateStats();
            updateTimeline();
            updateLevel();

            // Animation des poumons
            animateLungs();

            // Effets sonores
            playSounds();

            // Effet de fumée
            createSmokeEffect();

            // Dégradation progressive des poumons
            updateLungDamage();

            // Message aléatoire
            showRandomMessage();

            setTimeout(() => {
                isAnimating = false;
            }, 1000);
        }
    });

    function updateStats() {
        cigaretteCount.textContent = count;
        yearsLost.textContent = years;
        moneySpent.textContent = money.toFixed(2);
    }

    function updateTimeline() {
        timelineItems.forEach(item => {
            const cigs = parseInt(item.dataset.cigs);
            if (count >= cigs) {
                item.classList.add('active');
            }
        });
    }

    function updateLevel() {
        const newLevel = Math.floor(count / 10) + 1;
        if (newLevel > level) {
            level = newLevel;
            currentLevel.textContent = level;
            showLevelUpMessage();
        }
        const progress = (count % 10) * 10;
        progressBar.style.width = `${progress}%`;
    }

    function animateLungs() {
        lungElements.forEach(lung => {
            lung.classList.add('damaged');
            setTimeout(() => {
                lung.classList.remove('damaged');
            }, 1000);
        });
    }

    function playSounds() {
        if (isSoundEnabled) {
            smokeSound.currentTime = 0;
            smokeSound.play();
            setTimeout(() => {
                damageSound.currentTime = 0;
                damageSound.play();
            }, 500);
        }
    }

    function createSmokeEffect() {
        for (let i = 0; i < 5; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke';
            smoke.style.left = Math.random() * 100 + '%';
            document.querySelector('.lungs-container').appendChild(smoke);

            setTimeout(() => {
                smoke.remove();
            }, 2000);
        }
    }

    function updateLungDamage() {
        const damageLevel = Math.min(count * 0.1, 0.7);
        lungElements.forEach(lung => {
            lung.style.opacity = 1 - damageLevel;
            lung.style.filter = `blur(${damageLevel * 2}px)`;
        });
    }

    function showRandomMessage() {
        const message = messages[Math.floor(Math.random() * messages.length)];
        showMessage(message);
    }

    function showLevelUpMessage() {
        const message = `Niveau ${level} atteint ! Les dégâts sont plus importants...`;
        showMessage(message, 'level-up');
    }

    function showMessage(text, type = '') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = text;
        document.body.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    function updateParticlesColor() {
        const color = isDarkMode ? '#e74c3c' : '#ff7676';
        particlesJS('particles-js', {
            particles: {
                color: {
                    value: color
                },
                line_linked: {
                    color: color
                }
            }
        });
    }

    // Initialisation des sons
    smokeSound.volume = 0.3;
    damageSound.volume = 0.5;

    // Ajout d'animations aux cartes de motivation
    document.querySelectorAll('.motivation-card').forEach(card => {
        card.classList.add('float');
    });

    // Menu mobile avec animation
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.style.transform = navLinks.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0)';
        if (soundEnabled) sounds.click.play();
    });

    // Fermer le menu mobile lors du clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Smooth scroll avec animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animation des sections au scroll
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        observer.observe(section);
    });

    // Mini-jeu amélioré
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startGame');
    const scoreElement = document.getElementById('score');

    // Ajuster la taille du canvas
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Variables du jeu
    let gameRunning = false;
    let score = 0;
    let cigarettes = [];
    let scissors = { x: 0, y: 0, width: 50, height: 50 };
    let particles = [];

    // Dessiner les ciseaux avec animation
    function drawScissors() {
        ctx.save();
        ctx.translate(scissors.x + scissors.width/2, scissors.y + scissors.height/2);
        ctx.rotate(Math.sin(Date.now() / 200) * 0.1);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(-scissors.width/2, -scissors.height/2, scissors.width, scissors.height);
        ctx.restore();
    }

    // Créer une cigarette avec animation
    function createCigarette() {
        return {
            x: Math.random() * (canvas.width - 20),
            y: -20,
            width: 20,
            height: 40,
            speed: 2 + Math.random() * 2,
            rotation: Math.random() * Math.PI * 2
        };
    }

    // Dessiner une cigarette avec animation
    function drawCigarette(cig) {
        ctx.save();
        ctx.translate(cig.x + cig.width/2, cig.y + cig.height/2);
        ctx.rotate(cig.rotation);
        ctx.fillStyle = '#fff';
        ctx.fillRect(-cig.width/2, -cig.height/2, cig.width, cig.height);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(-cig.width/2, -cig.height/2, cig.width, 5);
        ctx.restore();
    }

    // Créer des particules d'explosion
    function createParticles(x, y) {
        for (let i = 0; i < 10; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 3 + 1,
                life: 1
            });
        }
    }

    // Dessiner les particules
    function drawParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.fillStyle = `rgba(231, 76, 60, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    // Détection de collision améliorée
    function checkCollision(cig) {
        const dx = (scissors.x + scissors.width/2) - (cig.x + cig.width/2);
        const dy = (scissors.y + scissors.height/2) - (cig.y + cig.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (scissors.width + cig.width) / 2;
    }

    // Boucle de jeu améliorée
    function gameLoop() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Mettre à jour la position des ciseaux
        scissors.x = mouseX - scissors.width/2;
        scissors.y = mouseY - scissors.height/2;

        // Dessiner les ciseaux
        drawScissors();

        // Mettre à jour et dessiner les cigarettes
        for (let i = cigarettes.length - 1; i >= 0; i--) {
            const cig = cigarettes[i];
            cig.y += cig.speed;
            cig.rotation += 0.02;
            drawCigarette(cig);

            // Vérifier la collision
            if (checkCollision(cig)) {
                createParticles(cig.x + cig.width/2, cig.y + cig.height/2);
                cigarettes.splice(i, 1);
                score++;
                scoreElement.textContent = score;
                if (soundEnabled) sounds.success.play();
            }

            // Supprimer les cigarettes qui sortent de l'écran
            if (cig.y > canvas.height) {
                cigarettes.splice(i, 1);
                if (soundEnabled) sounds.failure.play();
            }
        }

        // Dessiner les particules
        drawParticles();

        // Ajouter de nouvelles cigarettes
        if (Math.random() < 0.02) {
            cigarettes.push(createCigarette());
        }

        requestAnimationFrame(gameLoop);
    }

    // Position de la souris
    let mouseX = 0;
    let mouseY = 0;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    // Démarrer le jeu avec animation
    startButton.addEventListener('click', () => {
        if (!gameRunning) {
            gameRunning = true;
            score = 0;
            scoreElement.textContent = score;
            cigarettes = [];
            particles = [];
            startButton.style.transform = 'scale(0.9)';
            setTimeout(() => {
                startButton.style.transform = 'scale(1)';
            }, 100);
            startButton.textContent = 'Recommencer';
            gameLoop();
        } else {
            gameRunning = false;
            startButton.style.transform = 'scale(0.9)';
            setTimeout(() => {
                startButton.style.transform = 'scale(1)';
            }, 100);
            startButton.textContent = 'Commencer';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    // Quiz amélioré
    const quizData = [
        {
            question: "Combien de substances cancérigènes contient une cigarette ?",
            options: ["10", "50", "70", "100"],
            correct: 2,
            explanation: "Une cigarette contient plus de 70 substances cancérigènes qui peuvent causer le cancer."
        },
        {
            question: "Quel est le pourcentage de fumeurs qui veulent arrêter ?",
            options: ["30%", "50%", "70%", "90%"],
            correct: 2,
            explanation: "Environ 70% des fumeurs expriment le désir d'arrêter de fumer."
        },
        {
            question: "Combien de temps faut-il pour que la nicotine atteigne le cerveau ?",
            options: ["7 secondes", "15 secondes", "30 secondes", "1 minute"],
            correct: 0,
            explanation: "La nicotine atteint le cerveau en seulement 7 secondes après l'inhalation."
        }
    ];

    const quizContainer = document.getElementById('quiz');
    const submitButton = document.getElementById('submitQuiz');
    let currentQuestion = 0;
    let userAnswers = [];

    function displayQuestion() {
        const question = quizData[currentQuestion];
        quizContainer.innerHTML = `
            <div class="quiz-question">
                <h4>${question.question}</h4>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <label class="quiz-option">
                            <input type="radio" name="answer" value="${index}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Animation d'entrée
        quizContainer.style.opacity = '0';
        quizContainer.style.transform = 'translateY(20px)';
        setTimeout(() => {
            quizContainer.style.opacity = '1';
            quizContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    submitButton.addEventListener('click', () => {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            userAnswers.push(parseInt(selectedAnswer.value));
            currentQuestion++;
            
            if (currentQuestion < quizData.length) {
                displayQuestion();
            } else {
                showResults();
            }
        }
    });

    function showResults() {
        const correctAnswers = userAnswers.filter((answer, index) => answer === quizData[index].correct).length;
        const percentage = (correctAnswers / quizData.length) * 100;
        
        quizContainer.innerHTML = `
            <div class="quiz-results">
                <h4>Résultats du quiz</h4>
                <div class="score-circle">
                    <svg viewBox="0 0 36 36">
                        <path d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e74c3c"
                            stroke-width="3"
                            stroke-dasharray="${percentage}, 100"/>
                    </svg>
                    <span>${percentage}%</span>
                </div>
                <p>Vous avez répondu correctement à ${correctAnswers} questions sur ${quizData.length}.</p>
                <div class="explanations">
                    ${quizData.map((q, i) => `
                        <div class="explanation">
                            <h5>Question ${i + 1}:</h5>
                            <p>${q.explanation}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        submitButton.style.display = 'none';
        
        // Animation des résultats
        quizContainer.style.opacity = '0';
        quizContainer.style.transform = 'translateY(20px)';
        setTimeout(() => {
            quizContainer.style.opacity = '1';
            quizContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    displayQuestion();

    // Formulaire de contact amélioré
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Animation de soumission
        contactForm.style.transform = 'scale(0.95)';
        setTimeout(() => {
            contactForm.style.transform = 'scale(1)';
        }, 200);
        
        // Afficher le message de confirmation
        const message = document.createElement('div');
        message.className = 'message success';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Merci pour votre message ! Nous vous répondrons bientôt.</p>
        `;
        contactForm.parentNode.insertBefore(message, contactForm.nextSibling);
        
        // Animation du message
        message.style.opacity = '0';
        message.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transform = 'translateY(0)';
        }, 100);
        
        // Supprimer le message après 3 secondes
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 3000);
        
        contactForm.reset();
    });
});

// Gestion du chargement
window.addEventListener('load', () => {
    const loading = document.querySelector('.loading');
    loading.style.opacity = '0';
    setTimeout(() => {
        loading.style.display = 'none';
    }, 500);
});

// Gestion du thème
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Gestion du son
const soundToggle = document.getElementById('soundToggle');
let soundEnabled = true;

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const icon = soundToggle.querySelector('i');
    icon.classList.toggle('fa-volume-up');
    icon.classList.toggle('fa-volume-mute');
});

// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Défilement fluide
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mini-jeu
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startGame');
const scoreElement = document.getElementById('score');

canvas.width = 800;
canvas.height = 400;

let score = 0;
let gameRunning = false;
let cigarettes = [];
let scissors = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50
};

function drawScissors() {
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(scissors.x, scissors.y, scissors.width, scissors.height);
}

function drawCigarettes() {
    cigarettes.forEach(cigarette => {
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(cigarette.x, cigarette.y, cigarette.width, cigarette.height);
    });
}

function update() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Déplacer les cigarettes
    cigarettes.forEach(cigarette => {
        cigarette.y += 2;
    });
    
    // Supprimer les cigarettes hors écran
    cigarettes = cigarettes.filter(cigarette => cigarette.y < canvas.height);
    
    // Générer de nouvelles cigarettes
    if (Math.random() < 0.02) {
        cigarettes.push({
            x: Math.random() * (canvas.width - 20),
            y: -20,
            width: 20,
            height: 40
        });
    }
    
    // Vérifier les collisions
    cigarettes.forEach((cigarette, index) => {
        if (
            scissors.x < cigarette.x + cigarette.width &&
            scissors.x + scissors.width > cigarette.x &&
            scissors.y < cigarette.y + cigarette.height &&
            scissors.y + scissors.height > cigarette.y
        ) {
            cigarettes.splice(index, 1);
            score++;
            scoreElement.textContent = score;
            if (soundEnabled) {
                new Audio('/static/sounds/cut.mp3').play();
            }
        }
    });
    
    drawScissors();
    drawCigarettes();
    requestAnimationFrame(update);
}

startButton.addEventListener('click', () => {
    if (!gameRunning) {
        gameRunning = true;
        score = 0;
        scoreElement.textContent = score;
        cigarettes = [];
        update();
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    scissors.x = e.clientX - rect.left - scissors.width / 2;
});

// Quiz
const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submitQuiz');

const questions = [
    {
        question: "Combien de substances cancérigènes contient une cigarette ?",
        options: ["20", "50", "70", "100"],
        correct: 2
    },
    {
        question: "Quel pourcentage de fumeurs souhaite arrêter de fumer ?",
        options: ["30%", "50%", "70%", "90%"],
        correct: 2
    },
    {
        question: "Combien de temps faut-il à la nicotine pour atteindre le cerveau ?",
        options: ["3 secondes", "5 secondes", "7 secondes", "10 secondes"],
        correct: 2
    }
];

function displayQuiz() {
    let output = '';
    questions.forEach((question, index) => {
        output += `
            <div class="quiz-question">
                <h4>${question.question}</h4>
                ${question.options.map((option, i) => `
                    <label>
                        <input type="radio" name="q${index}" value="${i}">
                        ${option}
                    </label>
                `).join('')}
            </div>
        `;
    });
    quizContainer.innerHTML = output;
}

submitButton.addEventListener('click', () => {
    let score = 0;
    questions.forEach((question, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && parseInt(selected.value) === question.correct) {
            score++;
        }
    });
    
    const result = (score / questions.length) * 100;
    alert(`Votre score : ${result.toFixed(0)}%`);
    
    if (soundEnabled) {
        if (result >= 70) {
            new Audio('/static/sounds/success.mp3').play();
        } else {
            new Audio('/static/sounds/game-over.mp3').play();
        }
    }
});

displayQuiz();

// Formulaire de contact
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    
    try {
        const response = await fetch('/submit_contact', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Message envoyé avec succès !');
            contactForm.reset();
        } else {
            alert('Erreur : ' + data.error);
        }
    } catch (error) {
        alert('Une erreur est survenue lors de l\'envoi du message.');
    }
}); 