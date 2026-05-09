const configService = require('./configService');

module.exports = {
    watchlistAdd: (title) => { 
        if (!global.BotState.watchlist.includes(title)) { global.BotState.watchlist.push(title); configService.saveConfig({ watchlist: global.BotState.watchlist }); return true; } return false; 
    },
    watchlistRemove: (title) => { 
        const before = global.BotState.watchlist.length; global.BotState.watchlist = global.BotState.watchlist.filter(t => t.toLowerCase() !== title.toLowerCase()); configService.saveConfig({ watchlist: global.BotState.watchlist }); return global.BotState.watchlist.length < before; 
    }
};