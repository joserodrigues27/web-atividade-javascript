const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");

const buttonPlay = document.querySelector(".btn-play");
const buttonUp = document.querySelector(".btn-up");
const buttonLeft = document.querySelector(".btn-left");
const buttonRight = document.querySelector(".btn-right");
const buttonDown = document.querySelector(".btn-down");

const size = 20;
const initialPosition = { x: 40, y: 40 };
let snake = [initialPosition];
let foodX, foodY;
let collision = false; // verificar se o jogo acabou
var playerName;
let direction = "right";
let loopId;
let lastKeyPressTime = 0;
let lastButtonPressTime = 0;
const delay = 175;

function incrementScore() {
    score.innerText = +score.innerText + 10;
};

function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min );
};

function randomPosition() {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 20) * 20;
};

function firstFood() {
    foodX = randomPosition();
    foodY = randomPosition();
    while(foodX == initialPosition.x && foodY == initialPosition.y) {
        foodX = randomPosition();
        foodY = randomPosition();
    }
};

function drawFood() {
    ctx.shadowColor = "crimson";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "crimson";
    ctx.fillRect(foodX, foodY, size, size);
    ctx.strokeStyle = "black";
    ctx.strokeRect(foodX, foodY, size, size);
    ctx.shadowBlur = 0;
};

function drawSnake() {
    ctx.fillStyle = "forestgreen";
    ctx.strokeStyle = "black";
    
    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "darkgreen";
        }

        ctx.fillRect(position.x, position.y, size, size);
        ctx.strokeRect(position.x, position.y, size, size);
    })
};

function moveSnake() {
    if (!direction) return;

    const head = snake[snake.length - 1];

    switch (true) {
        case (direction == "right"):
            snake.push({ x: head.x + size, y: head.y });
            break;
        case (direction == "left"):
            snake.push({ x: head.x - size, y: head.y });
            break;
        case (direction == "down"):
            snake.push({ x: head.x, y: head.y + size });
            break;
        case (direction == "up"):
            snake.push({ x: head.x, y: head.y - size });
            break;
    }

    snake.shift();
};

function drawGrid() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "lightcyan";

    for (let i = 20; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
};

function checkEat() {
    const head = snake[snake.length - 1];

    if (head.x == foodX && head.y == foodY) {
        incrementScore();
        snake.push(head);
        
        while (snake.find((position) => position.x == foodX && position.y == foodY)) {
            foodX = randomPosition();
            foodY = randomPosition();
        }
    }
};

function checkCollision() {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;
    })

    if (wallCollision || selfCollision) {
        collision = true;
        gameOver();
    }
};

function gameOver() {
    direction = undefined;
    menu.style.display = "flex";
    finalScore.innerText = playerName + " - "+ score.innerText;
    canvas.style.filter = "blur(2px)";
};

function gameLoop() {
    clearInterval(loopId);

    ctx.clearRect(0, 0, 600, 600);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop();
    }, 175);
};

firstFood();
gameLoop();

window.addEventListener("load", () => {
    playerName = prompt("Digite seu nome:");
    if (playerName) {
        alert("Olá " + playerName + "!");
    } else {
        playerName = "Desconhecido";
        alert("Nome: " + playerName);
    }
});

buttonPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";
    collision = false;
    direction = "right";
    firstFood();
    snake = [initialPosition];
});

buttonUp.addEventListener("click", () => {
    if (collision) {
        return;
    }
    const currentTime = new Date().getTime();
    if (currentTime - lastButtonPressTime >= delay) {
        if (direction != "down") {
            direction = "up";
        }
    }
    lastButtonPressTime = currentTime;
});

buttonLeft.addEventListener("click", () => {
    if (collision) {
        return;
    }
    const currentTime = new Date().getTime();
    if (currentTime - lastButtonPressTime >= delay) {
        if (direction != "right") {
            direction = "left";
        }
    }
    lastButtonPressTime = currentTime;
});

buttonRight.addEventListener("click", () => {
    if (collision) {
        return;
    }
    const currentTime = new Date().getTime();
    if (currentTime - lastButtonPressTime >= delay) {
        if (direction != "left") {
            direction = "right";
        }
    }
    lastButtonPressTime = currentTime;
});

buttonDown.addEventListener("click", () => {
    if (collision) {
        return;
    }
    const currentTime = new Date().getTime();
    if (currentTime - lastButtonPressTime >= delay) {
        if (direction != "up") {
            direction = "down";
        }
    }
    lastButtonPressTime = currentTime;
});


document.addEventListener("keydown", ({ key }) => {
    if (collision) {
        return;
    }
    const currentTime = new Date().getTime();
    if (currentTime - lastKeyPressTime >= delay) {
        switch (true) {
            case (key == "ArrowRight" && direction != "left"):
                direction = "right";
                break;
            case (key == "ArrowLeft" && direction != "right"):
                direction = "left";
                break;
            case (key == "ArrowDown" && direction != "up"):
                direction = "down";
                break;
            case (key == "ArrowUp" && direction != "down"):
                direction = "up";
                break;
        }
    }
    lastKeyPressTime = currentTime;
});
