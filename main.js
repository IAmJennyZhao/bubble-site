
var myBubbles = [];
var myScore;

// TODO: Remove circle once out of bounds
// TODO: Change accelereation
// TODO: Change bubble appearance
// TODO: Add sfx and background music
// TODO: Add in sprite blowing bubbles from bottom right 

function startGame() {
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.canvas.addEventListener('click', mouseClick);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class scoreComponent {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.score = 0;
    }

    addScore(deltaScore) {
        this.score += deltaScore
    }

    update() {
        ctx = myGameArea.context;
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = this.color;
        ctx.fillText("SCORE: "+this.text, this.x, this.y);
    }
}

class BubbleComponent {
    constructor(width, height, color, x, y, type, speedX, speedY) {
        this.type = type;
        this.score = 0;
        this.width = width;
        this.height = height;
        this.speedX = speedX;
        this.speedY = speedY;
        this.x = x;
        this.y = y;
        this.update = function () {
            ctx = myGameArea.context;
            if (this.type == "text") {
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.fillText(this.text, this.x, this.y);
            } else if (this.type == "bubble") {
                // create bubble
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
            }
        };
        const crashDelta = 5;
        this.crashWith = function (click_x, click_y) {
            // Check bubble crash
            var dx = this.x - click_x;
            var dy = this.y - click_y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= this.width + crashDelta) {
                return true;
            }
            return false;
        };
    }
}

function generateValue(min, max) {
    return Math.ceil(Math.random()*(max-min)+min);
}

function updateGameArea() {
    var radius, x, y, speed, directionAngle, speedX, speedY;
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = generateValue(myGameArea.canvas.width*0.2, myGameArea.canvas.width*0.8);
        y = generateValue(myGameArea.canvas.height*0.2, myGameArea.canvas.height*0.8);
        speed = generateValue(0.5, 5);
        directionAngle = generateValue(0, 360);
        radius = generateValue(10, 30);
        
        myBubbles.push(new component(radius, radius, "green", x, y, "bubble"));
    }
    for (i = 0; i < myBubbles.length; i += 1) {
        myBubbles[i].x += -1*myBubbles[i].speedX;
        myBubbles[i].y += -1*myBubbles[i].speedY;
        myBubbles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function mouseClick(event) {
    var x, y;
    x = event.clientX;
    y = event.clientY;
    
    // Check if mouse clicked on any bubbles 
    for (i = 0; i < myBubbles.length; i += 1) {
        if (myBubbles[i].crashWith(x, y)) {
            myBubbles.splice(i, 1);
            return;
        }
    }
}