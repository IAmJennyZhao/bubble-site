
var myBubbles = [];
var myScore;
const BUBBLE_IMAGE = new Image();
const COLORS = [
    "rgba(223, 255, 253, 0.6)",     // blue
    "rgba(255, 224, 244, 0.6)",     // pink
    "rgba(235, 222, 255, 0.6)",     // purple
    "rgba(255, 246, 230, 0.6)"      // yellow
]
const BACKGROUND_IMAGE = new Image();

// TODO: Add sfx and background music
// TODO: Add in sprite blowing bubbles from bottom right 

function startGame() {
    myScore = new ScoreComponent("30px", "Consolas", "black", 280, 40);
    myGameArea.start();
    BUBBLE_IMAGE.src = "assets/pink_bubble_large.png";
    BACKGROUND_IMAGE.src = "assets/background.png";
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.canvas.addEventListener('click', mouseClick);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(BACKGROUND_IMAGE, 0, 0, this.canvas.width, this.canvas.height);
    }
}

class ScoreComponent {
    constructor(fontSize, font, color, x, y) {
        this.fontSize = fontSize;
        this.font = font;
        this.color = color;
        this.x = x;
        this.y = y;
        this.score = 0;
    }

    addScore(deltaScore) {
        this.score += deltaScore
    }

    update() {
        // redraws the score component onto the game area 
        var ctx = myGameArea.context;
        ctx.font = this.fontSize + " " + this.font;
        ctx.fillStyle = this.color;
        ctx.fillText("SCORE: " + this.score, this.x, this.y);
    }
}

class BubbleComponent {
    constructor(radius, color, x, y, speedX, speedY) {
        this.radius = radius;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    update() {
        // update bubble location
        this.x += this.speedX;
        this.y += this.speedY;

        // redraws the bubble component onto the game area 
        var ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        // draw bubble png overlay  
        ctx.drawImage(BUBBLE_IMAGE, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
    }

    crashWith(click_x, click_y) {
        // Check bubble crash
        const crashDelta = 5;
        var dx = this.x - click_x;
        var dy = this.y - click_y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= this.radius + crashDelta) {
            return true;
        }
        return false;
    };

    isOutOfBounds() {
        // Check bubble out of bounds
        const boundsDelta = this.radius + 5;
        if (this.x < -boundsDelta || this.x > myGameArea.canvas.width + boundsDelta) {
            return true;
        } else if (this.y < -boundsDelta || this.y > myGameArea.canvas.height + boundsDelta) {
            return true;
        }
        return false;
    }
}

function generateValue(min, max) {
    return Math.random() * (max - min) + min;
}

function updateGameArea() {
    var radius, x, y, speed, directionAngle, speedX, speedY, color;
    // Clear game area 
    myGameArea.clear();
    myGameArea.frameNo += 1;

    if (myGameArea.frameNo == 1 || (myGameArea.frameNo % 100) == 0) {
        color = COLORS[Math.random() * COLORS.length | 0];
        // Create new bubble location
        x = generateValue(myGameArea.canvas.width * 0.2, myGameArea.canvas.width * 0.8);
        y = generateValue(myGameArea.canvas.height * 0.2, myGameArea.canvas.height * 0.8);

        // Generate direction and speed of new bubble
        speed = generateValue(0.5, 2);
        directionAngle = generateValue(0, 360);
        radius = generateValue(10, 30);
        speedX = speed * Math.cos(directionAngle * Math.PI / 180);
        speedY = speed * Math.sin(directionAngle * Math.PI / 180);

        myBubbles.push(new BubbleComponent(radius, color, x, y, speedX, speedY));
    }
    // redraw all bubbles and other UI in game area
    for (i = 0; i < myBubbles.length; i += 1) {
        // remove bubble if outside of game area
        if (myBubbles[i].isOutOfBounds()) {
            myBubbles.splice(i, 1);
            myScore.addScore(-10);
            i--;
            continue;
        }
        myBubbles[i].update();
    }
    myScore.update();
}

function mouseClick(event) {
    // get mouse location
    var x, y;
    x = event.clientX;
    y = event.clientY;

    // Check if mouse clicked on any bubbles 
    for (i = 0; i < myBubbles.length; i += 1) {
        if (myBubbles[i].crashWith(x, y)) {
            myBubbles.splice(i, 1);
            myScore.addScore(100);
            return;
        }
    }
}