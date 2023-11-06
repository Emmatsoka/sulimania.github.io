

const mapWidth = 360;
const mapHeight = 170;

const cellSize = 5;
let cameraX = 0;
let cameraY = 0;
const cameraSpeed = 10;
const mapData = [];
for (let y = 0; y < mapHeight; y++) {
    const row = [];
    for (let x = 0; x < mapWidth; x++) {
        row.push(0);
    }
    mapData.push(row);
}

let characterX = 60;
let characterY = 140;
let characterName = prompt('Karakter neve:');
if (!characterName) {
    characterName = "Névtelen";
}

let npcName = "Bella"; 
let npcMessage = "Még béta verzó, de tessék itt egy pont."; 

const backgroundImage = new Image();
backgroundImage.src = 'https://i.pinimg.com/736x/26/89/31/26893157306063ef603d1be0c0753596.jpg';

backgroundImage.onload = function() {
    canvas.style.backgroundImage = `url('${backgroundImage.src}')`;
    canvas.style.backgroundSize = 'cover';
    canvas.style.backgroundRepeat = 'no-repeat';
};

const spriteWidth = 64;
const spriteHeight = 64;
const totalFrames = 9;
let currentFrame = 0;
let frameCount = 10;
let animationDirection = 'down';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const fullscreenButton = document.createElement('button');
fullscreenButton.textContent = 'Teljes képernyő';
fullscreenButton.style.position = 'absolute';
fullscreenButton.style.top = '20px';
fullscreenButton.style.right = '20px';
canvas.parentNode.appendChild(fullscreenButton);

fullscreenButton.addEventListener('click', () => {
    launchFullScreen(canvas);
});

function launchFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

const characterImage = new Image();
characterImage.src = './kepek/karakter/karakter.png';

characterImage.onload = function() {
    gameLoop();
};

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

const characterSpeed = 25;

let lastMoveTime = 0;

function update() {
    const now = Date.now();
    const deltaTime = now - lastMoveTime;

    if (deltaTime >= 1000 / characterSpeed) {
        let deltaX = 0;
        let deltaY = 0;
        let isIdle = true;

        if (keys[37]) {
            deltaX = -1;
            animationDirection = 'left';
            isIdle = false;
        } else if (keys[39]) {
            deltaX = 1;
            animationDirection = 'right';
            isIdle = false;
        } else if (keys[38]) {
            deltaY = -1;
            animationDirection = 'up';
            isIdle = false;
        } else if (keys[40]) {
            deltaY = 1;
            animationDirection = 'down';
            isIdle = false;
        }

        if (!isIdle) {
            const newX = characterX + deltaX;
            const newY = characterY + deltaY;

            if (newX >= 0 && newX < mapWidth) {
                characterX = newX;
            }

            if (newY >= 0 && newY < mapHeight) {
                characterY = newY;
            }
            lastMoveTime = now;
        }
    }

    const characterScreenX = characterX * cellSize;
    const characterScreenY = characterY * cellSize;

    if (characterScreenX - cameraX < cellSize * 2) {
        cameraX -= cameraSpeed;
    } else if (characterScreenX - cameraX > canvas.width - cellSize * 3) {
        cameraX += cameraSpeed;
    }

    if (characterScreenY - cameraY < cellSize * 2) {
        cameraY -= cameraSpeed;
    } else if (characterScreenY - cameraY > canvas.height - cellSize * 3) {
        cameraY += cameraSpeed;
    }

    frameCount++;
    if (frameCount >= 10) {
        frameCount = 0;
        currentFrame = (currentFrame + 1) % totalFrames;
    }
}

let messageVisible = false;

canvas.addEventListener('click', function(event) {
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;

    if (
        clickX >= npc.x - cameraX &&
        clickX <= npc.x - cameraX + npc.width &&
        clickY >= npc.y - cameraY &&
        clickY <= npc.y - cameraY + npc.height
    ) {
        messageVisible = !messageVisible;
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const characterScreenX = characterX * cellSize - cameraX;
    const characterScreenY = characterY * cellSize - cameraY;
    ctx.drawImage(
        characterImage,
        currentFrame * spriteWidth,
        getAnimationFrameY(animationDirection),
        spriteWidth,
        spriteHeight,
        characterScreenX,
        characterScreenY,
        spriteWidth,
        spriteHeight
    );

    const npcImage = new Image();
    npcImage.src = './kepek/karakter/npc.png';

    ctx.drawImage(
        npcImage,
        npc.x - cameraX,
        npc.y - cameraY,
        64,
        64
    );

   
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(characterName, characterScreenX + spriteWidth / 2, characterScreenY - 10);

    
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(npcName, (npc.x - cameraX) + 32, (npc.y - cameraY) - 10);


    if (messageVisible) {
     
   
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(npcMessage, npc.x - cameraX + 32, npc.y - cameraY - 40);
        
    }

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Pontszám: ' + score, 20, canvas.height - 20);
    
}

function getAnimationFrameY(direction) {
    if (direction === 'down') {
        return 2 * spriteHeight;
    } else if (direction === 'left') {
        return spriteHeight;
    } else if (direction === 'right') {
        return 3 * spriteHeight;
    } else if (direction === 'up') {
        return 0;
    }
}

const keys = {};

document.addEventListener('keydown', function(event) {
    keys[event.keyCode] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.keyCode] = false;
});

const npc = {
    x: 1200,
    y: 140,
    width: 64,
    height: 64,
};

let score = 0;
canvas.addEventListener('click', function (event) {
    const clickX = event.clientX - canvas.getBoundingClientRect().left + cameraX;
    const clickY = event.clientY - canvas.getBoundingClientRect().top + cameraY;

 
    if (
        clickX >= npc.x &&
        clickX <= npc.x + npc.width &&
        clickY >= npc.y &&
        clickY <= npc.y + npc.height
    ) {
        
        score += 1;
    }
});