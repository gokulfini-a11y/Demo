/**
 * THE SALARYMAN SPRINT
 * A Canvas-less, SVG-based Game Engine
 */

// --- Configuration ---
const CONFIG = {
    gravity: 0.6,
    groundY: 350,
    jumpStrength: -12,
    speedStart: 6,
    speedMax: 15,
    speedIncrement: 0.005,
    spawnRate: 120 // Frames between obstacles
};

// --- Game State ---
let state = {
    isPlaying: false,
    frames: 0,
    score: 0,
    highScore: parseInt(localStorage.getItem('salaryman_highscore')) || 0,
    speed: CONFIG.speedStart,
    player: {
        y: CONFIG.groundY,
        vy: 0,
        isJumping: false,
        isDucking: false,
        width: 40,
        height: 80
    },
    obstacles: [], // Array of obstacle objects
    clouds: []
};

// --- DOM Elements ---
const svgWorld = document.getElementById('world-elements');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const deathReason = document.getElementById('death-reason');

// --- SVG Helpers ---
const SVG_NS = "http://www.w3.org/2000/svg";

function createSVG(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (let k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}

// --- Visual Assets (Generated via JS) ---

// 1. The Salaryman (Player)
const playerGroup = createSVG('g', { id: 'player' });
// Body
playerGroup.appendChild(createSVG('line', { x1: 20, y1: 20, x2: 20, y2: 60, stroke: '#000', 'stroke-width': 4 }));
// Head
playerGroup.appendChild(createSVG('circle', { cx: 20, cy: 10, r: 10, fill: '#fff', stroke: '#000', 'stroke-width': 2 }));
// Legs (Animated later)
const leg1 = createSVG('line', { x1: 20, y1: 60, x2: 10, y2: 80, stroke: '#000', 'stroke-width': 4 });
const leg2 = createSVG('line', { x1: 20, y1: 60, x2: 30, y2: 80, stroke: '#000', 'stroke-width': 4 });
playerGroup.appendChild(leg1);
playerGroup.appendChild(leg2);
// Tie (The funny part)
const tie = createSVG('path', { d: 'M20,25 L25,50 L15,50 Z', fill: 'red' });
playerGroup.appendChild(tie);

svgWorld.appendChild(playerGroup);

// --- Game Loop Functions ---

function initGame() {
    state.isPlaying = true;
    state.score = 0;
    state.speed = CONFIG.speedStart;
    state.frames = 0;
    state.obstacles = [];
    state.clouds = [];
    
    // Reset Player
    state.player.y = CONFIG.groundY;
    state.player.vy = 0;
    state.player.isDucking = false;
    
    // Clear World except player
    while (svgWorld.lastChild && svgWorld.lastChild.id !== 'player') {
        svgWorld.removeChild(svgWorld.lastChild);
    }
    
    // Update High Score Display
    highScoreEl.innerText = state.highScore;
    
    // Start Loop
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!state.isPlaying) return;

    state.frames++;
    state.speed = Math.min(state.speed + CONFIG.speedIncrement, CONFIG.speedMax);
    state.score = Math.floor(state.frames / 10);
    scoreEl.innerText = state.score;

    updatePlayer();
    updateObstacles();
    updateClouds();
    
    requestAnimationFrame(gameLoop);
}

// --- Player Logic ---

function updatePlayer() {
    const p = state.player;
    
    // Gravity
    p.vy += CONFIG.gravity;
    p.y += p.vy;

    // Ground Collision
    if (p.y > CONFIG.groundY) {
        p.y = CONFIG.groundY;
        p.vy = 0;
        p.isJumping = false;
    }

    // Ducking Dimensions
    const currentHeight = p.isDucking ? 40 : 80;
    const renderY = p.y - currentHeight;

    // SVG Transform
    playerGroup.setAttribute('transform', `translate(100, ${renderY})`);

    // Animation: Leg Wiggle
    if (!p.isJumping) {
        const runCycle = Math.sin(state.frames * 0.5) * 10;
        leg1.setAttribute('x2', 20 - runCycle);
        leg2.setAttribute('x2', 20 + runCycle);
    } else {
        // Legs splay when jumping
        leg1.setAttribute('x2', 10);
        leg2.setAttribute('x2', 30);
    }

    // Animation: Tie Flap
    const tieWiggle = Math.sin(state.frames * 0.8) * 5;
    tie.setAttribute('d', `M20,25 L${25 + tieWiggle},${50} L${15 + tieWiggle},${50} Z`);
    
    // Handle Ducking Visuals
    if(p.isDucking) {
        // Squish the body line
        playerGroup.children[0].setAttribute('y1', 40); // Body start lower
        playerGroup.children[1].setAttribute('cy', 35); // Head lower
    } else {
        playerGroup.children[0].setAttribute('y1', 20);
        playerGroup.children[1].setAttribute('cy', 10);
    }
}

// --- Obstacle Logic ---

function createObstacle() {
    const type = Math.random() > 0.6 ? 'AIR' : 'GROUND';
    const id = 'obs_' + Date.now();
    
    let el;
    let width, height, yPos;
    let visualType; 

    if (type === 'GROUND') {
        width = 40; height = 50; yPos = CONFIG.groundY - height;
        visualType = 'PAPERWORK';
        // Draw a stack of papers
        el = createSVG('g', { id: id, transform: `translate(1100, ${yPos})` });
        el.appendChild(createSVG('rect', { width: width, height: height, fill: '#e0e0e0', stroke: '#000' }));
        // Lines of text
        el.appendChild(createSVG('line', { x1:5, y1:10, x2:35, y2:10, stroke:'#999'}));
        el.appendChild(createSVG('line', { x1:5, y1:20, x2:35, y2:20, stroke:'#999'}));
        el.appendChild(createSVG('line', { x1:5, y1:30, x2:35, y2:30, stroke:'#999'}));
    } else {
        width = 50; height = 30; yPos = CONFIG.groundY - 110; // Flying height
        visualType = 'MEETING';
        // Draw an envelope/email icon
        el = createSVG('g', { id: id, transform: `translate(1100, ${yPos})` });
        el.appendChild(createSVG('rect', { width: width, height: height, fill: '#ffeb3b', stroke: '#000' }));
        // Envelope flap
        el.appendChild(createSVG('polyline', { points: `0,0 25,15 50,0`, fill: 'none', stroke: '#000' }));
    }

    svgWorld.appendChild(el);
    state.obstacles.push({ id, el, x: 1100, y: yPos, width, height, type, visualType });
}

function updateObstacles() {
    // Spawn Logic
    if (state.frames % Math.floor(CONFIG.spawnRate / (state.speed/6)) === 0) {
        createObstacle();
    }

    // Move & Collision
    for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.x -= state.speed;
        obs.el.setAttribute('transform', `translate(${obs.x}, ${obs.y})`);

        // Cull off-screen
        if (obs.x < -100) {
            svgWorld.removeChild(obs.el);
            state.obstacles.splice(i, 1);
            continue;
        }

        // Hitbox Collision (AABB)
        // Player hitbox logic
        const pHeight = state.player.isDucking ? 40 : 80;
        const pY = state.player.y - pHeight;
        
        // Player X is fixed at 100 relative to SVG, width 40
        const pLeft = 100;
        const pRight = 140;
        const pTop = pY;
        const pBottom = state.player.y;

        const oLeft = obs.x;
        const oRight = obs.x + obs.width;
        const oTop = obs.y;
        const oBottom = obs.y + obs.height;

        // Visual hitbox padding (forgiving gameplay)
        const padding = 10;

        if (
            pRight - padding > oLeft &&
            pLeft + padding < oRight &&
            pBottom - padding > oTop &&
            pTop + padding < oBottom
        ) {
            gameOver(obs.visualType);
        }
    }
}

// --- Decor (Clouds) ---
function updateClouds() {
    if (Math.random() < 0.01) {
        const y = Math.random() * 200;
        const el = createSVG('circle', { cx: 0, cy: 0, r: 30 + Math.random() * 20, fill: '#fff', opacity: 0.5 });
        const id = 'cloud_' + Date.now();
        const g = createSVG('g', { id: id, transform: `translate(1100, ${y})`});
        g.appendChild(el);
        svgWorld.insertBefore(g, svgWorld.firstChild); // Put behind player
        state.clouds.push({ id, el: g, x: 1100, speed: 1 + Math.random() });
    }

    for (let i = state.clouds.length - 1; i >= 0; i--) {
        const c = state.clouds[i];
        c.x -= c.speed;
        c.el.setAttribute('transform', `translate(${c.x}, 0)`);
        if (c.x < -100) {
            svgWorld.removeChild(c.el);
            state.clouds.splice(i, 1);
        }
    }
}

// --- Input Handling ---

function handleJump() {
    if (state.isPlaying && !state.player.isJumping) {
        state.player.vy = CONFIG.jumpStrength;
        state.player.isJumping = true;
    }
}

function handleDuck(active) {
    if (state.isPlaying) {
        state.player.isDucking = active;
        // Fast fall if ducking in air
        if(active && state.player.isJumping) {
            state.player.vy += 5; 
        }
    }
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (!state.isPlaying && startScreen.classList.contains('hidden') === false) {
            startGame();
        } else {
            handleJump();
        }
    }
    if (e.code === 'ArrowDown') handleDuck(true);
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') handleDuck(false);
});

// Mobile Controls
document.addEventListener('touchstart', (e) => {
    if (!state.isPlaying) return;
    const touchY = e.touches[0].clientY;
    if (touchY > window.innerHeight / 2) {
        handleDuck(true); // Bottom half duck
    } else {
        handleJump(); // Top half jump
    }
});

document.addEventListener('touchend', () => {
    handleDuck(false);
});

// --- Game Flow ---

function startGame() {
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    initGame();
}

function gameOver(cause) {
    state.isPlaying = false;
    
    // Determine funny message
    const reasonText = cause === 'PAPERWORK' 
        ? "Buried in Paperwork." 
        : "Hit by a mandatory meeting.";
    
    deathReason.innerText = reasonText;
    
    // Save High Score
    if (state.score > state.highScore) {
        state.highScore = state.score;
        localStorage.setItem('salaryman_highscore', state.highScore);
    }
    
    gameOverScreen.classList.remove('hidden');
}

// UI Buttons
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

// Initial Setup
highScoreEl.innerText = state.highScore;