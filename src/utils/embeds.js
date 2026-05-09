const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { COLORS } = require('../config/constants');
const PROVIDERS = require('../config/providers');

const makeEmbed = (title, description, color = 0x5865F2, fields = [], thumbnail = null) => {
    const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color).setTimestamp().setFooter({ text: '🍜 Anime Streamer Bot  •  v2.0', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    if (fields.length) embed.addFields(fields); if (thumbnail) embed.setThumbnail(thumbnail); return embed;
};

module.exports = {
    COLORS, makeEmbed,
    makeStreamButtons: (streaming = true) => new ActionRowBuilder().addComponents( new ButtonBuilder().setCustomId('btn_skip').setLabel('⏭️ Skip').setStyle(ButtonStyle.Primary).setDisabled(!streaming), new ButtonBuilder().setCustomId('btn_stop').setLabel('⏹️ Stop').setStyle(ButtonStyle.Danger).setDisabled(!streaming), new ButtonBuilder().setCustomId('btn_np').setLabel('📺 Info').setStyle(ButtonStyle.Secondary).setDisabled(!streaming), new ButtonBuilder().setCustomId('btn_autoskip').setLabel('🔄 Auto-Skip').setStyle(global.BotState.autoSkipEnabled ? ButtonStyle.Success : ButtonStyle.Secondary)),
    makeQualityButtons: () => new ActionRowBuilder().addComponents( new ButtonBuilder().setCustomId('q_low').setLabel('📺 480p').setStyle(global.BotState.currentQuality === 'low' ? ButtonStyle.Primary : ButtonStyle.Secondary), new ButtonBuilder().setCustomId('q_medium').setLabel('📺 720p').setStyle(global.BotState.currentQuality === 'medium' ? ButtonStyle.Primary : ButtonStyle.Secondary), new ButtonBuilder().setCustomId('q_high').setLabel('📺 1080p').setStyle(global.BotState.currentQuality === 'high' ? ButtonStyle.Primary : ButtonStyle.Secondary), new ButtonBuilder().setCustomId('q_ultra').setLabel('🔥 Ultra').setStyle(global.BotState.currentQuality === 'ultra' ? ButtonStyle.Primary : ButtonStyle.Secondary)),
    makeProviderButtons: () => new ActionRowBuilder().addComponents( new ButtonBuilder().setCustomId('prov_aniworld').setLabel('🌍 AniWorld').setStyle(global.BotState.currentProvider === 'aniworld' ? ButtonStyle.Primary : ButtonStyle.Secondary), new ButtonBuilder().setCustomId('prov_aniflix').setLabel('🎬 Aniflix').setStyle(global.BotState.currentProvider === 'aniflix' ? ButtonStyle.Primary : ButtonStyle.Secondary)),
    makeLangButtons: (provKey) => { const langs = Object.entries(PROVIDERS[provKey].languages); const row = new ActionRowBuilder(); langs.forEach(([key, label]) => { row.addComponents(new ButtonBuilder().setCustomId(`lang_${key}`).setLabel(label).setStyle(global.BotState.currentLanguage === key ? ButtonStyle.Primary : ButtonStyle.Secondary)); }); return row; }
};