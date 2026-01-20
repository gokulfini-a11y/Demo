<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>{{title}}</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>

    <div class="game-container">
        <svg id="game-world" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#e0f7fa;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
                </linearGradient>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#skyGradient)" />
            
            <g id="world-elements"></g>
            
            <line x1="0" y1="350" x2="1000" y2="350" stroke="#333" stroke-width="2" />
        </svg>

        <div id="ui-layer">
            <div id="score-board">
                <span>KPIs Met: <span id="score">0</span></span>
                <span>Best: <span id="high-score">0</span></span>
            </div>
            
            <div id="start-screen" class="overlay">
                <h1>{{title}}</h1>
                <p>Avoid the <strong>Red Tape</strong> and <strong>Meetings</strong>!</p>
                <div class="controls-hint">
                    <span>[SPACE] / [↑] Jump</span>
                    <span>[↓] Duck</span>
                </div>
                <button id="start-btn">CLOCK IN</button>
            </div>

            <div id="game-over-screen" class="overlay hidden">
                <h1>FIRED!</h1>
                <p id="death-reason">You were buried in paperwork.</p>
                <button id="restart-btn">APPLY FOR NEW JOB</button>
            </div>
        </div>
    </div>

    <script src="/js/game.js"></script>
</body>
</html>