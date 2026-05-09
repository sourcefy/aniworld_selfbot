const fs = require('fs');
const path = require('path');
const PROVIDERS = require('../config/providers');

const CONFIG_FILE = path.join(__dirname, '..', '..', 'bot_config.json');

function loadConfig() { 
    try { if (fs.existsSync(CONFIG_FILE)) return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')); } catch {} 
    return {}; 
}
function saveConfig(data) { 
    try { const current = loadConfig(); fs.writeFileSync(CONFIG_FILE, JSON.stringify({ ...current, ...data }, null, 2)); } catch {} 
}

const savedConfig = loadConfig();

// Globaler State für alle Module
global.BotState = {
    currentQuality: savedConfig.quality || 'high',
    currentProvider: savedConfig.provider || 'aniworld',
    currentLanguage: savedConfig.language || 'ger_sub',
    autoSkipEnabled: savedConfig.autoSkip || false,
    currentBrowser: null, activeUdp: null, activeGuildId: null,
    isStreaming: false, skipRequested: false, currentEpisodeInfo: null,
    searchCache: new Map(), watchlist: savedConfig.watchlist || [],
    streamStartTime: null, activeStatusMsg: null,
    premiumUsers: savedConfig.premiumUsers || [],
    totalStreams: savedConfig.totalStreams || 0,
    totalSkips: savedConfig.totalSkips || 0,
    selfbotClient: null, normalBot: null, streamer: null
};

global.streamHeaders = { 
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', 
    referer: 'https://aniworld.to/', cookie: '' 
};
global.currentStreamUrl = null;

module.exports = {
    loadConfig, saveConfig,
    provider: () => PROVIDERS[global.BotState.currentProvider],
    langLabel: () => PROVIDERS[global.BotState.currentProvider].languages[global.BotState.currentLanguage] || global.BotState.currentLanguage,
    isPremium: (userId) => global.BotState.premiumUsers.includes(userId),
    addPremium: (userId) => { if (!module.exports.isPremium(userId)) { global.BotState.premiumUsers.push(userId); saveConfig({ premiumUsers: global.BotState.premiumUsers }); return true; } return false; },
    removePremium: (userId) => { const before = global.BotState.premiumUsers.length; global.BotState.premiumUsers = global.BotState.premiumUsers.filter(id => id !== userId); saveConfig({ premiumUsers: global.BotState.premiumUsers }); return global.BotState.premiumUsers.length < before; }
};