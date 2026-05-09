const { makeEmbed, COLORS, makeQualityButtons } = require('../utils/embeds');
const QUALITY_PRESETS = require('../config/qualityPresets');
const configService = require('../services/configService');

module.exports = async (interaction) => {
    const q = interaction.options.getString('preset'); 
    if (q) { 
        global.BotState.currentQuality = q; 
        configService.saveConfig({ quality: q }); 
        return interaction.reply(`Qualität: ${QUALITY_PRESETS[q].name}`); 
    } 
    return interaction.reply({ embeds: [makeEmbed('⚙️ Qualität', 'Wähle:', COLORS.blue)], components: [makeQualityButtons()] });
};