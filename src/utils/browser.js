const fs = require('fs');

module.exports = {
    getBravePath: () => {
        const paths = ['/usr/bin/brave-browser', 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'];
        return paths.find(p => fs.existsSync(p));
    },
    closeBrowser: async () => { 
        if (global.BotState.currentBrowser) { await global.BotState.currentBrowser.close().catch(() => {}); global.BotState.currentBrowser = null; } 
    }
};