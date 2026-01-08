const jumpSound = document.getElementById('jump-sound');
const playerElement = document.querySelector('.player');
const obstacleElement = document.querySelector('.obstacle');
const scoreElement = document.querySelector('.score-card .score');
const highScoreElement = document.querySelector('.score-card .high-score');
const restartGameElement = document.querySelector('.restart-game');
const gameContainerElement = document.querySelector('.game-container');

const OBSTACLE_SIZES = ['xs','s','m','l'];

let jumping = false;
let isGameOver = false;


function addJumpListener() {
    document.addEventListener('keydown', event => {
        if(event.key === ' ' || event.key === 'ArrowUp') jump();
    });
}

function jump() {
    if (jumping || isGameOver) return;

    jumpSound.currentTime = 1;
    jumpSound.play();

    jumping = true;
    playerElement.classList.add('jump');

    setTimeout(() => {
        playerElement.classList.remove('jump');
        jumping = false;
    }, 1200);
}


let collisionInterval;
function monitorCollision() {
    collisionInterval = setInterval(() => {
        if (isCollision()) {
            checkForHighScore();
            stopGame();
        }
    }, 10);
}

const LEFT_BUFFER = 50;
function isCollision() {
    const player = playerElement.getBoundingClientRect();
    const obstacle = obstacleElement.getBoundingClientRect();

    const xHit = (obstacle.right - LEFT_BUFFER) > player.left && obstacle.left < player.right;
    const yHit = player.bottom > obstacle.top;

    return xHit && yHit;
}


let score = 0;
function setScore(newScore) {
    scoreElement.innerHTML = score = newScore;
}

let scoreInterval;
function countScore() {
    scoreInterval = setInterval(() => setScore(score + 1), 100);
}

let highscore = localStorage.getItem('highscore') || 0;
function setHighScore(newScore) {
    highScoreElement.innerText = highscore = newScore;
    localStorage.setItem('highscore', newScore);
}

function checkForHighScore() {
    if (score > highscore) setHighScore(score);
}


let changeObstacleInterval;
function randomiseObstacle() {
    changeObstacleInterval = setInterval(() => {
        const size = OBSTACLE_SIZES[Math.floor(Math.random() * OBSTACLE_SIZES.length)];
        obstacleElement.className = `obstacle obstacle-${size}`;
    }, 3000);
}


function stopGame() {
    clearInterval(collisionInterval);
    clearInterval(scoreInterval);
    clearInterval(changeObstacleInterval);

    isGameOver = true;

    jumpSound.pause();
    jumpSound.currentTime = 0;

    restartGameElement.classList.add('show');
    gameContainerElement.classList.add('stop');
}


function addRestartListener() {
    document.addEventListener('keydown', event => {
        if (event.key === ' ' && isGameOver) restart();
    });
}

function restart() {
    location.reload();
}


function main() {
    addJumpListener();
    monitorCollision();
    countScore();
    randomiseObstacle();
    setHighScore(highscore);
    addRestartListener();
}

main();
