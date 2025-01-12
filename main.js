
var myBubbles = [];
var myScore;

// TODO: Create one circle
// TODO: Pop circle on click 

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
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
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
        else {
            // create rectangle
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } 
    }
}

function updateGameArea() {
    var radius, x, minX, maxX, y, minY, maxY;
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        minX = myGameArea.canvas.width*0.2;
        maxX = myGameArea.canvas.width*0.8;
        x = Math.floor(Math.random()*(maxX-minX+1)+minX);

        minY = myGameArea.canvas.height*0.2;
        maxY = myGameArea.canvas.height*0.8;
        y = Math.floor(Math.random()*(maxY-minY+1)+minY);

        radius = Math.floor(10+20*Math.random());
        
        myBubbles.push(new component(radius, radius, "green", x, y, "bubble"));
    }
    for (i = 0; i < myBubbles.length; i += 1) {
        myBubbles[i].x += -1;
        myBubbles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}