const { makeEmbed, COLORS, makeProviderButtons } = require('../utils/embeds');
const { formatUptime } = require('../utils/formatters');
const configService = require('../services/configService');
const { stopStream } = require('../services/streamService');
const PROVIDERS = require('../config/providers');

const playHandler = require('../handlers/playHandler');
const providerHandler = require('../handlers/providerHandler');
const qualityHandler = require('../handlers/qualityHandler');

module.exports = async (interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isButton()) return;
    
    // --- BUTTONS ---
    if (interaction.isButton()) {
        const id = interaction.customId;
        if (id === 'btn_stop') { await interaction.deferUpdate(); await stopStream(); return interaction.editReply({ embeds: [makeEmbed('⏹️ Gestoppt', 'Stream beendet.', COLORS.red)], components: [] }); }
        if (id === 'btn_skip') { await interaction.deferUpdate(); global.BotState.skipRequested = true; try { global.BotState.activeUdp?.mediaConnection?.setSpeaking(false); global.BotState.activeUdp?.mediaConnection?.setVideoStatus(false); } catch {} return interaction.followUp({ embeds: [makeEmbed('⏭️ Skip!', 'Überspringe...', COLORS.blue)], ephemeral: true }); }
        if (id === 'btn_autoskip') { await interaction.deferUpdate(); global.BotState.autoSkipEnabled = !global.BotState.autoSkipEnabled; configService.saveConfig({ autoSkip: global.BotState.autoSkipEnabled }); return interaction.followUp({ embeds: [makeEmbed('🔄 Auto-Skip', `Auto-Skip: **${global.BotState.autoSkipEnabled ? '✅ AN' : '❌ AUS'}**`, COLORS.blue)], ephemeral: true }); }
        if (id.startsWith('prov_')) { const prov = id.replace('prov_', ''); global.BotState.currentProvider = prov; configService.saveConfig({ provider: global.BotState.currentProvider }); return interaction.update({ embeds: [makeEmbed('✅ Anbieter', `Neu: **${PROVIDERS[prov].name}**`, COLORS.green)], components: [makeProviderButtons()] }); }
        return;
    }

    // --- SLASH COMMANDS ---
    const { commandName } = interaction;
    if (commandName === 'stop') { await stopStream(); return interaction.reply({ embeds: [makeEmbed('⏹️ Stream beendet', 'Gestoppt.', COLORS.red)] }); }
    if (commandName === 'skip') { global.BotState.skipRequested = true; try { global.BotState.activeUdp?.mediaConnection?.setSpeaking(false); global.BotState.activeUdp?.mediaConnection?.setVideoStatus(false); } catch {} return interaction.reply({ embeds: [makeEmbed('⏭️ Skip!', 'Überspringe...', COLORS.blue)] }); }
    if (commandName === 'autoskip') { global.BotState.autoSkipEnabled = !global.BotState.autoSkipEnabled; configService.saveConfig({ autoSkip: global.BotState.autoSkipEnabled }); return interaction.reply({ embeds: [makeEmbed('🔄 Auto-Skip', `Ist jetzt: **${global.BotState.autoSkipEnabled ? '✅ AN' : '❌ AUS'}**`, COLORS.blue)] }); }
    if (commandName === 'stats') { return interaction.reply({ embeds: [makeEmbed('📊 Stats', `Streams: ${global.BotState.totalStreams} | Skips: ${global.BotState.totalSkips} | Uptime: ${formatUptime(process.uptime())}`, COLORS.blue)] }); }
    if (commandName === 'provider') { return providerHandler(interaction); }
    if (commandName === 'quality') { return qualityHandler(interaction); }
    if (commandName === 'play') { return playHandler(interaction); }
};