let cvs = document.getElementById("canvas");

let ctx = cvs.getContext("2d");

const canvasWidth = cvs.width;
const canvasHeight = cvs.height;

let birdImg;
let birdWidth = 34;
let birdHeight = 24;
let birdX = canvasWidth / 8;
let birdY = canvasHeight / 2;
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

let pipes = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = canvasWidth;
let pipeY = 0;
// let pipeGap = pipeHeight / 4;

let topPipeImg;
let bottomPipeImg;

let score = 0;
let gameOver = false;

window.onload = function () {
  birdImg = new Image();
  birdImg.src = "img/flappybird.png";

  birdImg.onload = function () {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "img/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "img/bottompipe.png";

  console.log("Cw:", cvs.width, cvs.clientWidth);
  console.log("Ch:", cvs.height, cvs.clientHeight);

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);

  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > canvasHeight) {
    gameOver = true;
  }

  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];

    pipe.x += velocityX;

    ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }
  while (pipes.length > 0 && pipes[0].x < -pipeWidth) {
    pipes.shift();
  }

  ctx.fillStyle = "white";
  ctx.font = "45px sans-serif";
  ctx.fillText(score, 5, 45);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "45px sans-serif";
    ctx.fillText("GAME OVER", 55, 200);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }

  let randomY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);

  let openingSpace = cvs.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipes.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipes.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp") {
    velocityY = -6;

    if (gameOver) {
      bird.y = birdY;
      pipes = [];
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
