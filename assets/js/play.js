let allLoaded = false;
let countLoaded = 0;
let checkLoaded = () => {
  countLoaded++;
  if (countLoaded === 2) {
    allLoaded = true;
    clearID = setInterval(updateLogger, 950);
  }
};

// Image Array
let letterArray = [
  "thu_moi_01_thay_Tran_Duy_Phong.jpg",
  "thu_moi_02_thay_Tran_Van_Nam.jpg",
  "thu_moi_03_thay_Vu_Chi_Thanh.jpg",
  "thu_moi_04_thay_Nguyen_Thanh_Nam.jpg",
  "thu_moi_05_thay_Hoang_Van_Loi.jpg",
  "thu_moi_06_chi_Kim_Phuong.jpg",
  "thu_moi_07_thay_Tran_Ly_Anh_Tuan.jpg",
  "thu_moi_08_thay_Phuoc_Cuong.jpg",
  "thu_moi_09_co_Thu_Hang.jpg",
  "thu_moi_10_Thay_Tran_Minh_Hung.jpg",
  "thu_moi_11_Thay_Nguyen_Khanh.jpg",
  "thu_moi_12_thay_Dinh_An.jpg",
  "thu_moi_13_thay_Than_Hoang_Loc.jpg",
  "thu_moi_14_thay_Hoang_Anh.jpg",
  "thu_moi_15_co_Tran_Thi_Huong.jpg",
  "thu_moi_16_Chi_Huynh_Thanh.jpg",
  "thu_moi_17_chi_Y_Van.jpg",
];

let currentURL = window.location.href;
let url = new URL(currentURL);
let id = url.searchParams.get("id");
id = Number(id);
if (!id) id = 0;
let letterImg;

// Ready
let startCount = false;
let count = 0;
let logger = ["Tap để bắt đầu", "3", "2", "1", ""];
let start = false;
let loggerContainer;
let welcomeContainer;
let clearID;

// Letter
let letterContainer;
let letterTitle;
let letterOpenBtn;
let letterContent;
let letterScore;
let resetGame;

function letterAction() {
  // Get title
  letterTitle = document.querySelector('.letter-title');
  // Show Letter
  markContainer.style.display = "none";
  letterContainer = document.querySelector(".letter");
  if (gift.isPassed) {
    letterTitle.innerHTML = 'CHIẾN THẮNG';
    letterContainer.classList.add("full");
  }
  else {
    letterTitle.innerHTML = 'GAME OVER';
    letterContainer.classList.add("nogift");
  } 
  letterScore = document.querySelector("#score");
  letterScore.innerHTML = score;
  // Show Content
  if (gift.isPassed) {
    letterOpenBtn = document.querySelector(".letter-open");
    letterOpenBtn.addEventListener("click", () => {
      letterContent = document.querySelector(".leter-content");
      letterContent.classList.add("active");
      // Ẩn thư
      letterContent.addEventListener("click", () => {
        letterContent.classList.remove("active");
      });
    });
  }

  // Reset Game

  resetGame = document.querySelector(".reset-game");
  resetGame.addEventListener("click", () => {
    document.querySelector(
      ".letter-btn"
    ).innerHTML = `<p class="letter-loading">Vui lòng chờ...</p>`;
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });
}

function updateLogger() {
  loggerContainer.innerHTML = logger[count];
  const handelClick = () => {
    startCount = true;
  };
  welcomeContainer.addEventListener("click", handelClick);
  if (startCount) {
    welcomeContainer.removeEventListener("click", handelClick);
    count++;
  }
  if (count >= logger.length) {
    clearInterval(clearID);
    welcomeContainer.classList.add("hidden");
    start = true;
    startGame();
  }
}

//board
let board;
let boardWidth = 460;
let boardHeight = 850;
let context;

//bird
let birdWidth = 54;
let birdHeight = 44;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
let pipeArray = [];
let pipeWidth = 68;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Gift
let giftWidth = 54;
let giftHeight = 44;
let giftX = boardWidth * 3;
let giftY = boardHeight * 0.4;
let giftImg;
let giftCount = 0;
let giftPass = false;

let gift = {
  x: giftX,
  y: giftY,
  width: giftWidth,
  height: giftHeight,
  isPassed: false,
};

// Mark
let markContainer;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.35;
let timer = 2500;
let gameOver = false;
let score = 0;

window.onload = function () {
  // Load Letter
  letterImg = document.querySelector("#letter-img");
  let letterImage = new Image();
  letterImage.src = `../assets/img/${letterArray[id]}`;
  letterImage.onload = () => {
    checkLoaded();
    letterImg.src = letterImage.src;
  };

  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //Load Image
  birdImg = new Image();
  birdImg.src = "./assets/img/bird.png";
  birdImg.onload = function () {
    checkLoaded();
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  // Load Gift
  giftImg = new Image();
  giftImg.src = "./assets/img/gift.png";

  // Load Pipe
  topPipeImg = new Image();
  topPipeImg.src = "./assets/img/pipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./assets/img/pipe.png";

  // Ready
  loggerContainer = document.querySelector("#welcome-log");
  welcomeContainer = document.querySelector(".welcome");

  // Mark
  markContainer = document.querySelector("#mark");
};

function startGame() {
  requestAnimationFrame(update);
  setInterval(placePipes, timer);
  board.addEventListener("click", (e) => {
    e.preventDefault();
    moveBird();
  });
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    letterAction();
    return;
  }
  if (start) {
    // Kiểm tra nếu start đã bằng true
    context.clearRect(0, 0, board.width, board.height);
  }

  // Gift
  // Đã đụng trúng
  gift.x -= 2;
  if (gift.isPassed === true) {
    gift.x += 4;
    gift.y -= 4;
  } else if (gift.isPassed === false && gift.x < 0) {
    gift.x = boardWidth * 1.5;
    gift.isPassed = false;
  }
  if (detectCollision(bird, gift)) {
    gift.isPassed = true;
    setTimeout(() => {
      gameOver = true;
    }, 1000);
  }
  context.drawImage(giftImg, gift.x, gift.y, gift.width, gift.height);

  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  //bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y >= board.height) {
    gameOver = true;
  }

  //score
  markContainer.innerHTML = score;
}

function placePipes() {
  if (gameOver) {
    return;
  }

  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 2.7;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird() {
  velocityY = -6;
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
