// skript.js

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mode = 'summer'; // Default mode
let parkourLevel = 1;
let gameTime = 0;

const backgrounds = {
    winter: 'lightblue',
    autumn: 'orange',
    summer: 'skyblue'
};

function drawBackground() {
    ctx.fillStyle = backgrounds[mode];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrass();
    drawClouds();
    if (mode === 'winter') {
        drawSnow();
    } else if (mode === 'autumn') {
        drawRain();
    } else if (mode === 'summer') {
        drawSun();
    }
    drawParkour();
}

function drawGrass() {
    ctx.fillStyle = '#2d7a2d';
    const grassHeight = 80;
    ctx.fillRect(0, canvas.height - grassHeight, canvas.width, grassHeight);
    
    // Add grass texture
    ctx.fillStyle = '#3d9d3d';
    for (let i = 0; i < canvas.width; i += 10) {
        const random = Math.sin(i * 0.01 + gameTime * 0.05) * 3;
        ctx.fillRect(i, canvas.height - grassHeight + random, 8, 20);
    }
}

function drawClouds() {
    // Simple cloud drawing logic
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(100, 100, 30, 0, Math.PI * 2);
    ctx.arc(130, 100, 30, 0, Math.PI * 2);
    ctx.arc(115, 80, 30, 0, Math.PI * 2);
    ctx.fill();
}

function drawSnow() {
    // Snow drawing logic
    ctx.fillStyle = 'white';
    for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawRain() {
    // Rain drawing logic
    ctx.strokeStyle = 'blue';
    for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height + 10);
        ctx.stroke();
    }
}

function drawSun() {
    // Sun drawing logic
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(200, 100, 50, 0, Math.PI * 2);
    ctx.fill();
}

function drawParkour() {
    const grassHeight = 80;
    const groundY = canvas.height - grassHeight;
    
    // Увеличиваем количество платформ с уровнем
    const platformCount = 3 + Math.floor(parkourLevel / 2);
    const platformSpacing = canvas.width / (platformCount + 1);
    
    ctx.fillStyle = '#8B4513';
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    
    for (let i = 1; i <= platformCount; i++) {
        const x = platformSpacing * i;
        
        // Платформы растут выше с каждым уровнем
        const height = 20 + (parkourLevel * 5);
        const width = 80 + (parkourLevel * 10);
        const y = groundY - (50 + (parkourLevel * 15));
        
        // Рисуем платформу
        ctx.fillRect(x - width / 2, y, width, height);
        ctx.strokeRect(x - width / 2, y, width, height);
        
        // Добавляем эффект роста/пульсации
        const pulse = Math.sin(gameTime * 0.05 + i) * 2;
        ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
        ctx.fillRect(x - width / 2, y - pulse, width, pulse + 3);
        ctx.fillStyle = '#8B4513';
    }
    
    // Рисуем финишную линию
    const finishX = canvas.width - platformSpacing / 2;
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(finishX - 40, groundY - 100, 80, 100);
    
    ctx.fillStyle = '#FFA500';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('FINISH', finishX - 35, groundY - 40);
}

function increaseParkourLevel() {
    parkourLevel++;
}

function changeMode(newMode) {
    mode = newMode;
    drawBackground();
}

function animate() {
    gameTime++;
    drawBackground();
    requestAnimationFrame(animate);
}

document.addEventListener('keydown', (event) => {
    if (event.key === '1') changeMode('winter');
    else if (event.key === '2') changeMode('autumn');
    else if (event.key === '3') changeMode('summer');
    else if (event.key === ' ') {
        increaseParkourLevel();
    }
});

animate();