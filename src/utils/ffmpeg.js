const cp = require('child_process');

module.exports = {
    initInterceptor: () => {
        const originalSpawn = cp.spawn;
        cp.spawn = function (cmd, args, opts) {
            const isFFmpeg = cmd === process.env.FFMPEG_PATH || (typeof cmd === 'string' && cmd.includes('ffmpeg'));
            if (isFFmpeg) {
                const idx = args.indexOf('-i');
                if (idx !== -1 && args[idx + 1] === 'pipe:0') {
                    if (typeof args[idx + 1] === 'string' && args[idx + 1].startsWith('pipe:') && global.currentStreamUrl) {
                        args[idx + 1] = global.currentStreamUrl;
                    }
                    args.splice(idx, 0,
                        '-allowed_extensions', 'ALL',
                        '-protocol_whitelist', 'file,http,https,tcp,tls,crypto',
                        '-user_agent',        global.streamHeaders.userAgent,
                        '-headers',           `Referer: ${global.streamHeaders.referer}\r\nCookie: ${global.streamHeaders.cookie || ''}\r\n`,
                        '-reconnect',         '1',
                        '-reconnect_streamed','1',
                        '-reconnect_delay_max','5'
                    );
                }
            }
            const proc = originalSpawn.apply(this, [cmd, args, opts]);
            if (isFFmpeg && proc.stderr) {
                proc.stderr.on('data', d => {
                    const m = d.toString();
                    if (/(error|invalid|403|failed|segment)/i.test(m)) console.error('🔴 [FFmpeg]', m.trim().slice(0, 200));
                });
            }
            return proc;
        };
    }
};