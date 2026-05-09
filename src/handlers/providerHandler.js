const { makeEmbed, COLORS, makeProviderButtons } = require('../utils/embeds');
const configService = require('../services/configService');

module.exports = async (interaction) => {
    return interaction.reply({ embeds: [makeEmbed('🌐 Anbieter', `Aktuell: **${configService.provider().name}**`, COLORS.blue)], components: [makeProviderButtons()] });
};