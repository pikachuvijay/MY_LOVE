// Target Countdown Date: 02/07/2026 00:00:00 Local Time
const TARGET_DATE = new Date(2026, 6, 2, 0, 0, 0); // Month is 0-indexed (6 is July)

// Love Quotes Database featuring her name "Amritha" and her beauty
const LOVE_QUOTES = [
    "Counting down every second to Amritha's special day... ❤️",
    "Amritha, you are the most beautiful girl in the universe. ✨",
    "Your laugh is my absolute favorite sound, Amritha. 🥰",
    "You make my world colorful, my gorgeous Amritha. 🌈",
    "Your eyes hold the light of a thousand stars, Amritha. 💫",
    "My heart is, and always will be, yours, Amritha. 🌹",
    "To the most beautiful girl who stole my heart, Amritha. 👑",
    "Every day spent loving you is my favorite day, Amritha. 💕"
];

// Playlist Database
// --------------------------------------------------------------------------
// HOW TO ADD YOUR OWN CUSTOM SONGS:
// 1. Copy your custom song files (e.g., your girlfriend's favorite romantic MP3 tracks)
//    into the "assets" folder inside your project directory.
// 2. Update the "src" properties in the PLAYLIST array below to match your file names 
//    (e.g., change "assets/music.mp3" to "assets/my-gf-favorite-song.mp3").
// 3. Update the "title" and "artist" names to match your songs.
// --------------------------------------------------------------------------
const PLAYLIST = [
    { title: "Mudhal Nee Mudivum Nee", artist: "💕 For Amritha", src: "assets/mudhal_nee.mp3", frequency: 261.63 },
    { title: "Happy Birthday", artist: "✨ Birthday Melody", src: "assets/happy_birthday.mp3", frequency: 293.66 }
];

// State variables
let countdownInterval;
let bypassClicks = 0;
let audioContext = null;
let isPlaying = false;
let isMuted = true;
let currentTrackIndex = 0;
let duration = 180; 
let currentTime = 0;
let candlesBlownCount = 0;

// Mouse coordinates for interactive hearts avoidance
const mouse = { x: null, y: null, radius: 100 };

// Initialize everything on load
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initLockQuote();
    initSecretBypass();
    initMemories();
    initInteractiveCanvasBackground();
    initLockAudioControls();
    initLockCakeInteractivity();
    initLoveTestGame();
    
    // Sync initial UI elements (starts muted)
    updateAudioUI();
    
    // Autoplay trigger on first touch/interaction anywhere on page
    document.addEventListener('click', autoPlayTrigger);
    document.addEventListener('touchstart', autoPlayTrigger);
});

// Autoplay trigger on first interaction
const autoPlayTrigger = () => {
    startAudioEngine();
    removeAutoplayTrigger();
};

function removeAutoplayTrigger() {
    document.removeEventListener('click', autoPlayTrigger);
    document.removeEventListener('touchstart', autoPlayTrigger);
}

// Capture mouse/finger positions
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }
});
window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
});
window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});


// ==========================================================================
// 1. COUNTDOWN & LOCK SCREEN
// ==========================================================================

function initCountdown() {
    const dNum = document.getElementById('days');
    const hNum = document.getElementById('hours');
    const mNum = document.getElementById('minutes');
    const sNum = document.getElementById('seconds');
    const progressBar = document.getElementById('progress-bar');
    const lockCaption = document.getElementById('lock-caption');
    
    function updateTimer() {
        const now = new Date();
        const diff = TARGET_DATE.getTime() - now.getTime();
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('unlock') === 'true' || urlParams.get('bypass') === 'true') {
            clearInterval(countdownInterval);
            unlockWebsite();
            return;
        }

        if (diff <= 0) {
            clearInterval(countdownInterval);
            dNum.textContent = '00';
            hNum.textContent = '00';
            mNum.textContent = '00';
            sNum.textContent = '00';
            progressBar.style.width = '100%';
            lockCaption.textContent = "It's time! Tap the heart to open Amritha's surprise. 🎁";
            
            document.getElementById('heart-trigger').addEventListener('click', unlockWebsite, { once: true });
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        dNum.textContent = String(days).padStart(2, '0');
        hNum.textContent = String(hours).padStart(2, '0');
        mNum.textContent = String(minutes).padStart(2, '0');
        sNum.textContent = String(seconds).padStart(2, '0');

        const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
        const progressPercentage = Math.min(100, Math.max(0, 100 - (diff / tenDaysMs * 100)));
        progressBar.style.width = `${progressPercentage}%`;
    }

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
}

function initLockQuote() {
    const textElement = document.getElementById('lock-love-quote');
    if (!textElement) return;

    let index = 0;
    textElement.textContent = LOVE_QUOTES[0];

    setInterval(() => {
        textElement.style.opacity = '0';
        textElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            index = (index + 1) % LOVE_QUOTES.length;
            textElement.textContent = LOVE_QUOTES[index];
            textElement.style.opacity = '1';
            textElement.style.transform = 'translateY(0)';
        }, 600);
    }, 6000);
}

function initSecretBypass() {
    const heart = document.getElementById('heart-trigger');
    
    heart.addEventListener('click', () => {
        const now = new Date();
        const diff = TARGET_DATE.getTime() - now.getTime();
        
        heart.classList.add('clicking');
        setTimeout(() => heart.classList.remove('clicking'), 300);

        // Spawn small burst of hearts upon clicking heart icon
        createBurstHearts(heart);

        // Only unlock if the countdown has actually reached 0
        if (diff <= 0) {
            unlockWebsite();
        }
    });
}

function unlockWebsite() {
    const lockScreen = document.getElementById('lock-screen');
    const appContainer = document.getElementById('app-container');

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
        
        setTimeout(() => {
            confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
        }, 350);
    }

    lockScreen.classList.add('unlocked');
    appContainer.classList.add('visible');
    
    // Launch features
    startFloatingBalloons();
    initMusicPlayer();
    initCakeCandles();
    animateTextReveal();
    
    // Play a happy greeting chime chord
    playSynthTone(523.25, 'sine', 0.6); // C5
    setTimeout(() => playSynthTone(659.25, 'sine', 0.6), 150); // E5
    setTimeout(() => playSynthTone(783.99, 'sine', 0.8), 300); // G5
}

function createBurstHearts(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
        const heartText = document.createElement('div');
        heartText.className = 'floating-heart';
        heartText.innerHTML = '❤️';
        heartText.style.left = `${x}px`;
        heartText.style.top = `${y}px`;
        
        const dx = (Math.random() - 0.5) * 150;
        heartText.style.setProperty('--dx', `${dx}px`);
        heartText.style.animationDuration = `${1.5 + Math.random()}s`;
        
        document.body.appendChild(heartText);
        setTimeout(() => heartText.remove(), 2500);
    }
}


//Syncs all UI audio components to match the state of `isMuted` and `isPlaying`
function updateAudioUI() {
    const lockMuteBtn = document.getElementById('lock-audio-toggle');
    const lockIndicator = document.getElementById('lock-music-indicator');
    const speakerIcon = lockMuteBtn ? lockMuteBtn.querySelector('.music-speaker-icon') : null;
    
    const playBtn = document.getElementById('play-btn');
    const muteBtn = document.getElementById('mute-btn');
    const disc = document.getElementById('disc');
    const audioTrack = document.getElementById('bg-music');

    if (!audioTrack) return;

    // Apply native mute state to the audio element
    audioTrack.muted = isMuted;

    // 1. Sync mute state in UI
    if (isMuted) {
        if (speakerIcon) speakerIcon.textContent = '🔇';
        if (muteBtn) muteBtn.textContent = '🔇';
        if (lockIndicator) lockIndicator.classList.remove('playing');
    } else {
        if (speakerIcon) speakerIcon.textContent = '🔊';
        if (muteBtn) muteBtn.textContent = '🔊';
        if (isPlaying) {
            if (lockIndicator) lockIndicator.classList.add('playing');
        } else {
            if (lockIndicator) lockIndicator.classList.remove('playing');
        }
    }

    // 2. Sync play state in UI
    if (isPlaying) {
        if (playBtn) playBtn.innerHTML = '⏸';
        if (disc) disc.classList.add('playing');
        if (!isMuted && lockIndicator) lockIndicator.classList.add('playing');
    } else {
        if (playBtn) playBtn.innerHTML = '▶';
        if (disc) disc.classList.remove('playing');
        if (lockIndicator) lockIndicator.classList.remove('playing');
    }

    // 3. Sync Playlist Menu items & dots
    const dots = document.querySelectorAll('.track-dot');
    dots.forEach((dot, idx) => {
        if (idx === currentTrackIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, idx) => {
        const statusIcon = item.querySelector('.playlist-status-icon');
        if (idx === currentTrackIndex) {
            item.classList.add('active');
            if (statusIcon) {
                statusIcon.textContent = isPlaying ? '⏸' : '▶';
            }
        } else {
            item.classList.remove('active');
            if (statusIcon) {
                statusIcon.textContent = '🎵';
            }
        }
    });
}

function initLockAudioControls() {
    const lockMuteBtn = document.getElementById('lock-audio-toggle');
    if (!lockMuteBtn) return;
    
    lockMuteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        removeAutoplayTrigger(); // Disable autoplay trigger on manual interaction
        
        const audioTrack = document.getElementById('bg-music');
        if (!audioTrack) return;

        // Toggle mute
        isMuted = !isMuted;
        audioTrack.muted = isMuted;

        if (!isPlaying) {
            isPlaying = true;
            audioTrack.play().catch(err => console.log("Play failed:", err));
        }

        updateAudioUI();
    });
}

function initLockCakeInteractivity() {
    const lockCake = document.querySelector('.lock-cake-wrapper');
    if (!lockCake) return;
    
    lockCake.addEventListener('click', (e) => {
        // Initialize AudioContext if not already done
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Spawn confetti from the clicked cake!
        if (typeof confetti === 'function') {
            const rect = lockCake.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { x, y },
                colors: ['#ff3366', '#bf5af2', '#fffae8', '#ffd60a', '#1abc9c']
            });
        }
        
        // Play synth chime sound!
        playSynthTone(587.33, 'sine', 0.2); // D5
        setTimeout(() => playSynthTone(783.99, 'sine', 0.2), 80); // G5
        setTimeout(() => playSynthTone(987.77, 'sine', 0.4), 160); // B5
        
        // Add a cute shake animation
        const cakeScene = lockCake.querySelector('.lock-cake');
        if (cakeScene) {
            cakeScene.classList.add('clicking');
            setTimeout(() => {
                cakeScene.classList.remove('clicking');
            }, 300);
        }
    });
}

function startAudioEngine() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const audioTrack = document.getElementById('bg-music');
    if (!audioTrack) return;
    
    // Automatically unmute on first page-wide user interaction to play audio out loud
    isMuted = false;
    audioTrack.muted = false;
    
    audioTrack.play().then(() => {
        isPlaying = true;
        updateAudioUI();
    }).catch(e => {
        console.log("Autoplay failed or blocked:", e);
    });
}


// ==========================================================================
// 3. MUSIC PLAYLIST ENGINE (UNLOCKED PAGE)
// ==========================================================================

function initMusicPlayer() {
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const disc = document.getElementById('disc');
    const timelineFill = document.getElementById('timeline-fill');
    const currentTimeText = document.getElementById('current-time');
    const totalTimeText = document.getElementById('total-time');
    
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');
    const audioTrack = document.getElementById('bg-music');
    
    // Sync current UI state with the lock screen audio player
    updateAudioUI();
    
    loadTrack(currentTrackIndex);

    function loadTrack(index) {
        const track = PLAYLIST[index];
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        
        currentTime = 0;
        timelineFill.style.width = '0%';
        currentTimeText.textContent = '0:00';
        
        // Reset player durations
        duration = audioTrack ? (audioTrack.duration || 180) : 180; 
        totalTimeText.textContent = formatTime(duration);

        if (audioTrack) {
            const wasPlaying = isPlaying;
            // Only update the source if it is actually different
            if (!audioTrack.src.endsWith(track.src)) {
                audioTrack.pause();
                audioTrack.src = track.src;
                audioTrack.load();
                
                audioTrack.addEventListener('loadedmetadata', () => {
                    duration = audioTrack.duration;
                    totalTimeText.textContent = formatTime(duration);
                    if (wasPlaying) {
                        audioTrack.play().catch(err => console.log("Play failed on load:", err));
                        isPlaying = true;
                        updateAudioUI();
                    }
                }, { once: true });
            } else {
                duration = audioTrack.duration || 180;
                totalTimeText.textContent = formatTime(duration);
                if (wasPlaying && audioTrack.paused) {
                    audioTrack.play().catch(err => console.log("Play failed:", err));
                }
            }
        }
    }

    function togglePlay() {
        removeAutoplayTrigger(); // Disable autoplay trigger on manual interaction
        const audioTrack = document.getElementById('bg-music');
        if (!audioTrack) return;

        if (isPlaying) {
            audioTrack.pause();
            isPlaying = false;
        } else {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            // Automatically unmute when play is pressed so user hears the music
            isMuted = false;
            audioTrack.muted = false;
            
            audioTrack.play().then(() => {
                isPlaying = true;
                updateAudioUI();
            }).catch(err => console.log("Play failed:", err));
        }
        updateAudioUI();
    }

    playBtn.addEventListener('click', togglePlay);

    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            removeAutoplayTrigger(); // Disable autoplay trigger on manual interaction
            isMuted = !isMuted;
            updateAudioUI();
        });
    }

    prevBtn.addEventListener('click', () => {
        removeAutoplayTrigger(); // Disable autoplay trigger on manual interaction
        currentTrackIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
        loadTrack(currentTrackIndex);
        updateAudioUI();
        playSynthTone(330, 'triangle', 0.15); // button click feedback
    });

    nextBtn.addEventListener('click', () => {
        removeAutoplayTrigger(); // Disable autoplay trigger on manual interaction
        currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
        loadTrack(currentTrackIndex);
        updateAudioUI();
        playSynthTone(440, 'triangle', 0.15); // button click feedback
    });

    // Track metadata loading
    if (audioTrack) {
        audioTrack.addEventListener('timeupdate', () => {
            currentTime = audioTrack.currentTime;
            timelineFill.style.width = `${(currentTime / duration) * 100}%`;
            currentTimeText.textContent = formatTime(currentTime);
        });
        
        audioTrack.addEventListener('ended', () => {
            // Auto skip next
            nextBtn.click();
        });
    }

    // Timeline clicks
    document.getElementById('progress-track').addEventListener('click', (e) => {
        const track = e.currentTarget;
        const rect = track.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        
        currentTime = percentage * duration;
        
        if (audioTrack) {
            audioTrack.currentTime = currentTime;
        } else {
            timelineFill.style.width = `${percentage * 100}%`;
            currentTimeText.textContent = formatTime(currentTime);
        }
    });

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    }

    // Dynamic Simulated visualizer wave bars
    const visualizerContainer = document.getElementById('visualizer-bars');
    const barCount = 18;
    const bars = [];
    
    // Clear and build bars
    visualizerContainer.innerHTML = '';
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        visualizerContainer.appendChild(bar);
        bars.push(bar);
    }

    function drawVisualizer() {
        if (!document.getElementById('app-container').classList.contains('visible')) {
            requestAnimationFrame(drawVisualizer);
            return;
        }

        bars.forEach((bar, idx) => {
            let val = 5;
            if (isPlaying) {
                const time = Date.now() * 0.005;
                const factor = 1 - Math.abs(idx - barCount/2) / (barCount/2);
                val = 5 + Math.sin(time + idx * 0.4) * 20 * factor + Math.random() * 8;
            }
            bar.style.height = `${Math.max(5, val)}px`;
            bar.style.backgroundColor = `hsl(${280 + (val * 1.6)}, 85%, 60%)`;
        });

        requestAnimationFrame(drawVisualizer);
    }
    // Hook up dots click
    const dots = document.querySelectorAll('.track-dot');
    dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            if (index !== currentTrackIndex) {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                if (!isPlaying) {
                    togglePlay();
                } else {
                    updateAudioUI();
                }
            }
        });
    });

    // Hook up playlist menu items click
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            if (index === currentTrackIndex) {
                togglePlay();
            } else {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                if (!isPlaying) {
                    togglePlay();
                } else {
                    updateAudioUI();
                }
            }
        });
    });

    drawVisualizer();
}


function playSynthTone(freq, type = 'sine', duration = 0.5) {
    if (!audioContext || isMuted) return;
    
    // Resume audio context if suspended
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    osc.type = type;
    osc.frequency.value = freq;
    
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + duration);
}


// ==========================================================================
// 4. BALLOONS FLOATING & POP GAME
// ==========================================================================

function startFloatingBalloons() {
    const colors = [
        'var(--color-pink)', 
        'var(--color-purple)', 
        'var(--color-gold)', 
        'var(--color-teal)', 
        '#ff4d80', 
        '#ff9f0a', 
        '#bf5af2'
    ];
    const wishes = [
        "Love you! ❤️", "Amritha ✨", "My Queen 👑", "Cutie Pie 🍰", 
        "HBD 🎂", "Angel 👼", "Forever ♾️", "Beautiful Amritha 💖"
    ];
    
    const balloonLayer = document.getElementById('balloon-layer');

    function createBalloon() {
        if (!document.getElementById('app-container').classList.contains('visible')) return;
        
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const wish = wishes[Math.floor(Math.random() * wishes.length)];
        const sizeMultiplier = 0.85 + Math.random() * 0.35; 
        const left = Math.random() * 90; 
        const duration = 13 + Math.random() * 7; 
        
        balloon.style.backgroundColor = color;
        balloon.style.color = color;
        balloon.style.left = `${left}%`;
        balloon.style.transform = `scale(${sizeMultiplier})`;
        balloon.style.animationDuration = `${duration}s`;
        
        const string = document.createElement('div');
        string.className = 'balloon-string';
        balloon.appendChild(string);
        
        const text = document.createElement('div');
        text.className = 'balloon-text';
        text.textContent = wish;
        balloon.appendChild(text);

        const popTrigger = (e) => {
            e.stopPropagation();
            popBalloon(balloon);
        };
        balloon.addEventListener('click', popTrigger);
        balloon.addEventListener('touchstart', popTrigger);

        balloonLayer.appendChild(balloon);
        setTimeout(() => balloon.remove(), duration * 1000);
    }

    setInterval(createBalloon, 2400);
    for (let i = 0; i < 5; i++) {
        setTimeout(createBalloon, i * 400);
    }
}

function popBalloon(balloon) {
    const rect = balloon.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 15,
            spread: 50,
            origin: { x, y },
            colors: [balloon.style.backgroundColor, '#ffffff']
        });
    }

    // Play bubble pop synthesizer chime note
    playSynthTone(500 + Math.random() * 600, 'sine', 0.12);

    balloon.style.transform = 'scale(0)';
    balloon.style.opacity = '0';
    setTimeout(() => balloon.remove(), 200);
}


// ==========================================================================
// 5. CAKE BLOWOUT CONTROLLER
// ==========================================================================

function initCakeCandles() {
    const flames = document.querySelectorAll('#cake-scene .flame');
    const instruction = document.getElementById('cake-instruction');
    
    candlesBlownCount = 0;
    
    flames.forEach(flame => {
        flame.classList.remove('blown-out');
        
        const blowTrigger = (e) => {
            e.stopPropagation();
            if (!flame.classList.contains('blown-out')) {
                flame.classList.add('blown-out');
                candlesBlownCount++;
                
                playSynthTone(600 + Math.random() * 300, 'sine', 0.18);
                createCakeSparkles(flame);
                
                if (candlesBlownCount === flames.length) {
                    instruction.textContent = "You blew out all the candles! Happy Birthday, Amritha! 🎉";
                    triggerGiantBirthdayCelebration();
                } else {
                    instruction.textContent = `Keep going! ${flames.length - candlesBlownCount} left to blow, Amritha! 💨`;
                }
            }
        };
        flame.parentElement.addEventListener('click', blowTrigger);
    });
}

function createCakeSparkles(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
        const star = document.createElement('div');
        star.className = 'floating-heart';
        star.innerHTML = '✨';
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.color = 'var(--color-gold)';
        
        const dx = (Math.random() - 0.5) * 80;
        star.style.setProperty('--dx', `${dx}px`);
        star.style.animationDuration = `${0.8 + Math.random()}s`;
        
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1000);
    }
}

function triggerGiantBirthdayCelebration() {
    if (typeof confetti === 'function') {
        const count = 200;
        const defaults = { origin: { y: 0.7 } };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
        
        const end = Date.now() + 4000;
        (function frame() {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });

            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }

    // Play sparkling magic scale chords
    playSynthTone(523.25, 'sine', 0.6); // C5
    setTimeout(() => playSynthTone(659.25, 'sine', 0.6), 120); // E5
    setTimeout(() => playSynthTone(783.99, 'sine', 0.6), 240); // G5
    setTimeout(() => playSynthTone(987.77, 'sine', 0.6), 360); // B5
    setTimeout(() => playSynthTone(1046.50, 'sine', 1.2), 480); // C6
}


// ==========================================================================
// 6. 3D MEMORIES DECK
// ==========================================================================

function initMemories() {
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            playSynthTone(480, 'triangle', 0.08);
        });
    });
}


// ==========================================================================
// 7. HIGH-PERFORMANCE INTERACTIVE CANVAS BACKGROUND ENGINE
//    (Combines: Twinkling Stars, Falling Interactive Hearts, Fireworks)
// ==========================================================================

function initInteractiveCanvasBackground() {
    const canvas = document.getElementById('canvas-sparkles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const stars = [];
    const hearts = [];
    const fireworks = [];
    const particles = [];
    
    // Configurations
    const maxStars = 40;
    const maxHearts = 25;
    
    class Star {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.8 + 0.2;
            this.speed = Math.random() * 0.015 + 0.005;
            this.growth = Math.random() > 0.5 ? this.speed : -this.speed;
        }
        
        update() {
            this.alpha += this.growth;
            if (this.alpha > 0.9) {
                this.growth = -this.speed;
            } else if (this.alpha < 0.1) {
                this.growth = this.speed;
                this.x = Math.random() * width;
                this.y = Math.random() * height;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.fill();
        }
    }
    
    class FallingHeart {
        constructor() {
            this.reset(true);
        }
        
        reset(randomY = false) {
            this.x = Math.random() * width;
            this.y = randomY ? Math.random() * height : -15;
            this.size = Math.random() * 12 + 8; // gentle size
            this.speed = Math.random() * 0.8 + 0.4; // slow, gentle motion
            this.wind = (Math.random() - 0.5) * 0.2;
            this.alpha = Math.random() * 0.5 + 0.4;
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = (Math.random() - 0.5) * 0.015;
            
            // Interaction vectors
            this.vx = 0;
            this.vy = 0;
        }
        
        update() {
            // Check pointer proximity avoidance
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const avoidRadius = mouse.radius;
                
                if (dist < avoidRadius) {
                    const force = (avoidRadius - dist) / avoidRadius;
                    const forceX = (dx / dist) * force * 3.5;
                    const forceY = (dy / dist) * force * 3.5;
                    
                    // Accelerate away
                    this.vx += forceX;
                    this.vy += forceY;
                }
            }
            
            // Apply friction/decay to push velocity so it slows back down organically
            this.vx *= 0.94;
            this.vy *= 0.94;
            
            // Move heart down gently, adding the deflection velocity
            this.y += this.speed + this.vy;
            this.x += this.wind + Math.sin(this.angle) * 0.15 + this.vx;
            this.angle += this.angleSpeed;
            
            // Wrap or reset when offscreen
            if (this.y > height + 15 || this.x < -15 || this.x > width + 15) {
                this.reset(false);
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(Math.sin(this.angle) * 0.15); // soft rock back/forth
            ctx.globalAlpha = this.alpha;
            
            // Draw a cute pink heart shape
            ctx.beginPath();
            const d = this.size;
            ctx.moveTo(0, -d / 4);
            ctx.bezierCurveTo(-d / 2, -d / 1.5, -d, -d / 3, -d, 0);
            ctx.bezierCurveTo(-d, d / 2, -d / 3, d, 0, d * 1.15);
            ctx.bezierCurveTo(d / 3, d, d, d / 2, d, 0);
            ctx.bezierCurveTo(d, -d / 3, d / 2, -d / 1.5, 0, -d / 4);
            ctx.closePath();
            
            ctx.fillStyle = "hsl(340, 95%, 72%)";
            ctx.fill();
            
            ctx.restore();
        }
    }

    class Firework {
        constructor() {
            this.reset();
        }

        reset() {
            // Spawn firecracker rockets from bottom-left or bottom-right screen corners
            const spawnFromLeft = Math.random() > 0.5;
            
            if (spawnFromLeft) {
                this.x = 20; // Bottom-left corner
                this.tx = Math.random() * (width * 0.35) + 30; // targets left-middle sky
            } else {
                this.x = width - 20; // Bottom-right corner
                this.tx = width - (Math.random() * (width * 0.35) + 30); // targets right-middle sky
            }
            
            this.y = height + 10;
            this.ty = Math.random() * (height * 0.35) + (height * 0.08); // shoots high into the sky
            this.speed = Math.random() * 2.5 + 4.5;
            this.alpha = 1;
            this.dead = false;
        }

        update() {
            const dx = this.tx - this.x;
            const dy = this.ty - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            if (dist < 10) {
                this.dead = true;
                this.explode();
            } else {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }
        }

        explode() {
            // Generate cracker particles
            const count = 50 + Math.floor(Math.random() * 30);
            const hue = Math.random() * 360;
            for (let i = 0; i < count; i++) {
                particles.push(new FireworkParticle(this.x, this.y, hue));
            }
            
            // Soft explosion chime note
            if (audioContext && isPlaying && !isMuted) {
                playSynthTone(150 + Math.random() * 200, 'sine', 0.25);
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = "#fffae8";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "var(--color-gold)";
            ctx.fill();
            ctx.restore();
        }
    }

    class FireworkParticle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.hue = hue;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3.5 + 1;
            
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.gravity = 0.06;
            this.decay = Math.random() * 0.015 + 0.012;
            this.dead = false;
        }

        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;

            if (this.alpha <= 0) {
                this.dead = true;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue}, 95%, 70%)`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = `hsl(${this.hue}, 95%, 50%)`;
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Instantiate stars & hearts
    for (let i = 0; i < maxStars; i++) stars.push(new Star());
    for (let i = 0; i < maxHearts; i++) hearts.push(new FallingHeart());

    // Spawn initial fireworks on load immediately
    setTimeout(() => {
        fireworks.push(new Firework());
    }, 400);
    setTimeout(() => {
        fireworks.push(new Firework());
    }, 1200);

    // Schedule sky firecrackers (more frequent for an interactive, lively background)
    setInterval(() => {
        if (fireworks.length < 5) {
            fireworks.push(new Firework());
        }
    }, 2000);
    
    // Core animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });

        // Update & draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const fw = fireworks[i];
            fw.update();
            if (fw.dead) {
                fireworks.splice(i, 1);
            } else {
                fw.draw();
            }
        }

        // Update & draw firework particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            if (p.dead) {
                particles.splice(i, 1);
            } else {
                p.draw();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

function animateTextReveal() {
    const title = document.querySelector('.birthday-title');
    if (!title) return;
    
    const text = title.textContent;
    title.innerHTML = '';
    
    [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.transform = 'translateY(15px) scale(0.8)';
        span.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        span.style.transitionDelay = `${0.3 + index * 0.05}s`;
        
        title.appendChild(span);
        
        setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0) scale(1)';
        }, 50);
    });
}

function initLoveTestGame() {
    const btnYes = document.getElementById('btn-love-yes');
    const btnNo = document.getElementById('btn-love-no');
    const btnReset = document.getElementById('btn-love-reset');
    const avatar = document.getElementById('love-avatar');
    const bubble = document.getElementById('love-bubble');
    const area = document.getElementById('love-buttons-area');
    const gameWrapper = document.getElementById('love-game-wrapper');
    const successDisplay = document.getElementById('love-success-display');
    const successQuote = document.getElementById('love-success-quote');

    if (!btnYes || !btnNo || !btnReset || !avatar || !bubble || !area || !gameWrapper || !successDisplay) return;

    let noCount = 0;
    
    // Quotes database when she clicks Yes
    const YES_QUOTES = [
        "\"If I had a flower for every time I thought of you... I could walk through my garden forever.\" 🌸",
        "\"My heart is and always will be yours, Amritha.\" 💖",
        "\"I love you not only for what you are, but for what I am when I am with you, Amritha.\" 💕",
        "\"You are the finest, loveliest, tenderest, and most beautiful person I have ever known.\" 👑",
        "\"Every cell of my body loves you, Amritha. You are my home and my adventure.\" 🌹",
        "\"You are my today and all of my tomorrows, my beautiful Amritha.\" ✨"
    ];

    const STAGES = [
        { avatar: "🥺", bubble: "Amritha, do you love me? Yes or No?" },
        { avatar: "🤨", bubble: "Wait... what? You moved towards No? 🧐" },
        { avatar: "👀", bubble: "Are you sure? Try again! 🤨" },
        { avatar: "😭", bubble: "No is not an option! Please choose Yes! 🥺" },
        { avatar: "😡", bubble: "Wrong answer! I'm getting angry now... 😤" },
        { avatar: "😤", bubble: "GRRR! You're doing it on purpose! 🤬" },
        { avatar: "🤬", bubble: "That's it! Look how big YES is now! 😈" },
        { avatar: "😈", bubble: "Just click YES! There is no escape! 😂" }
    ];

    function setupButtons() {
        btnYes.style.position = 'absolute';
        btnYes.style.left = 'calc(50% - 70px)';
        btnYes.style.top = '60px';
        btnYes.style.transform = 'translate(-50%, -50%) scale(1)';

        btnNo.style.position = 'absolute';
        btnNo.style.left = 'calc(50% + 70px)';
        btnNo.style.top = '60px';
        btnNo.style.transform = 'translate(-50%, -50%) scale(1)';
        
        avatar.className = 'love-test-avatar';
        avatar.textContent = STAGES[0].avatar;
        bubble.textContent = STAGES[0].bubble;
        noCount = 0;
        
        gameWrapper.style.display = 'flex';
        successDisplay.style.display = 'none';
    }

    setupButtons();

    function moveNoButton() {
        noCount++;
        
        // Update avatar and bubble text based on current count
        const stageIndex = Math.min(noCount, STAGES.length - 1);
        const stage = STAGES[stageIndex];
        
        avatar.textContent = stage.avatar;
        bubble.textContent = stage.bubble;
        
        // Trigger avatar animations
        avatar.classList.remove('shake', 'angry-pulse');
        void avatar.offsetWidth; // trigger reflow
        
        if (noCount >= 4) {
            avatar.classList.add('angry-pulse');
        } else {
            avatar.classList.add('shake');
        }
        
        // Play synth warning sound
        playSynthTone(300 - noCount * 20, 'sawtooth', 0.15);

        // Scale Yes Button and No Button
        let yesScale = 1 + noCount * 0.4;
        const isMobile = window.innerWidth <= 480;
        const maxYesScale = isMobile ? 2.0 : 4.0;
        if (yesScale > maxYesScale) {
            yesScale = maxYesScale;
        }
        const noScale = Math.max(0.3, 1 - noCount * 0.1);
        
        btnYes.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
        btnNo.style.transform = `translate(-50%, -50%) scale(${noScale})`;
        
        // Relocate No button
        const areaWidth = area.clientWidth;
        const areaHeight = area.clientHeight;
        const btnWidth = btnNo.offsetWidth;
        const btnHeight = btnNo.offsetHeight;
        
        const maxX = areaWidth - btnWidth - 20;
        const maxY = areaHeight - btnHeight - 20;
        
        // Calculate random coordinates inside area bounds
        let randomX = Math.random() * maxX + btnWidth / 2;
        let randomY = Math.random() * maxY + btnHeight / 2;
        
        // Keep it offset from center (where YES button is expanding)
        if (Math.abs(randomX - areaWidth/2) < 80 && Math.abs(randomY - areaHeight/2) < 40) {
            randomX = (randomX + 150) % maxX;
            randomY = (randomY + 60) % maxY;
        }

        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
        
        // Add moving transition class to make it smooth but escape quickly
        btnNo.classList.add('moving');
        setTimeout(() => btnNo.classList.remove('moving'), 150);
    }

    // Capture both hover and touchstart events to escape
    btnNo.addEventListener('mouseover', moveNoButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    btnYes.addEventListener('click', () => {
        // Trigger confetti
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });
            setTimeout(() => {
                confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } });
                confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } });
            }, 300);
        }

        // Chime sound chord
        playSynthTone(523.25, 'sine', 0.5); // C5
        setTimeout(() => playSynthTone(659.25, 'sine', 0.5), 100); // E5
        setTimeout(() => playSynthTone(783.99, 'sine', 0.5), 200); // G5
        setTimeout(() => playSynthTone(1046.50, 'sine', 0.8), 300); // C6

        // Set random quote
        const randomQuote = YES_QUOTES[Math.floor(Math.random() * YES_QUOTES.length)];
        successQuote.textContent = randomQuote;

        // Switch screens
        gameWrapper.style.display = 'none';
        successDisplay.style.display = 'flex';
    });

    btnReset.addEventListener('click', () => {
        setupButtons();
        playSynthTone(440, 'triangle', 0.15); // reset chord
    });
}
