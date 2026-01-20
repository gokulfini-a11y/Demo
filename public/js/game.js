const svg = document.getElementById('game-objects');
const scoreEl = document.getElementById('score');
const menu = document.getElementById('menu');
const deathScreen = document.getElementById('death-screen');
const errorMsg = document.getElementById('error-msg');

let state = {
    running: false,
    score: 0,
    speed: 7,
    player: { y: 350, vy: 0, jumping: false, ducking: false },
    obstacles: [],
    frame: 0
};

// --- SVG Factory for the Developer (Stickman) ---
function createPlayerSVG() {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.id = "player-group";
    g.innerHTML = `
        <g stroke="#00ff00" stroke-width="4" fill="none" stroke-linecap="round">
            <circle id="p-head" cx="0" cy="-70" r="10" /> <line id="p-body" x1="0" y1="-60" x2="0" y2="-25" />
            <line id="p-arm-l" x1="0" y1="-50" x2="-15" y2="-35" />
            <line id="p-arm-r" x1="0" y1="-50" x2="15" y2="-35" />
            <line id="p-leg-l" x1="0" y1="-25" x2="-15" y2="0" />
            <line id="p-leg-r" x1="0" y1="-25" x2="15" y2="0" />
            <rect x="5" y="-45" width="20" height="15" fill="#333" stroke="#0f0" stroke-width="1" transform="rotate(-10)"/>
        </g>
    `;
    return g;
}

const playerNode = createPlayerSVG();
svg.appendChild(playerNode);

function startGame() {
    state = { running: true, score: 0, speed: 7, player: { y: 350, vy: 0, jumping: false, ducking: false }, obstacles: [], frame: 0 };
    menu.classList.add('hidden');
    deathScreen.classList.add('hidden');
    while(svg.childNodes.length > 1) svg.removeChild(svg.lastChild);
    loop();
}

function loop() {
    if (!state.running) return;
    state.frame++;
    state.score++;
    scoreEl.innerText = state.score;

    updatePlayer();
    updateObstacles();
    
    if (state.frame % 100 === 0) state.speed += 0.2;
    requestAnimationFrame(loop);
}

function updatePlayer() {
    const p = state.player;
    if (p.jumping) {
        p.vy += 0.8; // Gravity
        p.y += p.vy;
        if (p.y >= 350) {
            p.y = 350;
            p.jumping = false;
        }
    }

    // Animation: Legs move based on frame
    const legMove = state.player.jumping ? 10 : Math.sin(state.frame * 0.2) * 15;
    document.getElementById('p-leg-l').setAttribute('x2', -10 - legMove);
    document.getElementById('p-leg-r').setAttribute('x2', 10 + legMove);
    
    // Position
    const duckScale = p.ducking ? 0.6 : 1;
    playerNode.setAttribute('transform', `translate(100, ${p.y}) scale(1, ${duckScale})`);
}

function updateObstacles() {
    if (state.frame % Math.floor(1000/state.speed) === 0) {
        spawnObstacle();
    }

    state.obstacles.forEach((obs, index) => {
        obs.x -= state.speed;
        obs.el.setAttribute('transform', `translate(${obs.x}, ${obs.y})`);

        // Collision Check
        const pRect = { x: 100, y: state.player.y - (state.player.ducking ? 40 : 80), w: 30, h: state.player.ducking ? 40 : 80 };
        if (obs.x < pRect.x + pRect.w && obs.x + obs.w > pRect.x && obs.y < pRect.y + pRect.h && obs.y + obs.h > pRect.y) {
            endGame(obs.type);
        }

        if (obs.x < -100) {
            svg.removeChild(obs.el);
            state.obstacles.splice(index, 1);
        }
    });
}

function spawnObstacle() {
    const isTall = Math.random() > 0.5;
    const type = isTall ? "MERGE_CONFLICT" : "BUG";
    const el = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    if (isTall) { // Must Duck
        el.innerHTML = `<rect width="40" height="100" fill="#f00" fill-opacity="0.3" stroke="#f00" stroke-width="2"/>
                        <text x="5" y="50" fill="#fff" font-size="10">MERGE</text>`;
        state.obstacles.push({ x: 1000, y: 220, w: 40, h: 100, el, type });
    } else { // Must Jump
        el.innerHTML = `<circle cx="20" cy="20" r="15" fill="#ff6600"/>
                        <text x="10" y="25" fill="#fff" font-size="10">BUG</text>`;
        state.obstacles.push({ x: 1000, y: 315, w: 40, h: 40, el, type });
    }
    svg.appendChild(el);
}

function endGame(type) {
    state.running = false;
    deathScreen.classList.remove('hidden');
    const logs = ["NullPointerException", "Stack Overflow", "Uncaught ReferenceError", "Segmentation Fault"];
    errorMsg.innerText = `STOP_CODE: ${type} \n ${logs[Math.floor(Math.random()*logs.length)]}`;
}

// Controls
window.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && !state.player.jumping) {
        state.player.jumping = true;
        state.player.vy = -15;
    }
    if (e.code === 'ArrowDown') state.player.ducking = true;
});

window.addEventListener('keyup', e => {
    if (e.code === 'ArrowDown') state.player.ducking = false;
});
