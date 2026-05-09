const { playStream, prepareStream } = require('@dank074/discord-video-stream');

const QUALITY_PRESETS = require('../config/qualityPresets');
const configService = require('./configService');
const embeds = require('../utils/embeds');

function getNextEpisode() {

    if (!global.BotState.currentEpisodeInfo) {
        return null;
    }

    return {
        ...global.BotState.currentEpisodeInfo,
        episode:
            global.BotState.currentEpisodeInfo
                .episode + 1
    };
}

async function handleNextEpisode(
    voiceChannel,
    statusMsg,
    nextInfo
) {

    console.log(
        `[Auto-Skip] Folge ${nextInfo.episode}`
    );
}

async function stopStream() {

    global.BotState.isStreaming = false;

    global.BotState.skipRequested = false;

    global.BotState.streamStartTime = null;

    if (global.BotState.ffmpegProcess) {

        try {
            global.BotState.ffmpegProcess.kill(
                'SIGKILL'
            );
        } catch {}

        global.BotState.ffmpegProcess = null;
    }

    if (global.BotState.activeUdp) {

        try {

            global.BotState.activeUdp
                .mediaConnection
                .setSpeaking(false);

            global.BotState.activeUdp
                .mediaConnection
                .setVideoStatus(false);

        } catch {}

        global.BotState.activeUdp = null;
    }

    if (global.BotState.activeGuildId) {

        try {

            global.BotState.streamer.leaveVoice(
                global.BotState.activeGuildId
            );

        } catch {}

        global.BotState.activeGuildId = null;
    }
}

async function inviteSelfAccount(
    guildId,
    channelId
) {

    try {

        if (!global.BotState.selfbotClient) {
            return false;
        }

        const guild =
            global.BotState.selfbotClient
                .guilds.cache.get(guildId);

        if (!guild) {
            return false;
        }

        const channel =
            guild.channels.cache.get(channelId);

        if (!channel) {
            return false;
        }

        const selfMember =
            guild.members.cache.get(
                global.BotState.selfbotClient.user.id
            );

        if (
            selfMember?.voice?.channelId ===
            channelId
        ) {
            return true;
        }

        global.BotState.activeUdp =
            await global.BotState.streamer
                .joinVoice(
                    guildId,
                    channelId
                );

        global.BotState.activeGuildId =
            guildId;

        console.log(
            `[Invite] Selfbot ist "${channel.name}" beigetreten`
        );

        return true;

    } catch (err) {

        console.error(
            '[Invite ❌]',
            err.message
        );

        return false;
    }
}

async function startDiscordStream(
    voiceChannel,
    streamData,
    statusMsg,
    episodeInfo = null,
    retryCount = 0
) {

    const MAX_RETRIES = 3;

    try {

        if (!streamData?.url) {
            throw new Error(
                'Keine Stream URL vorhanden'
            );
        }

        global.currentStreamUrl =
            streamData.url;

        global.BotState.currentEpisodeInfo =
            episodeInfo;

        global.BotState.activeStatusMsg =
            statusMsg;

        await inviteSelfAccount(
            voiceChannel.guild.id,
            voiceChannel.id
        );

        const guild =
            global.BotState.selfbotClient
                .guilds.cache.get(
                    voiceChannel.guild.id
                );

        const vc =
            guild.channels.cache.get(
                voiceChannel.id
            );

        global.BotState.activeGuildId =
            guild.id;

        if (!global.BotState.activeUdp) {

            global.BotState.activeUdp =
                await global.BotState.streamer
                    .joinVoice(
                        guild.id,
                        vc.id
                    );
        }

        const q =
            QUALITY_PRESETS[
                global.BotState.currentQuality
            ] ||
            QUALITY_PRESETS.high;

        console.log(
            '[DEBUG] STREAM:',
            streamData.url
        );

        const preparedStream = prepareStream(
            streamData.url,
            {
                width: q.width,
                height: q.height,
                frameRate: q.frameRate,
                videoCodec: 'H264',
                bitrateVideo: q.bitrateVideo,
                bitrateVideoMax: q.bitrateVideoMax,
                bitrateAudio: q.bitrateAudio,
                includeAudio: true,
                minimizeLatency: true,
                customHeaders: {
                    'User-Agent': streamData.headers['User-Agent'],
                    Referer: streamData.headers.Referer
                },
                customInputOptions: [
                    '-allowed_extensions', 'ALL',
                    '-protocol_whitelist', 'file,http,https,tcp,tls,crypto',
                    '-reconnect', '1',
                    '-reconnect_streamed', '1',
                    '-reconnect_delay_max', '5',
                    '-analyzeduration', '10M',
                    '-probesize', '10M'
                ]
            }
        );

        const mediaStream =
            preparedStream.output || preparedStream.stream || preparedStream;

        global.BotState.isStreaming =
            true;

        global.BotState.skipRequested =
            false;

        global.BotState.streamStartTime =
            Date.now();

        global.BotState.totalStreams++;

        configService.saveConfig({
            totalStreams:
                global.BotState.totalStreams
        });

        const prov =
            configService.provider();

        const epText =
            episodeInfo
                ? ` — S${episodeInfo.staffel}E${episodeInfo.episode}`
                : '';

        if (statusMsg?.edit) {

            await statusMsg.edit({

                embeds: [
                    embeds.makeEmbed(

                        `${prov.icon} Stream läuft! 🔴`,

                        `**${episodeInfo?.title || 'Anime'}**${epText}

📺 ${q.width}x${q.height}@${q.frameRate}fps
🎵 ${q.bitrateAudio}kbps
📡 ${q.bitrateVideo}kbps

🌐 ${prov.name}

👁️ Zuschauer beitreten 🍿`,

                        embeds.COLORS.green
                    )
                ],

                components: [
                    embeds.makeStreamButtons(true)
                ]
            }).catch(() => {});
        }

        await playStream(
            mediaStream,
            global.BotState.streamer,
            {
                type: 'go-live',
                format: 'nut',
                width: q.width,
                height: q.height,
                frameRate: q.frameRate
            }
        );

        if (
            global.BotState.skipRequested
        ) {

            global.BotState.skipRequested =
                false;

            global.BotState.totalSkips++;

            configService.saveConfig({
                totalSkips:
                    global.BotState.totalSkips
            });

            const next =
                getNextEpisode();

            if (next) {

                return await handleNextEpisode(
                    voiceChannel,
                    statusMsg,
                    next
                );
            }
        }

        if (
            global.BotState.autoSkipEnabled &&
            global.BotState.currentEpisodeInfo
        ) {

            const next =
                getNextEpisode();

            if (next) {

                return await handleNextEpisode(
                    voiceChannel,
                    statusMsg,
                    next
                );
            }
        }

        if (
            statusMsg?.channel?.send
        ) {

            await statusMsg.channel.send({

                embeds: [
                    embeds.makeEmbed(
                        '✅ Episode fertig',
                        'Die Episode ist beendet.',
                        embeds.COLORS.teal
                    )
                ],

                components: [
                    embeds.makeStreamButtons(false)
                ]
            }).catch(() => {});
        }

        await stopStream();

    } catch (err) {

        console.error(
            '[Stream ❌]',
            err
        );

        if (
            retryCount < MAX_RETRIES
        ) {

            console.log(
                `[Retry ${retryCount + 1}/${MAX_RETRIES}]`
            );

            await stopStream();

            await new Promise(
                r => setTimeout(r, 5000)
            );

            return startDiscordStream(
                voiceChannel,
                streamData,
                statusMsg,
                episodeInfo,
                retryCount + 1
            );
        }

        if (statusMsg?.edit) {

            await statusMsg.edit({

                embeds: [
                    embeds.makeEmbed(
                        '❌ Stream Fehler',
                        err.message ||
                        'Unbekannter Fehler',
                        embeds.COLORS.red
                    )
                ],

                components: []
            }).catch(() => {});
        }

        await stopStream();
    }
}

module.exports = {
    startDiscordStream,
    stopStream,
    inviteSelfAccount
};