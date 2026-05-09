module.exports = {
    formatUptime: (seconds) => { const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = Math.floor(seconds % 60); return `${h}h ${m}m ${s}s`; },
    streamDuration: () => { return !global.BotState.streamStartTime ? '—' : module.exports.formatUptime((Date.now() - global.BotState.streamStartTime) / 1000); }
};