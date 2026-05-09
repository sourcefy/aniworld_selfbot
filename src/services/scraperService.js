const { chromium } = require('playwright');
const { PlaywrightBlocker } = require('@ghostery/adblocker-playwright');
const fetch = require('cross-fetch');

const { getBravePath } = require('../utils/browser');
const configService = require('./configService');

async function applyAggressiveAdblock(ctx) {
    ctx.on('page', page => {
        page.on('popup', popup => {
            console.log('🛡️ [AdBlock] Popup geblockt & geschlossen');
            popup.close().catch(() => {});
        });
    });

    await ctx.route('**/*', (route) => {
        const req = route.request();
        const url = req.url().toLowerCase();
        const type = req.resourceType();

        if (type === 'image' || type === 'font') {
            return route.abort();
        }

        const blockedDomains = [
            'doubleclick',
            'googlesyndication',
            'adsterra',
            'popads',
            'analytics',
            'tracking',
            'taboola',
            'outbrain',
            'adservice'
        ];

        if (blockedDomains.some(domain => url.includes(domain))) {
            return route.abort();
        }

        return route.continue();
    });
}

const nukeOverlays = () => {
    try {
        window.open = () => null;

        document.querySelectorAll('div').forEach(el => {
            const style = window.getComputedStyle(el);
            const zIndex = parseInt(style.zIndex, 10);

            if (
                zIndex > 50 &&
                style.position === 'absolute' &&
                !String(el.className).includes('plyr') &&
                !String(el.id).includes('vplayer')
            ) {
                el.remove();
            }
        });

        document
            .querySelectorAll('.video-overlay, .jw-overlays')
            .forEach(e => e.remove());

    } catch {}
};

async function resolveMasterM3U8(url) {
    try {
        if (!url.includes('master.m3u8')) {
            return url;
        }

        console.log('[M3U8] Lade Master Playlist...');

        const res = await fetch(url, {
            headers: {
                'User-Agent': global.streamHeaders.userAgent,
                'Referer': 'https://aniworld.to/'
            }
        });

        const text = await res.text();

        const lines = text.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();

            if (
                trimmed &&
                !trimmed.startsWith('#') &&
                trimmed.includes('.m3u8')
            ) {
                const finalUrl = new URL(trimmed, url).href;

                console.log('[M3U8] Variant gefunden:', finalUrl);

                return finalUrl;
            }
        }

        return url;

    } catch (err) {
        console.log('[M3U8] Fehler:', err.message);
        return url;
    }
}

async function extractVideoLinkAniworld(aniworldUrl) {
    console.log('[AniWorld] Starte Scraper...');

    let directVideoUrl = null;
    let browser = null;

    try {
        browser = await chromium.launch({
            executablePath: getBravePath(),
            headless: false,
            args: [
                '--mute-audio',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-popup-blocking',
                '--disable-gpu'
            ]
        });

        global.BotState.currentBrowser = browser;

        const ctx = await browser.newContext({
            viewport: {
                width: 1920,
                height: 1080
            },
            locale: 'de-DE',
            bypassCSP: true,
            userAgent: global.streamHeaders.userAgent
        });

        await applyAggressiveAdblock(ctx);

        const blocker =
            await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch);

        function attachSniffer(page) {

            const isVideo = (url) => {
                if (!url) return false;

                const u = url.toLowerCase();

                const blacklist = [
                    '.gif',
                    '.jpg',
                    '.png',
                    '.jpeg',
                    '.webp',
                    '.svg',
                    'blank',
                    'vtt',
                    'banner',
                    'tracker',
                    'analytics',
                    'adsterra',
                    'popads',
                    'notification',
                    'advert',
                    'ads',
                    'vast',
                    'vmap',
                    'preroll',
                    'sponsor',
                    'click',
                    'promo'
                ];

                if (blacklist.some(word => u.includes(word))) {
                    return false;
                }

                return (
                    u.includes('.m3u8') ||
                    u.includes('/hls') ||
                    u.includes('master.m3u8')
                );
            };

            page.on('request', (req) => {
                try {
                    const url = req.url();

                    if (!directVideoUrl && isVideo(url)) {
                        directVideoUrl = url;

                        console.log(
                            '🎥 STREAM GEFUNDEN (Request):',
                            url.split('?')[0]
                        );
                    }

                } catch {}
            });

            page.on('response', async (res) => {
                try {
                    const url = res.url();

                    const ct =
                        res.headers()['content-type'] || '';

                    if (
                        !directVideoUrl &&
                        (
                            ct.includes('mpegurl') ||
                            ct.includes('video') ||
                            isVideo(url)
                        )
                    ) {
                        directVideoUrl = url;

                        console.log(
                            '🎥 STREAM GEFUNDEN (Response):',
                            url.split('?')[0]
                        );
                    }

                } catch {}
            });
        }

        async function closeExtraPages(activePage) {
            const pages = ctx.pages();

            for (const p of pages) {
                if (p !== page && p !== activePage) {
                    console.log('🛡️ [AdBlock] Ad-Tab geschlossen');
                    await p.close().catch(() => {});
                }
            }
        }

        async function clickPlayUntilStream(hosterPage) {
            console.log('[Hoster] Klicke Play bis der echte Stream kommt...');

            const playSelectors = [
                '.plyr__control--overlaid',
                '.plyr__control[data-plyr="play"]',
                '.vjs-big-play-button',
                '.jw-icon-playback',
                '.jw-display-icon-container',
                '.jwplayer',
                '#vplayer',
                '#voe-player',
                'button[aria-label*="Play"]',
                'button[title*="Play"]',
                'button',
                'video'
            ];

            for (let attempt = 1; attempt <= 5; attempt++) {
                if (directVideoUrl) {
                    await closeExtraPages(hosterPage);
                    return true;
                }

                console.log(`[Hoster] Play-Klick Versuch ${attempt}/5`);

                await closeExtraPages(hosterPage);

                await hosterPage.evaluate(nukeOverlays)
                    .catch(() => {});

                for (const sel of playSelectors) {
                    if (directVideoUrl) {
                        await closeExtraPages(hosterPage);
                        return true;
                    }

                    try {
                        const elements = await hosterPage.$$(sel);

                        for (const el of elements) {
                            if (directVideoUrl) {
                                await closeExtraPages(hosterPage);
                                return true;
                            }

                            if (await el.isVisible().catch(() => false)) {
                                await el.click({
                                    force: true,
                                    timeout: 1000
                                }).catch(() => {});

                                await hosterPage.waitForTimeout(700);
                                await closeExtraPages(hosterPage);
                            }
                        }
                    } catch {}
                }

                await hosterPage.mouse.click(960, 540)
                    .catch(() => {});

                await hosterPage.waitForTimeout(1200);
            }

            return Boolean(directVideoUrl);
        }

        const page = await ctx.newPage();

        await blocker.enableBlockingInPage(page);

        attachSniffer(page);

        await page.goto(aniworldUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 45000
        }).catch(() => {});

        await page.waitForTimeout(5000);

        const providerConfig = configService.provider();

        for (const hoster of providerConfig.hosters) {

            console.log(`🎯 Prüfe Hoster: ${hoster}`);

            const clicked = await page.evaluate((h) => {

                const links = Array.from(
                    document.querySelectorAll('a, li')
                );

                const target = links.find(l =>
                    (l.innerText || '')
                        .toLowerCase()
                        .includes(h)
                );

                if (target) {
                    target.click();
                    return true;
                }

                return false;

            }, hoster.toLowerCase());

            if (!clicked) {
                continue;
            }

            await page.waitForTimeout(4000);

            const redirectUrl = await page.evaluate((hName) => {

                const a = Array.from(
                    document.querySelectorAll('a[href*="/redirect/"]')
                ).find(l =>
                    l.innerHTML.toLowerCase().includes(hName) ||
                    l.closest('li')?.innerHTML
                        .toLowerCase()
                        .includes(hName)
                );

                return a
                    ? a.href
                    : document.querySelector('a.watchEpisode')?.href;

            }, hoster.toLowerCase()).catch(() => null);

            if (!redirectUrl) {
                continue;
            }

            const hosterPage = await ctx.newPage();

            attachSniffer(hosterPage);

            await blocker.enableBlockingInPage(hosterPage);

            await hosterPage.goto(redirectUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            }).catch(() => {});

            console.log('[Hoster] Seite geladen...');

            await hosterPage.waitForTimeout(4000);

            const iframeSrc = await hosterPage.evaluate(() => {
                const iframe = document.querySelector('iframe');
                return iframe ? iframe.src : null;
            });

            if (
                iframeSrc &&
                iframeSrc.startsWith('http')
            ) {
                console.log(
                    `[Hoster] Iframe gefunden: ${iframeSrc}`
                );

                await hosterPage.goto(iframeSrc, {
                    waitUntil: 'domcontentloaded',
                    timeout: 30000
                }).catch(() => {});

                await hosterPage.waitForTimeout(3000);
            }

            await hosterPage.evaluate(nukeOverlays)
                .catch(() => {});

            if (directVideoUrl) {
                break;
            }

            await clickPlayUntilStream(hosterPage);

            console.log('[Hoster] Warte auf Netzwerk-Stream...');

            for (let i = 0; i < 20; i++) {

                if (directVideoUrl) {
                    break;
                }

                await hosterPage.waitForTimeout(1000);
            }

            if (directVideoUrl) {
                break;
            }
        }

        if (directVideoUrl) {

            directVideoUrl =
                await resolveMasterM3U8(directVideoUrl);

            console.log(
                '[DEBUG] Final Stream URL:',
                directVideoUrl
            );

            return {
                url: directVideoUrl,

                headers: {
                    Referer: 'https://aniworld.to/',
                    'User-Agent': global.streamHeaders.userAgent
                },

                ffmpegOptions: {
                    '-reconnect': '1',
                    '-reconnect_streamed': '1',
                    '-reconnect_delay_max': '5',
                    '-analyzeduration': '10M',
                    '-probesize': '10M'
                },

                browser,
                context: ctx
            };
        }

        return null;

    } catch (err) {

        console.error(
            '[AniWorld Scraper Error]',
            err
        );

        if (browser) {
            await browser.close().catch(() => {});
        }

        return null;
    }
}

module.exports = {
    extractVideoLink: async (url) => {
        return extractVideoLinkAniworld(url);
    }
};