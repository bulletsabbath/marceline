module.exports = {
    name: "skip",
    aliases: ["sk"],
    description: "Jump! Land!!! YAYYY YOU LANDED ON THE NEXT SONG!!",
    run: async (client, message) => {
        const { channel } = message.member.voice; 
        const player = client.manager.players.get(message.guild.id);

        if (!player) return message.channel.send("Yoooo there's no queue to skip songs in!");
        if (channel.id !== player.voiceChannel) return message.channel.send("You aren't in the same voice channel as me!");
        await player.stop();
        if (player.queue.size == 1) client.manager.emit("queueEnd", player);
    }
}