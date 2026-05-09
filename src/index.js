// ─────────────────────────────────────────────────────────────
// REQUIREMENTS CHECK & AUTO-INSTALL
// ─────────────────────────────────────────────────────────────

const { execSync, exec } = require('child_process');

const REQUIRED_PACKAGES = [
    'discord.js-selfbot-v13',
    '@dank074/discord-video-stream',
    'discord.js',
    'playwright',
    '@ghostery/adblocker-playwright',
    'cross-fetch',
    'ffmpeg-static',
    'dotenv'
];

function checkAndInstall() {

    const missing = [];

    for (const pkg of REQUIRED_PACKAGES) {

        try {

            require.resolve(pkg);

        } catch {

            missing.push(pkg);
        }
    }

    if (missing.length > 0) {

        console.log(
            `\n📦 Installation von ${missing.length} Modul(en): ${missing.join(', ')}`
        );

        try {

            execSync(
                `npm install ${missing.join(' ')} --save --loglevel=error --no-audit --no-fund`,
                {
                    stdio: 'inherit'
                }
            );

        } catch (err) {

            console.error('❌ Fehler beim Installieren');

            process.exit(1);
        }
    }

    console.clear();

    process.stdout.write('\x1Bc');

    const devInfo = [
        ' ',
        '🚀 Reborn v0.1.0 bereit!',
        '─────────────────────────────────────────────────',
        '👤 Entwickler: @Sourcefy',
        '💬 Discord: discord.gg/vB6exQrT2Q',
        '🌐 Status: System Online',
        '─────────────────────────────────────────────────',
        ' '
    ];

    devInfo.forEach((line, i) => {

        setTimeout(() => {

            console.log(`\x1b[1;97m${line}\x1b[0m`);

        }, i * 150);
    });

    setTimeout(() => {

        const discordUrl =
            'https://discord.gg/vB6exQrT2Q';

        const command =
            process.platform === 'win32'
                ? `start ${discordUrl}`
                : process.platform === 'darwin'
                ? `open ${discordUrl}`
                : `xdg-open ${discordUrl}`;

        exec(command, (error) => {

            if (error) {

                console.log('Discord Link konnte nicht geöffnet werden');
            }
        });

    }, 2000);
}

checkAndInstall();

// ─────────────────────────────────────────────────────────────
// INITIALISIERUNG
// ─────────────────────────────────────────────────────────────

const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', 'config.env')
});

process.env.FFMPEG_PATH =
    require('ffmpeg-static');

if (!globalThis.WebSocket) {
    globalThis.WebSocket = require('ws');
}

const {
    Client
} = require('discord.js-selfbot-v13');

const {
    Client: NormalClient,
    GatewayIntentBits
} = require('discord.js');

const {
    Streamer
} = require('@dank074/discord-video-stream');

const configService =
    require('./services/configService');

const {
    initInterceptor
} = require('./utils/ffmpeg');

const {
    closeBrowser
} = require('./utils/browser');

// Events

const readyEvent =
    require('./events/ready');

const interactionCreateEvent =
    require('./events/messageCreate');

// Global State

global.BotState = {

    isStreaming: false,

    currentBrowser: null,

    selfbotClient: null,

    normalBot: null,

    streamer: null,

    currentLanguage: 'ger_sub',

    currentProvider: 'aniworld',

    searchCache: new Map()
};

global.streamHeaders = {

    userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',

    referer: ''
};

// FFMPEG Interceptor

initInterceptor();

// Clients

const selfbotClient = new Client();

const normalBot = new NormalClient({

    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const streamer =
    new Streamer(selfbotClient);

// State speichern

global.BotState.selfbotClient =
    selfbotClient;

global.BotState.normalBot =
    normalBot;

global.BotState.streamer =
    streamer;

// Events

normalBot.once(
    'clientReady',
    () => readyEvent(normalBot)
);

selfbotClient.on('ready', () => {

    console.log(
        `\x1b[36m[ 🤖 ] Selfbot verbunden: ${selfbotClient.user.tag}\x1b[0m`
    );
});

normalBot.on(
    'interactionCreate',
    interactionCreateEvent
);

// Cleanup

setInterval(async () => {

    if (global.gc) {

        global.gc();
    }

    if (
        !global.BotState.isStreaming &&
        global.BotState.currentBrowser
    ) {

        await closeBrowser();
    }

}, 300000);

// ENV CHECK

if (!process.env.SELFBOT_TOKEN) {

    console.error(
        '❌ SELFBOT_TOKEN fehlt!'
    );

    process.exit(1);
}

if (!process.env.BOT_TOKEN) {

    console.error(
        '❌ BOT_TOKEN fehlt!'
    );

    process.exit(1);
}
// LOGIN

selfbotClient
    .login(process.env.SELFBOT_TOKEN)
    .then(() => {

        console.log('✅ Selfbot Login erfolgreich');

    })
    .catch((err) => {

        console.error('❌ Selfbot Fehler:');
        console.error(err);

    });

normalBot
    .login(process.env.BOT_TOKEN)
    .then(() => {

        console.log('✅ NormalBot Login erfolgreich');

    })
    .catch((err) => {

        console.error('❌ NormalBot Fehler:');
        console.error(err);

    });