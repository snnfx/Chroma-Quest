// ตรวจจับเมื่อมีการรีเฟรชหน้าเว็บ ให้กลับไปที่หน้า start.html เสมอ
window.addEventListener('DOMContentLoaded', () => {
    const perfEntries = performance.getEntriesByType("navigation");
    if (perfEntries.length > 0 && perfEntries[0].type === "reload") {
        window.location.href = 'index.html';
    }
});

// Web Audio API Synthesizer (8-Bit Sound Generator)
class SoundFX {
    constructor() {
        this.ctx = null;
        this.bgmInterval = null;
        this.bgmPlaying = false;
        this.bgmStep = 0;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playClick() {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playAttack() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playCorrect() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    }

    playWrong() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    }

    // เสียงตอน Game Over (8-Bit Sad Tone Melodrama)
    playGameOver() {
        if (this.muted) return;
        this.init();
        const notes = [293.66, 277.18, 261.63, 246.94, 220.00, 196.00]; // D, C#, C, B, A, G
        const durations = [0.2, 0.2, 0.2, 0.2, 0.3, 0.6];
        let delay = 0;

        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + delay;
            const dur = durations[idx];
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.001, now + dur);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + dur);

            delay += dur * 0.85;
        });
    }

    playFanfare() {
        if (this.muted) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + (idx * 0.15);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
        });
    }

    startBGM() {
        if (this.bgmPlaying || this.muted) return;
        this.init();
        this.bgmPlaying = true;
        
        const melody = [
            261.63, 329.63, 392.00, 523.25, 392.00, 329.63,
            293.66, 349.23, 440.00, 587.33, 440.00, 349.23,
            220.00, 261.63, 329.63, 440.00, 329.63, 261.63,
            196.00, 246.94, 293.66, 392.00, 293.66, 246.94
        ];
        
        this.bgmInterval = setInterval(() => {
            if (!this.bgmPlaying || this.muted) return;
            const freq = melody[this.bgmStep % melody.length];
            this.bgmStep++;
            const now = this.ctx.currentTime;
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            
            gain.gain.setValueAtTime(0.035, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now);
            osc.stop(now + 0.45);
        }, 480);
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmInterval) clearInterval(this.bgmInterval);
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return !this.muted;
    }
}

const audio = new SoundFX();

// Question Pool สำหรับเด็ก ป.4 (20 ข้อเฉพาะ 2 วรรณะสี: วรรณะสีอุ่น และ วรรณะสีเย็น)
const QUESTION_POOL = [
    {
        title: "ดวงอาทิตย์",
        monsterName: "อสูรดวงอาทิตย์",
        type: "flame",
        desc: "ดวงอาทิตย์สีส้มและสีแดงที่ให้ความรู้สึกอบอุ่นและร้อนแรง จัดอยู่ในวรรณะสีใด?",
        tip: "สีส้มและสีแดงเป็นตัวแทนของความร้อน จัดเป็น 'วรรณะสีอุ่น'",
        choices: [
            { text: "วรรณะสีอุ่น", correct: true },
            { text: "วรรณะสีเย็น", correct: false }
        ]
    },
    {
        title: "ท้องฟ้าและน้ำทะเล",
        monsterName: "มังกรน้ำแข็ง",
        type: "dragon",
        desc: "น้ำทะเลและท้องฟ้าสีฟ้า ให้ความรู้สึกเย็นสบาย จัดอยู่ในวรรณะสีใด?",
        tip: "สีฟ้าและน้ำเงินให้ความรู้สึกหนาวเย็น จัดเป็น 'วรรณะสีเย็น'",
        choices: [
            { text: "วรรณะสีอุ่น", correct: false },
            { text: "วรรณะสีเย็น", correct: true }
        ]
    },
    {
        title: "ใบไม้และต้นหญ้า",
        monsterName: "กบพฤกษา",
        type: "frog",
        desc: "สีเขียวของต้นไม้ใบหญ้า ที่มองแล้วรู้สึกสดชื่นสบายตา จัดอยู่ในวรรณะสีใด?",
        tip: "สีเขียวส่วนใหญ่จัดอยู่ในกลุ่ม 'วรรณะสีเย็น' ที่ช่วยให้รู้สึกผ่อนคลาย",
        choices: [
            { text: "วรรณะสีเย็น", correct: true },
            { text: "วรรณะสีอุ่น", correct: false }
        ]
    },
    {
        title: "กองไฟ",
        monsterName: "วิญญาณไฟ",
        type: "flame",
        desc: "เปลวไฟสีส้มและสีเหลืองสว่าง มีลักษณะให้ความร้อนและแสงสว่าง จัดเป็นวรรณะสีใด?",
        tip: "สีเหลืองและสีส้มให้ความรู้สึกอบอุ่นและร้อนแรง จึงเป็น 'วรรณะสีอุ่น'",
        choices: [
            { text: "วรรณะสีเย็น", correct: false },
            { text: "วรรณะสีอุ่น", correct: true }
        ]
    },
    {
        title: "ก้อนน้ำแข็ง",
        monsterName: "สโนว์แมน",
        type: "snowman",
        desc: "ก้อนน้ำแข็งและหิมะสีขาว ให้ความรู้สึกหนาวเย็น จัดอยู่ในวรรณะสีใด?",
        tip: "โทนสีขาวและฟ้าเกี่ยวข้องกับความหนาว จัดเป็น 'วรรณะสีเย็น'",
        choices: [
            { text: "วรรณะสีเย็น", correct: true },
            { text: "วรรณะสีอุ่น", correct: false }
        ]
    },
    {
        title: "กล้วยสุก",
        monsterName: "จารย์จานสีเวท",
        type: "wizard",
        desc: "กล้วยสุกสีเหลืองสดใส ให้ความรู้สึกอบอุ่นและร่าเริง จัดอยู่ในวรรณะสีใด?",
        tip: "สีเหลืองจัดอยู่ในกลุ่ม 'วรรณะสีอุ่น' ที่ให้ความรู้สึกสว่างสดใส",
        choices: [
            { text: "วรรณะสีอุ่น", correct: true },
            { text: "วรรณะสีเย็น", correct: false }
        ]
    },
    {
        title: "ผลไม้สีแดง",
        monsterName: "อสูรผลไม้",
        type: "tiger",
        desc: "สตรอว์เบอร์รีหรือแอปเปิ้ลสีแดงสด จัดอยู่ในวรรณะสีใด?",
        tip: "สีแดงเป็นสีหลักของ 'วรรณะสีอุ่น'",
        choices: [
            { text: "วรรณะสีเย็น", correct: false },
            { text: "วรรณะสีอุ่น", correct: true }
        ]
    },
    {
        title: "มหาสมุทร",
        monsterName: "หมึกยักษ์ห้วงลึก",
        type: "octopus",
        desc: "ภาพมหาสมุทรสีน้ำเงินเข้มลึกลับ จัดอยู่ในวรรณะสีใด?",
        tip: "สีน้ำเงินให้ความรู้สึกเย็นและสงบ จึงอยู่กลุ่ม 'วรรณะสีเย็น'",
        choices: [
            { text: "วรรณะสีเย็น", correct: true },
            { text: "วรรณะสีอุ่น", correct: false }
        ]
    },
    {
        title: "ดอกไม้สีม่วง",
        monsterName: "ค้างคาวราตรี",
        type: "bat",
        desc: "ดอกไม้สีม่วงเข้ม (ที่ออกโทนน้ำเงิน) จัดอยู่ในวรรณะสีใด?",
        tip: "สีม่วงที่มีส่วนผสมของน้ำเงินจะจัดอยู่ใน 'วรรณะสีเย็น'",
        choices: [
            { text: "วรรณะสีเย็น", correct: true },
            { text: "วรรณะสีอุ่น", correct: false }
        ]
    },
    {
        title: "ห้องนอนที่น่าผ่อนคลาย",
        monsterName: "อสูรห้องนอน",
        type: "wizard",
        desc: "ถ้าอยากให้ห้องนอนรู้สึกผ่อนคลายและหลับสบาย ควรเลือกใช้สีห้องในวรรณะใด?",
        tip: "สีวรรณะเย็น เช่น ฟ้าอ่อนหรือเขียวอ่อน ช่วยให้จิตใจสงบและผ่อนคลาย",
        choices: [
            { text: "วรรณะสีเย็น", correct: true },
            { text: "วรรณะสีอุ่น", correct: false }
        ]
    },
    {
        title: "พระอาทิตย์ตกดิน",
        monsterName: "อสูรตะวันลับฟ้า",
        type: "flame",
        desc: "ท้องฟ้าช่วงเย็นย่ำมีสีส้มและสีแดงอมชมพู จัดอยู่ในวรรณะสีใด?",
        tip: "สีส้มและแดงเป็นสีในวรรณะสีอุ่น",
        choices: [
            { text: "วรรณะสีอุ่น", correct: true },
            { text: "วรรณะสีเย็น", correct: false }
        ]
    },
    {
        title: "วันฝนตก",
        monsterName: "สโนว์แมนฝน",
        type: "snowman",
        desc: "วันฝนตกท้องฟ้ามีสีเทาและฟ้าหม่นๆ ให้ความรู้สึกชื้นและหนาวเย็น จัดเป็นวรรณะสีใด?",
        tip: "โทนสีฟ้าและเทาหมอง จัดเป็นวรรณะสีเย็น",
        choices: [
            { text: "วรรณะสีเย็น", correct: true },
            { text: "วรรณะสีอุ่น", correct: false }
        ]
    },
    {
        title: "ป้ายเตือนภัยสีแดง",
        monsterName: "มังกรแดง",
        type: "dragon",
        desc: "ป้ายเตือนอันตรายหรือป้ายจราจรสีแดงสด จัดอยู่ในวรรณะสีใด?",
        tip: "สีแดงให้ความรู้สึกตื่นเต้นเร่าร้อน จัดเป็นวรรณะสีอุ่น",
        choices: [
            { text: "วรรณะสีอุ่น", correct: true },
            { text: "วรรณะสีเย็น", correct: false }
        ]
    },
    {
        title: "แตงโมเนื้อแดง",
        monsterName: "อสูรแตงโม",
        type: "tiger",
        desc: "เนื้อแตงโมสีแดงสดหวานฉ่ำ จัดอยู่ในวรรณะสีใด?",
        tip: "สีแดงจัดอยู่ในวรรณะสีอุ่น",
        choices: [
            { text: "วรรณะสีอุ่น", correct: true },
            { text: "วรรณะสีเย็น", correct: false }
        ]
    },
    {
        title: "น้ำตกใสสะอาด",
        monsterName: "มังกรน้ำใส",
        type: "dragon",
        desc: "สายน้ำตกใสไหลเย็นเห็นตัวปลา ให้ความรู้สึกเย็นสบาย จัดอยู่ในวรรณะสีใด?",
        tip: "สายน้ำสีฟ้าใสจัดอยู่ในวรรณะสีเย็น",
        choices: [
            { text: "วรรณะสีเย็น", correct: true },
            { text: "วรรณะสีอุ่น", correct: false }
        ]
    },
    {
        title: "แครอทสีส้ม",
        monsterName: "กระต่ายนักสู้",
        type: "wizard",
        desc: "หัวแครอทสีส้มสดใสที่เจ้ากระต่ายชอบกิน จัดอยู่ในวรรณะสีใด?",
        tip: "สีส้มจัดอยู่ในกลุ่มวรรณะสีอุ่น",
        choices: [
            { text: "วรรณะสีอุ่น", correct: true },
            { text: "วรรณะสีเย็น", correct: false }
        ]
    },
    {
        title: "บลูเบอร์รี",
        monsterName: "หมึกยักษ์บลูเบอร์รี",
        type: "octopus",
        desc: "ผลบลูเบอร์รีสีน้ำเงินเข้ม จัดอยู่ในวรรณะสีใด?",
        tip: "สีน้ำเงินจัดอยู่ในวรรณะสีเย็น",
        choices: [
            { text: "วรรณะสีเย็น", correct: true },
            { text: "วรรณะสีอุ่น", correct: false }
        ]
    },
    {
        title: "ไฟฉายแสงสีเหลือง",
        monsterName: "อสูรหลอดไฟ",
        type: "bulb",
        desc: "แสงไฟจากหลอดไฟสีเหลืองนวลที่ให้ความอบอุ่นในยามค่ำคืน จัดอยู่ในวรรณะสีใด?",
        tip: "แสงสีเหลืองนวลจัดอยู่ในวรรณะสีอุ่น",
        choices: [
            { text: "วรรณะสีอุ่น", correct: true },
            { text: "วรรณะสีเย็น", correct: false }
        ]
    },
    {
        title: "ก้อนเมฆฝนสีเทาฟ้า",
        monsterName: "ค้างคาวพายุ",
        type: "bat",
        desc: "กลุ่มเมฆฝนก้อนใหญ่สีเทาอมฟ้าที่กำลังจะตก จัดอยู่ในวรรณะสีใด?",
        tip: "โทนสีเทาฟ้าจัดอยู่ในวรรณะสีเย็น",
        choices: [
            { text: "วรรณะสีเย็น", correct: true },
            { text: "วรรณะสีอุ่น", correct: false }
        ]
    },
    {
        title: "เลมอนสีเหลือง",
        monsterName: "จารย์เลมอน",
        type: "wizard",
        desc: "ผลเลมอนสีเหลืองเปรี้ยวจี๊ด ให้ความรู้สึกสว่างสดใส จัดอยู่ในวรรณะสีใด?",
        tip: "สีเหลืองจัดอยู่ในวรรณะสีอุ่น",
        choices: [
            { text: "วรรณะสีอุ่น", correct: true },
            { text: "วรรณะสีเย็น", correct: false }
        ]
    }
];

let levels = [];
let currentLevelIndex = 0;
let lives = 5;
let score = 0;

// DOM Elements
const gameContainer = document.getElementById('game-container');
const levelDisplay = document.getElementById('level-title-display');
const scoreDisplay = document.getElementById('score-display');
const livesDisplay = document.getElementById('lives-display');

const monsterName = document.getElementById('monster-name');
const monsterHpBar = document.getElementById('monster-hp-bar');
const damagePopup = document.getElementById('damage-popup');

const scenarioTitle = document.getElementById('scenario-title');
const scenarioDesc = document.getElementById('scenario-desc');
const choicesContainer = document.getElementById('choices-container');
const feedbackBox = document.getElementById('feedback-box');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');

const victoryScreen = document.getElementById('victory-screen');
const victoryDesc = document.getElementById('victory-desc');
const restartBtn = document.getElementById('restart-btn');

const gameOverScreen = document.getElementById('game-over-screen');
const gameOverDesc = document.getElementById('game-over-desc');
const retryBtn = document.getElementById('retry-btn');

const audioBtn = document.getElementById('audio-toggle-btn');

// Canvas Drawing Systems
const heroCanvas = document.getElementById('heroCanvas');
const heroCtx = heroCanvas.getContext('2d');

const monsterCanvas = document.getElementById('monsterCanvas');
const monsterCtx = monsterCanvas.getContext('2d');

const catGroundCanvas = document.getElementById('catGroundCanvas');
const catGroundCtx = catGroundCanvas.getContext('2d');

let globalAnimFrame = 0;
let catX = 0;
let catDir = 1;

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderLives() {
    // เรียกใช้ฟังก์ชันวาดพิกเซลหัวใจแทนการใช้อีโมจิแบบเดิม
    drawPixelHearts(lives);
}

function drawHero(ctx, frame) {
    ctx.clearRect(0, 0, 60, 60);
    const p = 3;
    const x = 12;
    const y = 12;

    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(x + 3*p, y + 1*p, 6*p, 5*p);
    ctx.fillStyle = '#37474f';
    ctx.fillRect(x + 4*p, y + 3*p, 5*p, 1*p);

    ctx.fillStyle = '#1e88e5';
    ctx.fillRect(x + 3*p, y + 6*p, 6*p, 5*p);

    ctx.fillStyle = '#e0e0e0';
    const swordOffset = (frame % 2 === 0) ? 0 : -2;
    ctx.fillRect(x + 9*p, y + 2*p + swordOffset, 2*p, 7*p);
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(x + 8*p, y + 7*p + swordOffset, 4*p, 1*p);

    ctx.fillStyle = '#1565c0';
    ctx.fillRect(x + 3*p, y + 11*p, 2*p, 3*p);
    ctx.fillRect(x + 7*p, y + 11*p, 2*p, 3*p);
}

function drawMonster(ctx, type, frame) {
    ctx.clearRect(0, 0, 60, 60);
    const p = 3;
    const x = 12;
    const y = 12 + ((frame % 2 === 0) ? 0 : -2);

    if (type === 'wizard') {
        ctx.fillStyle = '#7b1fa2';
        ctx.fillRect(x + 2*p, y + 2*p, 8*p, 10*p);
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(x + 4*p, y + 0*p, 4*p, 3*p);
    } else if (type === 'dragon') {
        ctx.fillStyle = '#e53935';
        ctx.fillRect(x + 2*p, y + 2*p, 8*p, 7*p);
        ctx.fillStyle = '#ffb300';
        ctx.fillRect(x + 0*p, y + 1*p, 2*p, 3*p);
        ctx.fillRect(x + 10*p, y + 1*p, 2*p, 3*p);
    } else if (type === 'flame') {
        ctx.fillStyle = '#ff5722';
        ctx.fillRect(x + 3*p, y + 2*p, 6*p, 8*p);
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(x + 4*p, y + 4*p, 4*p, 4*p);
    } else if (type === 'snowman') {
        ctx.fillStyle = '#e0f7fa';
        ctx.fillRect(x + 3*p, y + 1*p, 6*p, 5*p);
        ctx.fillRect(x + 2*p, y + 6*p, 8*p, 6*p);
        ctx.fillStyle = '#ff9800';
        ctx.fillRect(x + 5*p, y + 3*p, 3*p, 1*p);
    } else {
        ctx.fillStyle = '#00acc1';
        ctx.fillRect(x + 3*p, y + 3*p, 6*p, 6*p);
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(x + 4*p, y + 4*p, 2*p, 2*p);
    }
}

function drawCatGround(ctx, x, animFrame, flip) {
    const w = catGroundCanvas.width;
    const h = catGroundCanvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#2e7d32';
    for(let i=10; i<w; i+=80) {
        ctx.fillRect(i, 10, 16, 20);
        ctx.fillStyle = '#4e342e';
        ctx.fillRect(i+6, 30, 4, 10);
        ctx.fillStyle = '#2e7d32';
    }

    ctx.fillStyle = '#00a800';
    ctx.fillRect(0, 38, w, 4);
    ctx.fillStyle = '#702808';
    ctx.fillRect(0, 42, w, 12);

    ctx.save();
    const y = 22;
    if (flip) {
        ctx.translate(x + 30, y);
        ctx.scale(-1, 1);
        ctx.translate(-x, -y);
    }

    const p = 2;
    ctx.fillStyle = '#ff9800';
    ctx.fillRect(x + 6*p, y + 2*p, 5*p, 4*p);
    ctx.fillRect(x + 2*p, y + 5*p, 7*p, 4*p);

    ctx.fillStyle = '#e65100';
    ctx.fillRect(x + 6*p, y + 0*p, 1*p, 2*p);
    ctx.fillRect(x + 9*p, y + 0*p, 1*p, 2*p);

    if (animFrame % 2 === 0) {
        ctx.fillRect(x + 2*p, y + 9*p, 1*p, 3*p);
        ctx.fillRect(x + 7*p, y + 9*p, 1*p, 3*p);
    } else {
        ctx.fillRect(x + 4*p, y + 9*p, 1*p, 3*p);
        ctx.fillRect(x + 6*p, y + 9*p, 1*p, 3*p);
    }

    ctx.restore();
}

function animateLoop() {
    globalAnimFrame++;
    const frame = Math.floor(globalAnimFrame / 15);

    drawHero(heroCtx, frame);

    const currentMonsterType = levels[currentLevelIndex] ? levels[currentLevelIndex].type : 'wizard';
    drawMonster(monsterCtx, currentMonsterType, frame);

    catX += catDir * 1.5;
    if (catX > catGroundCanvas.width - 30) catDir = -1;
    if (catX < 0) catDir = 1;

    drawCatGround(catGroundCtx, catX, Math.floor(globalAnimFrame / 6), catDir === -1);

    requestAnimationFrame(animateLoop);
}

function initGame() {
    levels = shuffleArray(QUESTION_POOL);
    currentLevelIndex = 0;
    lives = 5;
    score = 0;
    renderLives();
    gameOverScreen.classList.add('hidden');
    victoryScreen.classList.add('hidden');
    loadLevel();
}

function loadLevel() {
    const level = levels[currentLevelIndex];
    const totalLevels = levels.length;
    const stageStr = (currentLevelIndex + 1).toString().padStart(2, '0');
    levelDisplay.innerText = `STAGE ${stageStr}/${totalLevels}`;
    scoreDisplay.innerText = `SCORE: ${score.toString().padStart(4, '0')}`;
    
    monsterName.innerText = level.monsterName;
    monsterHpBar.style.width = '100%';
    
    scenarioTitle.innerText = level.title;
    scenarioDesc.innerText = level.desc;
    
    choicesContainer.innerHTML = '';
    feedbackBox.classList.add('hidden');
    damagePopup.classList.add('hidden');

    const shuffledChoices = shuffleArray(level.choices);

    shuffledChoices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.className = 'pixel-btn';
        btn.innerText = `${idx + 1}. ${choice.text}`;
        btn.onclick = (e) => checkAnswer(choice.correct, level.tip, e.target);
        choicesContainer.appendChild(btn);
    });
}

function checkAnswer(isCorrect, tip, clickedBtn) {
    const allBtns = choicesContainer.querySelectorAll('.pixel-btn');
    allBtns.forEach(btn => btn.classList.add('disabled'));

    if (isCorrect) {
        audio.playAttack();
        
        monsterHpBar.style.width = '0%';
        damagePopup.classList.remove('hidden');
        audio.playCorrect();

        clickedBtn.classList.add('correct-btn');
        score += 100;
        scoreDisplay.innerText = `SCORE: ${score.toString().padStart(4, '0')}`;
        feedbackText.innerText = "⚔️ CRITICAL HIT! " + tip;
        feedbackBox.style.borderColor = "#00e676";
    } else {
        audio.playWrong();
        clickedBtn.classList.add('wrong-btn');
        
        gameContainer.classList.add('screen-shake');
        setTimeout(() => gameContainer.classList.remove('screen-shake'), 300);

        lives--;
        renderLives();
        feedbackText.innerText = "💥 ถูกโจมตีสวนกลับ! " + tip;
        feedbackBox.style.borderColor = "#f44336";

        if (lives <= 0) {
            setTimeout(() => {
                audio.stopBGM();      // หยุดเพลงพื้นหลัง
                audio.playGameOver(); // เล่นเสียง Game Over 8-bit เศร้าๆ
                gameOverDesc.innerText = `พลังชีวิตหมดลงที่ Stage ${(currentLevelIndex + 1).toString().padStart(2, '0')}!\nคุณทำคะแนนได้ทั้งหมด ${score} คะแนน`;
                gameOverScreen.classList.remove('hidden');
            }, 500);
            return;
        }
    }
    
    feedbackBox.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
    audio.playClick();
    currentLevelIndex++;
    if (currentLevelIndex < levels.length) {
        loadLevel();
    } else {
        audio.stopBGM();
        audio.playFanfare();
        victoryDesc.innerText = `ยินดีด้วยผู้กล้า! คุณทำคะแนนได้รวม ${score} คะแนน พิชิตคำถามทฤษฎีสีและอุณหภูมิครบทั้ง 20 ข้อเรียบร้อยแล้ว!`;
        victoryScreen.classList.remove('hidden');
    }
});

restartBtn.addEventListener('click', () => {
    audio.playClick();
    initGame();
    audio.startBGM();
});

retryBtn.addEventListener('click', () => {
    audio.playClick();
    initGame();
    audio.startBGM();
});

audioBtn.addEventListener('click', () => {
    const isUnmuted = audio.toggleMute();
    audioBtn.innerText = isUnmuted ? "🎶 BGM: เปิด" : "🔇 BGM: ปิด";
});

document.body.addEventListener('click', () => {
    audio.startBGM();
}, { once: true });

// Start Loops and Game
initGame();
animateLoop();

function drawPixelHearts(currentLives) {
    const heartCanvases = document.querySelectorAll('.pixel-hearts-container .heart-icon');
    heartCanvases.forEach((canvas, index) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isAlive = index < currentLives;
        const color = isAlive ? '#ff3333' : '#444444'; // สีแดงถ้ายังมีชีวิต สีเทาถ้าตาย
        
        // โครงสร้างพิกเซลหัวใจขนาด 9x8
        const heartMatrix = [
            [0,1,1,0,0,0,1,1,0],
            [1,1,1,1,0,1,1,1,1],
            [1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,0,0,0],
            [0,0,0,0,1,0,0,0,0]
        ];

        ctx.fillStyle = color;
        for (let r = 0; r < heartMatrix.length; r++) {
            for (let c = 0; c < heartMatrix[r].length; c++) {
                if (heartMatrix[r][c] === 1) {
                    ctx.fillRect(c + 2, r + 1, 1, 1);
                }
            }
        }
    });
}
