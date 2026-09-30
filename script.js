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

// Question Bank Pool (20 ข้อเต็ม)
const QUESTION_POOL = [
    {
        title: "คู่สีขัดแย้งอุณหภูมิ",
        monsterName: "จารย์จานสีเวท",
        type: "wizard",
        desc: "สีส้มแดง (Red-Orange) และ สีฟ้าเขียว (Blue-Green) เมื่อนำมาจัดวางคู่กันในงานศิลปะ ข้อใดถูกต้องที่สุด?",
        tip: "สีส้มแดงเป็นวรรณะอุ่นขั้น 3 ส่วนสีฟ้าเขียวเป็นวรรณะเย็นขั้น 3 เมื่อตัดกันจะสร้างความต่างของอุณหภูมิสีอย่างชัดเจน",
        choices: [
            { text: "สร้างความขัดแย้งของวรรณะสีอุ่นและสีเย็นสมบูรณ์", correct: true },
            { text: "จัดอยู่ในวรรณะสีเย็นทั้งสองสี", correct: false },
            { text: "จัดอยู่ในวรรณะสีอุ่นทั้งสองสี", correct: false }
        ]
    },
    {
        title: "อุณหภูมิสีแสง Kelvin (2700K)",
        monsterName: "อสูรหลอดไส้",
        type: "bulb",
        desc: "หลอดไฟ Warm White มีอุณหภูมิสีแสงที่ 2,700 Kelvin (ออกสีส้มเหลือง) จัดอยู่ในวรรณะสีใด และให้อารมณ์แบบใด?",
        tip: "แสง Kelvin ต่ำ (2,700K - 3,000K) ออกสีส้มเหลือง จัดเป็นวรรณะอุ่น ให้ความรู้สึกผ่อนคลาย อบอุ่น",
        choices: [
            { text: "วรรณะสีเย็น ให้ความรู้สึกตื่นตัว เงียบสงบ", correct: false },
            { text: "วรรณะสีอุ่น ให้ความรู้สึกผ่อนคลาย อบอุ่น", correct: true },
            { text: "เป็นสีไร้วรรณะ (Neutral)", correct: false }
        ]
    },
    {
        title: "อุณหภูมิสีแสง Kelvin (10000K)",
        monsterName: "ค้างคาวครามราตรี",
        type: "bat",
        desc: "แสงท้องฟ้าค่ำคืนที่มีอุณหภูมิแสงสูงถึง 10,000 Kelvin ออกโทนสีฟ้าเข้ม จัดอยู่ในวรรณะสีใด?",
        tip: "ค่า Kelvin ยิ่งสูง (8,000K-10,000K+) แสงจะยิ่งออกโทนฟ้า-น้ำเงิน จัดอยู่ในวรรณะสีเย็น",
        choices: [
            { text: "วรรณะสีเย็น (ให้ความรู้สึกหนาวเย็น ลึกลับ)", correct: true },
            { text: "วรรณะสีอุ่น (ให้ความรู้สึกตื่นเต้น ร้อนแรง)", correct: false },
            { text: "เป็นวรรณะสีอุ่นเพราะค่า Kelvin สูง", correct: false }
        ]
    },
    {
        title: "ปริศนาสีสองวรรณะ",
        monsterName: "พญาเสือเหลืองม่วง",
        type: "tiger",
        desc: "สีใดต่อไปนี้ที่มีคุณสมบัติพิเศษ สามารถเป็นได้ทั้ง 'วรรณะอุ่น' และ 'วรรณะเย็น' ขึ้นอยู่กับสีที่อยู่รอบข้าง?",
        tip: "สีเหลือง และ สีม่วง เป็นสีพิเศษที่อยู่รอยต่อวงล้อสี จึงเปลี่ยนวรรณะได้ตามสีข้างเคียง",
        choices: [
            { text: "สีแดง และ สีน้ำเงิน", correct: false },
            { text: "สีเหลือง และ สีม่วง", correct: true },
            { text: "สีส้ม และ สีเขียว", correct: false }
        ]
    },
    {
        title: "จิตวิทยาห้องนอนผ่อนคลาย",
        monsterName: "หมึกยักษ์ห้วงลึก",
        type: "octopus",
        desc: "หากต้องการออกแบบห้องนอนเพื่อให้ผู้ป่วยรู้สึกสงบ ผ่อนคลาย อัตราการเต้นหัวใจลดลง ควรเลือกใช้วรรณะสีใด?",
        tip: "สีวรรณะเย็น เช่น ฟ้า เขียวพาสเทล ช่วยลดความดันโลหิตและทำให้ระบบประสาทผ่อนคลาย",
        choices: [
            { text: "วรรณะสีเย็น (สีฟ้าอ่อน, สีเขียวพาสเทล)", correct: true },
            { text: "วรรณะสีอุ่น (สีส้มอิฐ, สีชมพูเข้ม)", correct: false },
            { text: "วรรณะสีอุ่น (สีเหลืองสด, สีแดงแสด)", correct: false }
        ]
    },
    {
        title: "ความยาวคลื่นแสง (Physics)",
        monsterName: "มังกรสเปกตรัม",
        type: "dragon",
        desc: "แสงสีแดง (วรรณะอุ่น) มีความยาวคลื่นประมาณ 700nm ส่วนแสงสีน้ำเงิน (วรรณะเย็น) มีความยาวคลื่นประมาณ 400nm ข้อใดถูกต้อง?",
        tip: "สีวรรณะอุ่น (แดง-ส้ม) มีความยาวคลื่นแสงยาวกว่าสีวรรณะเย็น (น้ำเงิน-ม่วง)",
        choices: [
            { text: "สีวรรณะอุ่นมีความยาวคลื่นแสงยาวกว่าวรรณะเย็น", correct: true },
            { text: "สีวรรณะเย็นมีความยาวคลื่นแสงยาวกว่าวรรณะอุ่น", correct: false },
            { text: "แสงทุกวรรณะมีความยาวคลื่นเท่ากัน", correct: false }
        ]
    },
    {
        title: "ความร้อนเปลวไฟเตาแก๊ส",
        monsterName: "วิญญาณไฟฟ้า",
        type: "flame",
        desc: "เปลวไฟสีฟ้าจากเตาแก๊สร้อนกว่าเปลวไฟสีส้มจากกองไม้ ในทางศิลปะเปลวไฟสีฟ้าจัดอยู่ในวรรณะใด?",
        tip: "แม้เปลวไฟสีฟ้าจะร้อนจัดทางฟิสิกส์ แต่ในทางทฤษฎีศิลปะและการมองเห็น สีฟ้าจัดอยู่ในวรรณะสีเย็น",
        choices: [
            { text: "วรรณะสีอุ่น เพราะเป็นไฟที่มีความร้อนสูง", correct: false },
            { text: "วรรณะสีเย็น ตามหลักทฤษฎีสีการมองเห็น", correct: true },
            { text: "ไม่จัดอยู่ในวรรณะสีใดๆ", correct: false }
        ]
    },
    {
        title: "ภาพวาด The Starry Night",
        monsterName: "นกฮูกแวนโก๊ะ",
        type: "owl",
        desc: "ภาพวาดค่ำคืนของแวนโก๊ะใช้สีน้ำเงินคราม 80% ตัดกับสีเหลืองสว่างของดวงดาว ภาพนี้ใช้วรรณะสีอย่างไร?",
        tip: "ภาพนี้เน้นสีน้ำเงิน (วรรณะเย็น) คุมบรรยากาศส่วนใหญ่ และใช้สีเหลือง (วรรณะอุ่น) เน้นดวงดาว",
        choices: [
            { text: "เน้นวรรณะสีเย็นเป็นหลัก และใช้สีอุ่นสร้างจุดสนใจ", correct: true },
            { text: "เน้นวรรณะสีอุ่นกินพื้นที่ 90% ของภาพ", correct: false },
            { text: "ใช้วรรณะสีอุ่นอย่างเดียวโดยไม่มีสีเย็น", correct: false }
        ]
    },
    {
        title: "ปรากฏการณ์แสงเหนือ (Aurora)",
        monsterName: "สโนว์แมนขั้วโลก",
        type: "snowman",
        desc: "แสงเหนือสีเขียวและสีฟ้าพริ้วไหวบนท้องฟ้าขั้วโลกที่หนาวเย็น ถ่ายทอดความรู้สึกตรงกับวรรณะสีใด?",
        tip: "สีเขียวและฟ้าของแสงเหนือ สื่อถึงความเงียบสงบ ลึกลับ และหนาวเย็น จัดเป็นวรรณะสีเย็น",
        choices: [
            { text: "วรรณะสีอุ่น (เร่าร้อน อบอุ่น)", correct: false },
            { text: "วรรณะสีเย็น (สงบ ลึกลับ หนาวเย็น)", correct: true },
            { text: "วรรณะสีอุ่น (สดใส มีพลัง)", correct: false }
        ]
    },
    {
        title: "การผสมสีเขียวเหลือง",
        monsterName: "กบพฤกษา",
        type: "frog",
        desc: "เมื่อผสมสีเขียว (วรรณะเย็น) เข้ากับสีเหลือง ในสัดส่วนที่สีเขียวมากกว่า จนได้ 'สีเขียวเหลือง' จัดเป็นวรรณะใด?",
        tip: "สีเขียวเหลืองที่มีฐานสีเขียวมากกว่า จะหนักไปทางวรรณะสีเย็น ให้ความรู้สึกสดชื่น",
        choices: [
            { text: "ค่อนไปทางวรรณะสีเย็น", correct: true },
            { text: "ค่อนไปทางวรรณะสีอุ่นทันที", correct: false },
            { text: "กลายเป็นสีไร้วรรณะ", correct: false }
        ]
    },
    {
        title: "การออกแบบโลโก้ร้านอาหาร",
        monsterName: "อสูรป้ายไฟ",
        type: "wizard",
        desc: "ร้านอาหารส่วนใหญ่นิยมใช้สีแดง สีส้ม และสีเหลือง ในการตกแต่งและทำโลโก้ เพราะเหตุใด?",
        tip: "สีวรรณะอุ่น เช่น แดง ส้ม เหลือง ช่วยกระตุ้นความอยากอาหาร และสร้างความรู้สึกกระปรี้กระเปร่า",
        choices: [
            { text: "วรรณะสีอุ่นช่วยกระตุ้นความอยากอาหารและดึงดูดสายตา", correct: true },
            { text: "วรรณะสีเย็นช่วยให้ลูกค้าทานอาหารน้อยลง", correct: false },
            { text: "วรรณะสีอุ่นทำให้ร้านดูเงียบสงบสงบใจ", correct: false }
        ]
    },
    {
        title: "อุณหภูมิแสง daylight (6500K)",
        monsterName: "อสูรหลอดฟลูโอเรสเซนต์",
        type: "bulb",
        desc: "แสงแดดตอนเที่ยงวัน (Cool Daylight) มีอุณหภูมิสีประมาณ 6,500K ให้แสงสีขาวอมฟ้า ถือเป็นแสงวรรณะใด?",
        tip: "แสง Daylight ช่วง 6,000K-6,500K ออกโทนขาวอมฟ้า จัดเป็นวรรณะสีเย็น ให้ความรู้สึกตื่นตัว สมจริง",
        choices: [
            { text: "วรรณะสีเย็น (ให้ความรู้สึกตื่นตัว คมชัด)", correct: true },
            { text: "วรรณะสีอุ่น (ให้ความรู้สึกง่วงนอน อบอุ่น)", correct: false },
            { text: "สีวรรณะไร้อุณหภูมิ", correct: false }
        ]
    },
    {
        title: "ภาพวาดตะวันตกดิน (Sunset)",
        monsterName: "วิญญาณสุริยัน",
        type: "flame",
        desc: "ท้องฟ้าช่วงอาทิตย์อัสดงเต็มไปด้วยสีส้ม แดง และแสด บรรยากาศของภาพนี้ถูกควบคุมด้วยวรรณะสีใด?",
        tip: "สีส้ม แดง และแสด เป็นสีหลักในวรรณะสีอุ่น ถ่ายทอดความอบอุ่น ร้อนแรง และโรแมนติก",
        choices: [
            { text: "วรรณะสีอุ่น", correct: true },
            { text: "วรรณะสีเย็น", correct: false },
            { text: "วรรณะสีกลาง (Neutral)", correct: false }
        ]
    },
    {
        title: "สีน้ำเงินม่วง (Blue-Violet)",
        monsterName: "ค้างคาวเงาราตรี",
        type: "bat",
        desc: "สีน้ำเงินม่วง (Blue-Violet) เกิดจากการผสมระหว่างสีน้ำเงินและสีม่วง จัดอยู่ในวรรณะสีใด?",
        tip: "เนื่องจากสีน้ำเงินเป็นวรรณะเย็นบริสุทธิ์ เมื่อผสมกับม่วงจึงจัดอยู่ในวรรณะสีเย็นอย่างชัดเจน",
        choices: [
            { text: "วรรณะสีเย็น", correct: true },
            { text: "วรรณะสีอุ่น", correct: false },
            { text: "ไม่สามารถจัดวรรณะได้", correct: false }
        ]
    },
    {
        title: "การระยะมิติของสี (Spatial effect)",
        monsterName: "มังกรพิกเซล",
        type: "dragon",
        desc: "ในงานจิตรกรรม สีวรรณะใดมีคุณสมบัติพุ่งเข้าหาตา (Advancing Color) ทำให้วัตถุดูใกล้เข้ามา?",
        tip: "สีวรรณะอุ่น (แดง ส้ม เหลือง) เป็น Advancing Color ดูพุ่งเข้าหาตา ส่วนสีวรรณะเย็นจะดูถอยห่างออกไป",
        choices: [
            { text: "สีวรรณะอุ่น", correct: true },
            { text: "สีวรรณะเย็น", correct: false },
            { text: "ทั้งสองวรรณะพุ่งเข้าหาตาเท่ากัน", correct: false }
        ]
    },
    {
        title: "การเลือกโทนสีห้องทำงาน",
        monsterName: "หมึกยักษ์ออฟฟิศ",
        type: "octopus",
        desc: "หากต้องการทาสีห้องทำงานเพื่อให้พนักงานมีสมาธิ และไม่ล้าสายตาจากการมองจอนานๆ ควรใช้วรรณะสีใด?",
        tip: "สีวรรณะเย็น เช่น สีเขียวและสีฟ้าอ่อน ช่วยผ่อนคลายสายตา เพิ่มสมาธิในการทำงาน",
        choices: [
            { text: "วรรณะสีเย็น (เขียวอ่อน, ฟ้าอ่อน)", correct: true },
            { text: "วรรณะสีอุ่น (ส้มสด, แดงสด)", correct: false },
            { text: "วรรณะสีอุ่น (เหลืองมะนาว)", correct: false }
        ]
    },
    {
        title: "การผสมสีม่วงแดง (Red-Violet)",
        monsterName: "พญาเสือม่วงแดง",
        type: "tiger",
        desc: "สีม่วงแดง (Red-Violet) ที่มีสัดส่วนของสีแดงมากกว่าสีน้ำเงิน จัดอยู่ในวรรณะสีใด?",
        tip: "สีม่วงแดงที่มีเนื้อสีแดงเข้มข้นจะหนักไปทางวรรณะสีอุ่น ให้ความรู้สึกหรูหรา และร้อนแรง",
        choices: [
            { text: "วรรณะสีอุ่น", correct: true },
            { text: "วรรณะสีเย็น", correct: false },
            { text: "เป็นสีกลางไม่มีวรรณะ", correct: false }
        ]
    },
    {
        title: "แสงเทียนเล่มน้อย (Candlelight)",
        monsterName: "อสูรเปลวเทียน",
        type: "flame",
        desc: "แสงเทียนส่องสว่างมีอุณหภูมิแสงประมาณ 1,900 Kelvin ให้แสงสีส้มแดง แสงนี้จัดเป็นวรรณะสีใด?",
        tip: "แสงที่มีค่า Kelvin ต่ำมาก (1,500K - 2,000K) จะออกสีส้มแดง จัดเป็นวรรณะสีอุ่น",
        choices: [
            { text: "วรรณะสีอุ่น", correct: true },
            { text: "วรรณะสีเย็น", correct: false },
            { text: "วรรณะสีสะท้อนแสง", correct: false }
        ]
    },
    {
        title: "ความรู้สึกหนาวเย็นในป่าหิมะ",
        monsterName: "สโนว์แมนน้ำแข็ง",
        type: "snowman",
        desc: "การเลือกใช้สีขาวอมฟ้า สีคราม และสีฟ้าคราม ในภาพวาดวิวฤดูหนาว ถ่ายทอดความรู้สึกอย่างไร?",
        tip: "โทนสีฟ้า คราม ขาวอมฟ้า เป็นสีวรรณะเย็น ให้ความรู้สึกหนาวเย็น เยือกเย็น และสงบ",
        choices: [
            { text: "หนาวเย็น เยือกเย็น และโดดเดี่ยว (วรรณะเย็น)", correct: true },
            { text: "อบอุ่น สดใส และมีพลัง (วรรณะอุ่น)", correct: false },
            { text: "กระปรี้กระเปร่าและตื่นเต้น (วรรณะอุ่น)", correct: false }
        ]
    },
    {
        title: "สัดส่วนสี 60-30-10 ในงานออกแบบ",
        monsterName: "จารย์จานสีขั้นสูง",
        type: "wizard",
        desc: "หากออกแบบโปสเตอร์โดยใช้ สีวรรณะเย็น 60% สีวรรณะอุ่น 30% และสีเน้น 10% ผลลัพธ์ภาพรวมจะเป็นอย่างไร?",
        tip: "สีสัดส่วนหลัก 60% จะกำหนดบรรยากาศรวม ภาพนี้จึงมีบรรยากาศหลักเป็นวรรณะเย็น แต่ไม่น่าเบื่อเพราะมีสีอุ่นช่วยเบรก",
        choices: [
            { text: "บรรยากาศหลักเป็นวรรณะเย็น โดยมีสีอุ่นช่วยสร้างจุดสนใจ", correct: true },
            { text: "บรรยากาศหลักกลายเป็นวรรณะอุ่นสมบูรณ์", correct: false },
            { text: "สีทั้งสองวรรณะจะกลืนกันจนมองไม่ออก", correct: false }
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
