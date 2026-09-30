// ตรวจจับเมื่อมีการรีเฟรชหน้าเว็บ ให้กลับไปที่หน้า start.html เสมอ
window.addEventListener('DOMContentLoaded', () => {
    const perfEntries = performance.getEntriesByType("navigation");
    if (perfEntries.length > 0 && perfEntries[0].type === "reload") {
        window.location.href = 'index.html';
    }
});

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

    playGameOver() {
        if (this.muted) return;
        this.init();
        const notes = [293.66, 277.18, 261.63, 246.94, 220.00, 196.00];
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
        const melody = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63];
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

const QUESTION_POOL = [
    {
        title: "ดวงอาทิตย์",
        monsterName: "อสูรดวงอาทิตย์",
        type: "flame",
        desc: "ดวงอาทิตย์สีส้มและสีแดงที่ให้ความรู้สึกอบอุ่นและร้อนแรง จัดอยู่ในวรรณะสีใด?",
        tip: "ทำไมถึงตอบ 'วรรณะสีอุ่น': เพราะสีส้มและสีแดงเป็นตัวแทนของความร้อนและแสงแดด",
        iconType: "sun",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีเย็น': เพราะสีฟ้าและน้ำเงินให้ความรู้สึกหนาวเย็นและสงบ",
        iconType: "water",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีเย็น': เพราะสีเขียวมองแล้วรู้สึกสดชื่นสบายตา ผ่อนคลาย",
        iconType: "leaf",
        choices: [
            { text: "วรรณะสีเย็น", correct: true },
            { text: "วรรณะสีอุ่น", correct: false }
        ]
    },
    {
        title: "กองไฟ",
        monsterName: "วิญญาณไฟ",
        type: "flame",
        desc: "เปลวไฟสีส้มและสีเหลืองสว่าง มีลักษณะให้ความร้อนและแสงสว่าง จัดอยู่ในวรรณะสีใด?",
        tip: "ทำไมถึงตอบ 'วรรณะสีอุ่น': เพราะสีเหลืองและสีส้มให้ความร้อนและแสงสว่าง",
        iconType: "fire",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีเย็น': เพราะน้ำแข็งและหิมะเกี่ยวข้องกับความหนาวเย็น",
        iconType: "ice",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีอุ่น': เพราะสีเหลืองสดใสให้ความรู้สึกสว่างและอบอุ่น",
        iconType: "banana",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีอุ่น': เพราะสีแดงเป็นสีหลักของวรรณะสีอุ่น",
        iconType: "apple",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีเย็น': เพราะสีน้ำเงินเข้มให้ความรู้สึกเย็นและลึกลับ",
        iconType: "ocean",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีเย็น': เพราะสีม่วงที่มีส่วนผสมของน้ำเงินจัดอยู่ในกลุ่มนี้",
        iconType: "flower",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีเย็น': เพราะช่วยให้จิตใจสงบและผ่อนคลายเหมาะกับการนอน",
        iconType: "moon",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีอุ่น': เพราะมีสีส้มและสีแดงซึ่งอยู่ในวรรณะสีอุ่น",
        iconType: "sunset",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีเย็น': เพราะโทนสีฟ้าและเทาหมองให้ความรู้สึกหนาวเย็น",
        iconType: "cloud",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีอุ่น': เพราะสีแดงให้ความรู้สึกตื่นเต้นเร่าร้อน",
        iconType: "warning",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีอุ่น': เพราะสีแดงสดจัดอยู่ในวรรณะสีอุ่น",
        iconType: "watermelon",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีเย็น': เพราะสายน้ำใสให้ความรู้สึกเย็นสบาย",
        iconType: "waterfall",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีอุ่น': เพราะสีส้มจัดอยู่ในกลุ่มวรรณะสีอุ่น",
        iconType: "carrot",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีเย็น': เพราะสีน้ำเงินจัดอยู่ในวรรณะสีเย็น",
        iconType: "blueberry",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีอุ่น': เพราะแสงสีเหลืองนวลให้ความรู้สึกอบอุ่น",
        iconType: "bulb",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีเย็น': เพราะโทนสีเทาฟ้าจัดเป็นกลุ่มวรรณะสีเย็น",
        iconType: "storm",
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
        tip: "ทำไมถึงตอบ 'วรรณะสีอุ่น': เพราะสีเหลืองให้ความรู้สึกสว่างและอบอุ่น",
        iconType: "lemon",
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
let monsterHitAnim = false;

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

const heroCanvas = document.getElementById('heroCanvas');
const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
const monsterCanvas = document.getElementById('monsterCanvas');
const monsterCtx = monsterCanvas ? monsterCanvas.getContext('2d') : null;
const catGroundCanvas = document.getElementById('catGroundCanvas');
const catGroundCtx = catGroundCanvas ? catGroundCanvas.getContext('2d') : null;
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;

let globalAnimFrame = 0;
let catXPos = 0;
let catDir = 1;

let bgClouds = [
    { x: 50, y: 40, speed: 0.15, size: 1 },
    { x: 200, y: 90, speed: 0.25, size: 1.2 },
    { x: 310, y: 50, speed: 0.2, size: 0.9 }
];

let bgBirds = [
    { x: 80, y: 120, speed: 0.5 },
    { x: 240, y: 80, speed: 0.4 }
];

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderLives() {
    if (!livesDisplay) return;
    const heartCanvases = livesDisplay.querySelectorAll('.heart-icon');
    heartCanvases.forEach((canvas, i) => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 14, 14);
        const active = i < lives;
        
        const heartMap = [
            "0110110",
            "1111111",
            "1111111",
            "0111110",
            "0011100",
            "0001000"
        ];

        heartMap.forEach((row, rIdx) => {
            for (let cIdx = 0; cIdx < row.length; cIdx++) {
                if (row[cIdx] === '1') {
                    ctx.fillStyle = active ? '#ef4444' : '#334155';
                    ctx.fillRect(cIdx * 2, rIdx * 2 + 1, 2, 2);
                }
            }
        });
    });
}

function drawHero(ctx, frame) {
    if (!ctx) return;
    ctx.clearRect(0, 0, 45, 45);
    const p = 2;
    const x = 8;
    const y = 8;

    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(x + 2*p, y + 1*p, 7*p, 5*p);
    ctx.fillStyle = '#37474f';
    ctx.fillRect(x + 4*p, y + 3*p, 4*p, 1*p);

    ctx.fillStyle = '#1e88e5';
    ctx.fillRect(x + 2*p, y + 6*p, 7*p, 5*p);

    ctx.fillStyle = '#e0e0e0';
    const swordOffset = (frame % 2 === 0) ? 0 : -2;
    ctx.fillRect(x + 10*p, y + 2*p + swordOffset, 2*p, 7*p);
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(x + 9*p, y + 7*p + swordOffset, 4*p, 1*p);

    ctx.fillStyle = '#1565c0';
    ctx.fillRect(x + 2*p, y + 11*p, 2*p, 3*p);
    ctx.fillRect(x + 7*p, y + 11*p, 2*p, 3*p);
}

function drawMonster(ctx, type, frame) {
    if (!ctx) return;
    ctx.clearRect(0, 0, 45, 45);
    const p = 2;
    let x = 8;
    let y = 8 + ((frame % 2 === 0) ? 0 : -2);

    if (monsterHitAnim) {
        x += (Math.random() > 0.5 ? 2 : -2);
    }

    if (type === 'wizard') {
        ctx.fillStyle = monsterHitAnim ? '#ff80ab' : '#7b1fa2';
        ctx.fillRect(x + 2*p, y + 2*p, 8*p, 10*p);
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(x + (monsterHitAnim ? 3 : 4), y + 1*p, monsterHitAnim ? 5 : 4, 2*p);
    } else if (type === 'dragon') {
        ctx.fillStyle = monsterHitAnim ? '#ff5252' : '#e53935';
        ctx.fillRect(x + 2*p, y + 2*p, 8*p, 7*p);
        ctx.fillStyle = '#ffb300';
        ctx.fillRect(x + 0*p, y + (monsterHitAnim ? 2 : 1), 2*p, 3*p);
        ctx.fillRect(x + 10*p, y + (monsterHitAnim ? 2 : 1), 2*p, 3*p);
    } else if (type === 'flame') {
        ctx.fillStyle = monsterHitAnim ? '#ffab40' : '#ff5722';
        ctx.fillRect(x + 3*p, y + 2*p, 6*p, 8*p);
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(x + 4*p, y + 4*p, 4*p, 4*p);
    } else if (type === 'snowman') {
        ctx.fillStyle = monsterHitAnim ? '#80deea' : '#e0f7fa';
        ctx.fillRect(x + 3*p, y + 1*p, 6*p, 5*p);
        ctx.fillRect(x + 2*p, y + 6*p, 8*p, 6*p);
        ctx.fillStyle = '#ff9800';
        ctx.fillRect(x + 5*p, y + 3*p, 3*p, 1*p);
    } else {
        ctx.fillStyle = monsterHitAnim ? '#84ffff' : '#00acc1';
        ctx.fillRect(x + 3*p, y + 3*p, 6*p, 6*p);
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(x + 4*p, y + 4*p, 2*p, 2*p);
    }
}

function drawBackgroundScene(ctx) {
    if (!ctx) return;
    if (bgCanvas.width !== bgCanvas.parentElement.clientWidth || bgCanvas.height !== bgCanvas.parentElement.clientHeight) {
        bgCanvas.width = bgCanvas.parentElement.clientWidth;
        bgCanvas.height = bgCanvas.parentElement.clientHeight;
    }
    ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    bgClouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > bgCanvas.width + 60) cloud.x = -70;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(cloud.x, cloud.y, 40 * cloud.size, 12 * cloud.size);
        ctx.fillRect(cloud.x + 10 * cloud.size, cloud.y - 6 * cloud.size, 20 * cloud.size, 8 * cloud.size);
    });

    bgBirds.forEach(bird => {
        bird.x += bird.speed;
        if (bird.x > bgCanvas.width + 30) bird.x = -30;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bird.x, bird.y, 2, 2);
        ctx.fillRect(bird.x + 2, bird.y + 2, 2, 2);
        ctx.fillRect(bird.x + 4, bird.y, 2, 2);
    });
}

function drawSceneryAndCat(ctx, x, animFrame, flip) {
    if (!ctx) return;
    const w = catGroundCanvas.width;
    const h = catGroundCanvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(10, 26); ctx.lineTo(70, 4); ctx.lineTo(130, 26);
    ctx.fill();

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(110, 26); ctx.lineTo(190, 0); ctx.lineTo(270, 26);
    ctx.fill();

    ctx.fillStyle = '#14532d';
    for(let i = 20; i < w; i += 65) {
        ctx.fillRect(i + 4, 10, 6, 14);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(i + 2, 6, 10, 6);
        ctx.fillStyle = '#14532d';
    }

    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, 24, w, 6);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(0, 30, w, 22);

    ctx.save();
    const catY = 16;
    if (flip) {
        ctx.translate(x + 30, catY);
        ctx.scale(-1, 1);
        ctx.translate(-x, -catY);
    }

    const p = 2;
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x + 6*p, catY + 2*p, 5*p, 4*p);
    ctx.fillRect(x + 2*p, catY + 5*p, 7*p, 4*p);

    if (animFrame % 2 === 0) {
        ctx.fillRect(x + 2*p, catY + 9*p, 1*p, 3*p);
        ctx.fillRect(x + 7*p, catY + 9*p, 1*p, 3*p);
    } else {
        ctx.fillRect(x + 4*p, catY + 9*p, 1*p, 3*p);
        ctx.fillRect(x + 6*p, catY + 9*p, 1*p, 3*p);
    }

    ctx.restore();
}

function drawExampleIcon(canvas, iconType) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const p = 2; 
    const ox = 2;
    const oy = 2;

    if (iconType === 'sun' || iconType === 'sunset') {
        ctx.fillStyle = '#ff5722';
        ctx.fillRect(ox + 1*p, oy + 2*p, 6*p, 6*p);
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(ox + 2*p, oy + 3*p, 4*p, 4*p);
    } else if (iconType === 'fire') {
        ctx.fillStyle = '#ff3d00';
        ctx.fillRect(ox + 2*p, oy + 2*p, 4*p, 6*p);
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(ox + 3*p, oy + 4*p, 2*p, 3*p);
    } else if (iconType === 'water' || iconType === 'ocean' || iconType === 'waterfall') {
        ctx.fillStyle = '#00b0ff';
        ctx.fillRect(ox + 1*p, oy + 2*p, 6*p, 6*p);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ox + 2*p, oy + 3*p, 2*p, 2*p);
    } else if (iconType === 'leaf') {
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(ox + 2*p, oy + 1*p, 5*p, 6*p);
        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(ox + 3*p, oy + 7*p, 2*p, 1*p);
    } else {
        ctx.fillStyle = '#80deea';
        ctx.fillRect(ox + 1*p, oy + 2*p, 6*p, 5*p);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ox + 2*p, oy + 3*p, 2*p, 2*p);
    }
}

function animateLoop() {
    globalAnimFrame++;
    const frame = Math.floor(globalAnimFrame / 15);

    if (heroCtx) drawHero(heroCtx, frame);

    const currentMonsterType = levels[currentLevelIndex] ? levels[currentLevelIndex].type : 'wizard';
    if (monsterCtx) drawMonster(monsterCtx, currentMonsterType, frame);

    if (bgCtx) drawBackgroundScene(bgCtx);

    if (catGroundCanvas && catGroundCtx) {
        catXPos += catDir * 1.5;
        if (catXPos > catGroundCanvas.width - 30) catDir = -1;
        if (catXPos < 0) catDir = 1;
        drawSceneryAndCat(catGroundCtx, catXPos, Math.floor(globalAnimFrame / 6), catDir === -1);
    }

    requestAnimationFrame(animateLoop);
}

function initGame() {
    levels = shuffleArray(QUESTION_POOL);
    currentLevelIndex = 0;
    lives = 5;
    renderLives();
    score = 0;
    monsterHitAnim = false;
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
    if (victoryScreen) victoryScreen.classList.add('hidden');
    loadLevel();
}

function loadLevel() {
    if (!levels[currentLevelIndex]) return;
    const level = levels[currentLevelIndex];
    const totalLevels = levels.length;
    const stageStr = (currentLevelIndex + 1).toString().padStart(2, '0');
    
    monsterHitAnim = false;

    if (levelDisplay) levelDisplay.innerText = `STAGE ${stageStr}/${totalLevels}`;
    if (scoreDisplay) scoreDisplay.innerText = `SCORE: ${score.toString().padStart(4, '0')}`;
    if (monsterName) monsterName.innerText = level.monsterName;
    if (monsterHpBar) monsterHpBar.style.width = '100%';
    if (scenarioTitle) scenarioTitle.innerText = level.title;
    if (scenarioDesc) scenarioDesc.innerText = level.desc;
    if (choicesContainer) choicesContainer.innerHTML = '';
    if (feedbackBox) feedbackBox.classList.add('hidden');
    if (damagePopup) damagePopup.classList.add('hidden');

    const shuffledChoices = shuffleArray(level.choices);

    shuffledChoices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.className = 'pixel-btn';
        btn.innerText = `${idx + 1}. ${choice.text}`;
        btn.onclick = (e) => checkAnswer(choice.correct, level.tip, level.iconType, e.target);
        if (choicesContainer) choicesContainer.appendChild(btn);
    });
}

function checkAnswer(isCorrect, tip, iconType, clickedBtn) {
    if (choicesContainer) {
        const allBtns = choicesContainer.querySelectorAll('.pixel-btn');
        allBtns.forEach(btn => btn.classList.add('disabled'));
    }

    let iconHtml = `<div style="text-align: center; margin-top: 4px;"><canvas id="feedbackCanvas" width="28" height="28" style="border: 2px solid #555; background: #111; image-rendering: pixelated;"></canvas></div>`;

    if (isCorrect) {
        audio.playAttack();
        monsterHitAnim = true;
        if (monsterHpBar) monsterHpBar.style.width = '0%';
        if (damagePopup) damagePopup.classList.remove('hidden');
        audio.playCorrect();

        if (clickedBtn) clickedBtn.classList.add('correct-btn');
        score += 100;
        if (scoreDisplay) scoreDisplay.innerText = `SCORE: ${score.toString().padStart(4, '0')}`;
        if (feedbackText) feedbackText.innerHTML = `ถูกต้อง! ${tip} ${iconHtml}`;
        if (feedbackBox) feedbackBox.style.borderColor = "#00e676";
    } else {
        audio.playWrong();
        if (clickedBtn) clickedBtn.classList.add('wrong-btn');
        
        if (gameContainer) {
            gameContainer.classList.add('screen-shake');
            setTimeout(() => gameContainer.classList.remove('screen-shake'), 300);
        }

        lives--;
        renderLives();
        if (feedbackText) feedbackText.innerHTML = `ผิดนะ! ${tip} ${iconHtml}`;
        if (feedbackBox) feedbackBox.style.borderColor = "#f44336";

        if (lives <= 0) {
            setTimeout(() => {
                audio.stopBGM();
                audio.playGameOver();
                if (gameOverDesc) {
                    gameOverDesc.innerText = `พลังชีวิตหมดลงที่ Stage ${(currentLevelIndex + 1).toString().padStart(2, '0')}!\nคุณทำคะแนนได้ทั้งหมด ${score} คะแนน`;
                }
                if (gameOverScreen) gameOverScreen.classList.remove('hidden');
            }, 500);
            return;
        }
    }
    
    if (feedbackBox) feedbackBox.classList.remove('hidden');

    const canvasEl = document.getElementById('feedbackCanvas');
    if (canvasEl) {
        drawExampleIcon(canvasEl, iconType);
    }
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        audio.playClick();
        currentLevelIndex++;
        if (currentLevelIndex < levels.length) {
            loadLevel();
        } else {
            audio.stopBGM();
            audio.playFanfare();
            if (victoryDesc) {
                victoryDesc.innerText = `ยินดีด้วยผู้กล้า! คุณทำคะแนนได้รวม ${score} คะแนน พิชิตคำถามครบทั้ง 20 ข้อเรียบร้อยแล้ว!`;
            }
            if (victoryScreen) victoryScreen.classList.remove('hidden');
        }
    });
}

if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        audio.playClick();
        initGame();
        audio.startBGM();
    });
}

if (retryBtn) {
    retryBtn.addEventListener('click', () => {
        audio.playClick();
        initGame();
        audio.startBGM();
    });
}

if (audioBtn) {
    audioBtn.addEventListener('click', () => {
        const isUnmuted = audio.toggleMute();
        audioBtn.innerText = isUnmuted ? "🎶 BGM: เปิด" : "🎶 BGM: ปิด";
    });
}

document.body.addEventListener('click', () => {
    audio.startBGM();
}, { once: true });

initGame();
animateLoop();
