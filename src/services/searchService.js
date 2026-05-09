const { chromium } = require('playwright');
const fetch = require('cross-fetch');
const { PlaywrightBlocker } = require('@ghostery/adblocker-playwright');
const { getBravePath } = require('../utils/browser');

// Cache initialisieren
if (!global.BotState) {
    global.BotState = {};
}

if (!global.BotState.searchCache) {
    global.BotState.searchCache = new Map();
}

if (!global.streamHeaders) {
    global.streamHeaders = {
        userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36'
    };
}

async function searchAniworld(query) {

    const cacheKey = `aniworld:${query.toLowerCase()}`;

    // Cache Check
    if (global.BotState.searchCache.has(cacheKey)) {

        return global.BotState.searchCache.get(cacheKey);
    }

    let browser = null;

    try {

        browser = await chromium.launch({
            executablePath: getBravePath(),
            headless: false,
            args: [
                '--mute-audio',
                '--disable-gpu',
                '--no-sandbox'
            ]
        });

        const ctx = await browser.newContext({
            userAgent: global.streamHeaders.userAgent,
            locale: 'de-DE'
        });

        const page = await ctx.newPage();

        const blocker =
            await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch);

        await blocker.enableBlockingInPage(page);

        const searchUrl =
            `https://aniworld.to/ajax/search?q=${encodeURIComponent(query)}`;

await page.goto(searchUrl, {
    waitUntil: 'networkidle'
});

const response = await page.content();

        await browser.close();
        browser = null;

        let results = [];

        // JSON Versuch
        try {

            const parsed = JSON.parse(response);

            if (Array.isArray(parsed)) {

                results = parsed;

            } else if (parsed.series) {

                results = parsed.series;

            } else if (parsed.animes) {

                results = parsed.animes;

            }

        } catch {

            // HTML Fallback

            const matches =
                response.match(
                    /<a[^>]+href="([^"]*\/anime\/stream\/[^"]+)"[^>]*>([^<]+)</g
                );

            if (matches) {

                results = matches.map((m) => {

                    const href =
                        m.match(/href="([^"]+)"/)?.[1];

                    const title =
                        m.replace(/<[^>]+>/g, '').trim();

                    return {
                        link: href,
                        title
                    };
                });
            }
        }

        // Kein Ergebnis
        if (!results.length) {

            const fallback = {
                url:
                    `https://aniworld.to/anime/stream/${query
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '')}`,

                title: query
            };

            global.BotState.searchCache.set(
                cacheKey,
                fallback
            );

            return fallback;
        }

        // Beste Übereinstimmung suchen

        const words =
            query.toLowerCase().split(/\s+/);

        let best = results[0];

        let bestScore = 0;

        for (const r of results) {

            const title =
                (r.title || r.name || '')
                    .toLowerCase();

            let score = 0;

            for (const word of words) {

                if (title.includes(word)) {

                    score++;
                }
            }

            if (score > bestScore) {

                bestScore = score;
                best = r;
            }
        }

        const result = {

            url:
                best.link?.startsWith('http')
                    ? best.link
                    : `https://aniworld.to${best.link}`,

            title:
                best.title ||
                best.name ||
                query
        };

        // Cache speichern
        global.BotState.searchCache.set(
            cacheKey,
            result
        );

        return result;

    } catch (err) {

        console.error(
            '[AniWorld Search Fehler]',
            err.message
        );

        if (browser) {

            await browser.close()
                .catch(() => {});
        }

        return {

            url:
                `https://aniworld.to/anime/stream/${query
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')}`,

            title: query
        };
    }
}

async function searchAniflix(query) {

    return {

        url:
            `https://aniflix.uno/anime/stream/${query
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')}`,

        title: query
    };
}

module.exports = {

    searchAnime: async (query) => {

        if (!query) {

            return null;
        }

        if (
            global.BotState.currentProvider === 'aniflix'
        ) {

            return searchAniflix(query);
        }

        return searchAniworld(query);
    }
};