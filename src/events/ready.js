const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const slashCommands = [
    new SlashCommandBuilder().setName('play').setDescription('🎬 Anime suchen und streamen').addStringOption(o => o.setName('titel').setDescription('Titel').setRequired(true)).addIntegerOption(o => o.setName('staffel').setDescription('Staffel').setRequired(false)).addIntegerOption(o => o.setName('episode').setDescription('Episode').setRequired(false)),
    new SlashCommandBuilder().setName('stop').setDescription('⏹️ Stream beenden'),
    new SlashCommandBuilder().setName('skip').setDescription('⏭️ Zur nächsten Episode'),
    new SlashCommandBuilder().setName('np').setDescription('📺 Aktuelle Episode'),
    new SlashCommandBuilder().setName('quality').setDescription('⚙️ Qualität').addStringOption(o => o.setName('preset').setDescription('Preset').setRequired(false).addChoices({ name: '480p', value: 'low' }, { name: '720p', value: 'medium' }, { name: '1080p', value: 'high' })),
    new SlashCommandBuilder().setName('provider').setDescription('🌐 Anbieter wechseln'),
    new SlashCommandBuilder().setName('autoskip').setDescription('🔄 Auto-Skip umschalten'),
    new SlashCommandBuilder().setName('stats').setDescription('📊 Statistiken')
].map(cmd => cmd.toJSON());

module.exports = async (normalBot) => {
    console.log(`\x1b[38;5;93m  [ ⚙️ ] \x1b[1;97mNormalBot verbunden:\x1b[0m \x1b[32m${normalBot.user.tag}\x1b[0m`);
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    try { await rest.put(Routes.applicationCommands(normalBot.user.id), { body: slashCommands }); } catch {}
};