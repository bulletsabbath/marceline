module.exports = {
    name: "skip",
    aliases: ["sk"],
    description: "skips the current song",
    run: async (client, message) => {
        const { channel } = message.member.voice; 
        const player = client.manager.players.get(message.guild.id);

        if (!player) return message.channel.send("Yoooo there's no queue to skip songs in!");
        if (channel.id !== player.voiceChannel) return message.channel.send("You aren't in the same voice channel as me!");

        if (player.trackRepeat) player.setTrackRepeat(false);
        if (player.queueRepeat) player.setQueueRepeat(false);
        await player.stop();
    }
}