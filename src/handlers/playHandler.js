const searchService = require('../services/searchService');
const scraperService = require('../services/scraperService');
const streamService = require('../services/streamService');
const configService = require('../services/configService');

const {
    makeEmbed,
    COLORS
} = require('../utils/embeds');

module.exports = async (interaction) => {

    const queryOrUrl =
        interaction.options.getString('titel');

    const staffelArg =
        interaction.options.getInteger('staffel');

    const episodeArg =
        interaction.options.getInteger('episode');

    const member =
        interaction.guild?.members?.cache?.get(interaction.user.id) ||
        await interaction.guild?.members
            ?.fetch(interaction.user.id)
            .catch(() => null);

    if (!member?.voice?.channel) {
        return interaction.reply({
            embeds: [
                makeEmbed(
                    '⚠️ Fehler',
                    'Gehe in einen Voice-Channel!',
                    COLORS.red
                )
            ],
            ephemeral: true
        });
    }

    await interaction.deferReply();

    let animeUrl = queryOrUrl;
    let animeTitle = '';

    if (!animeUrl.startsWith('http')) {

        const result =
            await searchService.searchAnime(queryOrUrl);

        if (!result) {
            return interaction.editReply(
                '❌ Nicht gefunden.'
            );
        }

        animeUrl = result.url;
        animeTitle = result.title;
    }

    let staffel = staffelArg || 1;
    let episode = episodeArg || 1;

    if (!animeUrl.includes('/staffel-')) {

        animeUrl =
            configService.provider().episodePath(
                animeUrl.replace(/\/$/, ''),
                staffel,
                episode
            );

    } else {

        const m =
            animeUrl.match(
                /\/staffel-(\d+)\/episode-(\d+)/
            );

        if (m) {
            staffel = parseInt(m[1]);
            episode = parseInt(m[2]);
        }
    }

    await interaction.editReply({
        embeds: [
            makeEmbed(
                '🕵️ Extrahiere...',
                `Suche Video auf **${configService.provider().name}**...`,
                COLORS.teal
            )
        ]
    });

    // HIER GEÄNDERT
    const streamData =
        await scraperService.extractVideoLink(animeUrl);

    if (!streamData) {
        return interaction.editReply(
            '❌ Stream-URL nicht gefunden.'
        );
    }

    console.log(
        '[DEBUG] StreamData:',
        streamData.url
    );

    await interaction.editReply({
        embeds: [
            makeEmbed(
                '🚀 Verbinde...',
                `Starte Stream...`,
                COLORS.blue
            )
        ]
    });

    await streamService.startDiscordStream(
        member.voice.channel,
        streamData,

        {
            edit: (d) =>
                interaction.editReply(d),

            channel: {
                send: (d) =>
                    interaction.channel?.send(d)
            }
        },

        {
            baseUrl:
                animeUrl.replace(
                    /\/staffel-\d+\/episode-\d+$/,
                    ''
                ),

            staffel,
            episode,
            title: animeTitle
        }
    );
};