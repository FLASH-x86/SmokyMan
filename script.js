let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let gameWidth = canvas.width;
let gameHeight = canvas.height;

let catcher = {
  x: gameWidth / 2 - 50,
  y: gameHeight - 40,
  width: 80,
  height: 20,
  speed: 7
};

let cigarette = {
  x: Math.random() * (gameWidth - 30),
  y: -30,
  width: 30,
  height: 10,
  speed: 3
};

let score = 0;
let gameRunning = false;

function drawCatcher() {
  ctx.save();
  ctx.translate(catcher.x + catcher.width / 2, catcher.y + catcher.height / 2);
  
  // Left blade
  ctx.rotate(-0.4);
  ctx.fillStyle = "#ccc";
  ctx.fillRect(-catcher.width / 2, -catcher.height / 2, catcher.width, catcher.height);

  // Right blade
  ctx.rotate(0.8);
  ctx.fillStyle = "#ccc";
  ctx.fillRect(-catcher.width / 2, -catcher.height / 2, catcher.width, catcher.height);

  ctx.restore();

  // Circle joint
  ctx.beginPath();
  ctx.arc(catcher.x + catcher.width / 2, catcher.y + catcher.height / 2, 6, 0, Math.PI * 2);
  ctx.fillStyle = "#888";
  ctx.fill();
}

function drawCigarette() {
  // Main body (white)
  ctx.fillStyle = "#fff";
  ctx.fillRect(cigarette.x, cigarette.y, cigarette.width - 5, cigarette.height);

  // Filter (orange)
  ctx.fillStyle = "#e38b29";
  ctx.fillRect(cigarette.x + cigarette.width - 5, cigarette.y, 5, cigarette.height);

  // Tip (gray)
  ctx.fillStyle = "#999";
  ctx.fillRect(cigarette.x, cigarette.y, 3, cigarette.height);
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, gameWidth, gameHeight);

  cigarette.y += cigarette.speed;

  if (
    cigarette.y + cigarette.height >= catcher.y &&
    cigarette.x + cigarette.width >= catcher.x &&
    cigarette.x <= catcher.x + catcher.width
  ) {
    score++;
    cigarette.y = -30;
    cigarette.x = Math.random() * (gameWidth - cigarette.width);
    cigarette.speed += 0.2;
  }

  if (cigarette.y > gameHeight) {
    gameRunning = false;
    document.getElementById("restartContainer").style.display = "block";
    return;
  }

  drawCatcher();
  drawCigarette();
  drawScore();

  requestAnimationFrame(update);
}

function startGame() {
  document.getElementById("startContainer").style.display = "none";
  canvas.style.display = "block";
  score = 0;
  cigarette.y = -30;
  cigarette.speed = 3;
  gameRunning = true;
  update();
}

// Mouse movement
canvas.addEventListener("mousemove", function (e) {
  let rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  catcher.x = mouseX - catcher.width / 2;
  catcher.x = Math.max(0, Math.min(catcher.x, gameWidth - catcher.width));
});

// Touch movement
canvas.addEventListener("touchmove", function (e) {
  e.preventDefault();
  let touch = e.touches[0];
  let rect = canvas.getBoundingClientRect();
  let touchX = touch.clientX - rect.left;
  catcher.x = touchX - catcher.width / 2;
  catcher.x = Math.max(0, Math.min(catcher.x, gameWidth - catcher.width));
}, { passive: false });

