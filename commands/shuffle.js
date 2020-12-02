module.exports = {
    name: "shuffle",
    aliases: [],
    description: "shuffle the current queue",
    run: async (client, message) => {
        const { channel } = message.member.voice;
        const player = client.manager.players.get(message.guild.id);

        if (!player || !player.queue) return message.channel.send("There is no queue to shuffle!");
        if (channel.id !== player.voiceChannel) return message.channel.send("Are you sure you and I are in the same voice channel?");
        if (player.queue.length < 3) return message.channel.send("There isn't enough songs to shuffle!");

        await player.queue.shuffle();
        message.channel.send("Shuffled the queue!");
    }
}