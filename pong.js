// Global canvas and context
let cnv, ctx;

// SETTINGS

const AI_SPEED = 8;

// Field size
let fieldWidth = 800, fieldHeight = 600;

// Initial actors parameters
let playerY = window.innerHeight/2, aiY = window.innerHeight/2;
let ballX = window.innerWidth/2, ballY = window.innerHeight/2;
let ballSpeedX = 10, ballSpeedY = 5;

const RACKET_HEIGHT = 100, RACKET_WIDTH = 20, RACKET_GAP = RACKET_HEIGHT/4;
const BALL_SIZE = 20;

let playerScore = 0, aiScore = 0;

// Sounds
let bounceWall, bounceRacket, score;


// Starts everything after loading
window.onload = function() {
    canvas = document.getElementById('pong');
    ctx = canvas.getContext('2d');

    let fps = 60;

    // Sound handler
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }
    } 

    // Assign sounds
    bounceWall = new sound('./sounds/bounceWall.wav');
    bounceRacket = new sound('./sounds/bounceRacket.wav');
    score = new sound('./sounds/score.wav');

    // Game loop
    setInterval(function() {
            moveBall();
            aiMove();
            redraw();
        }, 1000/fps
    );

    // Sets player racket position depending on mouse
    canvas.addEventListener('mousemove',
        function(e) {
            let mousePos = getMousePosition(e);
            if (mousePos >= canvas.height/2 - fieldHeight/2 && mousePos <= canvas.height/2 - fieldHeight/2 + fieldHeight){
                playerY = mousePos;
            }
        }
    );
}

// Redraws screen
function redraw() {
    // Set canvas width and height
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Draw field
    drawRect(canvas.width/2-fieldWidth/2, canvas.height/2-fieldHeight/2, fieldWidth, fieldHeight, 'black');
    // Drap player racket
    drawRect(canvas.width/2 - fieldWidth/2, playerY - RACKET_HEIGHT/2, RACKET_WIDTH, RACKET_HEIGHT, 'white');
    // Draw AI racket
    drawRect(canvas.width/2 + fieldWidth/2 - RACKET_WIDTH, aiY - RACKET_HEIGHT/2, RACKET_WIDTH, RACKET_HEIGHT, 'white');
    // Draw ball
    drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, 'white');

    // Draw scores
    ctx.textAlign = "center";
    ctx.font = "30px 'Press Start 2P'";
    ctx.fillText(playerScore, canvas.width/2 - fieldWidth/2 + 200, canvas.height/2 - fieldHeight/2 + 50);
    ctx.fillText(aiScore, canvas.width/2 + fieldWidth/2 - 200, canvas.height/2 - fieldHeight/2 + 50);

    // Draw dashed line
    let dashedWidth = 8;
    for (let i = 0; i < fieldHeight; i += 40) {
        drawRect(canvas.width/2 - dashedWidth/2, canvas.height/2 - fieldHeight/2 + i + 10, dashedWidth, 20, 'white');
    }
}

// Wraps fillStyle and fillRect for drawing rectangles
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Gets vertical mouse position within the canvas
function getMousePosition(e) {
    let canv = canvas.getBoundingClientRect();
    let root = document.documentElement;
    return e.clientY - canv.top - root.scrollTop;
}

function resetBall() {
    ballSpeedX *= -1;
    ballSpeedY 
    ballX = canvas.width/2 - BALL_SIZE/2;
    ballY = canvas.height/2 - BALL_SIZE/2;
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Handling player side
    if (ballX <= canvas.width/2 - fieldWidth/2) {
        if (ballY + BALL_SIZE/2 > playerY - RACKET_HEIGHT/2 && ballY + BALL_SIZE/2 < playerY + RACKET_HEIGHT/2) {
            bounceRacket.play();
            ballSpeedX *= -1;
            ballSpeedY = (ballY - playerY) * 0.2;
        } else {
            score.play();
            aiScore++;
            resetBall();
        }
    }

    // Handling AI side
    if (ballX >= canvas.width/2 + fieldWidth/2 - BALL_SIZE) {
        if (ballY + BALL_SIZE/2 > aiY - RACKET_HEIGHT/2 && ballY + BALL_SIZE/2 < aiY + RACKET_HEIGHT/2)
        {
            bounceRacket.play();
            ballSpeedX *= -1;
            ballSpeedY = (ballY - aiY) * 0.2;
        } else {
            score.play();
            playerScore++;
            resetBall();
        }
    }

    // Handling vertical bounds
    if (ballY <= canvas.height/2 - fieldHeight/2 || ballY >= canvas.height/2 + fieldHeight/2 - BALL_SIZE) {
        bounceWall.play();
        ballSpeedY *= -1;
    }
}

function aiMove() {
    if (aiY < ballY - RACKET_GAP) {
        aiY += AI_SPEED;
    } else if (aiY > ballY + RACKET_GAP) {
        aiY -= AI_SPEED;
    }
}