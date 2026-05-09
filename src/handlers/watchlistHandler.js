// Dieser Handler war im Original für Watchlist Buttons/Commands gedacht, kann später erweitert werden.
module.exports = async (interaction) => {
    interaction.reply({ content: "Watchlist-Feature in Bearbeitung", ephemeral: true });
};