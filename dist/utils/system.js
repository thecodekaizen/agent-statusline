import * as os from 'node:os';
export function getSystemMemoryInfo() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const totalGb = +(total / (1024 ** 3)).toFixed(1);
    const usedGb = +(used / (1024 ** 3)).toFixed(1);
    const percent = Math.round((used / total) * 100);
    return { usedGb, totalGb, percent };
}
export function renderProgressBar(percent, width = 8) {
    const clamped = Math.max(0, Math.min(100, percent));
    const filled = Math.round((clamped / 100) * width);
    const empty = width - filled;
    const barChars = {
        full: '█',
        empty: '░'
    };
    return `${barChars.full.repeat(filled)}${barChars.empty.repeat(empty)}`;
}
//# sourceMappingURL=system.js.map