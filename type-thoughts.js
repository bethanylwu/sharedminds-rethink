document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('inputArea');
    const wordsDiv = document.getElementById('words');
    let lastTime = null;
    let lastPos = null;
    let lineAngle = 0;
    let lineLength = 40; // px between words
    let wrapMargin = 40; // px from edge to wrap
    let wordCount = 0;
    let lastWord = '';
    let currentColor = '#222';

    function randomPos() {
        const w = window.innerWidth;
        const h = window.innerHeight - 120;
        return {
            x: Math.max(Math.random(), 0.1) * (w - 100),
            y: Math.max(Math.random(), 0.2) * (h - 30)
        };
    }

    function nextPos(speed, word) {
        if (!lastPos) return randomPos();
        if (/[,\.\?!]/.test(lastWord[lastWord.length - 1])) return randomPos();
        let angle = lineAngle;
        let dist = lineLength;
        let straightness = Math.max(0, Math.min(1, (800 - speed) / 600));
        angle += (1 - straightness) * (Math.random() - 0.5) * Math.PI / 2;
        dist += (1 - straightness) * (Math.random() * 60);
        let x = lastPos.x + Math.cos(angle) * dist;
        let y = lastPos.y + Math.sin(angle) * dist;
        const w = window.innerWidth;
        const h = window.innerHeight - 120;
        if (x > w - wrapMargin) {
            x = wrapMargin;
            y += 30;
        }
        if (y > h - wrapMargin) {
            y = wrapMargin;
        }
        return { x, y };
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function fadeWord(span, speed) {
        // Fade starts after 30 seconds
        const fadeDelay = 30000;
        // Fade duration: min 2s, max 20s, based on speed (ms between words)
        // Fast speed = short fade, slow speed = long fade
        const minFade = 2000, maxFade = 20000;
        let fadeDuration = Math.max(minFade, Math.min(maxFade, maxFade - (speed - 100)));
        setTimeout(() => {
            span.style.transition = `opacity ${fadeDuration}ms linear`;
            span.style.opacity = 0;
            setTimeout(() => {
                if (span.parentNode) span.parentNode.removeChild(span);
            }, fadeDuration + 500);
        }, fadeDelay);
    }

    input.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
            const value = input.value.trim();
            if (!value) return;
            const words = value.split(/\s+/);
            const now = Date.now();
            let speed = lastTime ? now - lastTime : 300;
            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                let punctuationDetected = false;
                if (wordCount === 0) {
                    punctuationDetected = true;
                } else if (/[,.?!]/.test(lastWord[lastWord.length - 1])) {
                    punctuationDetected = true;
                }
                if (punctuationDetected) {
                    currentColor = getRandomColor();
                }
                let pos = wordCount === 0 ? randomPos() : nextPos(speed, word);
                let span = document.createElement('span');
                span.className = 'word';
                span.textContent = word;
                span.style.left = pos.x + 'px';
                span.style.top = pos.y + 'px';
                span.style.color = currentColor;
                wordsDiv.appendChild(span);
                fadeWord(span, speed);
                lastPos = pos;
                lastWord = word;
                wordCount++;
                if (wordCount > 1) {
                    let dx = pos.x - lastPos.x;
                    let dy = pos.y - lastPos.y;
                    lineAngle = Math.atan2(dy, dx);
                }
            }
            input.value = '';
            lastTime = now;
        }
    });
});
