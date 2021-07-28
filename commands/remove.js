module.exports = {
    name: "remove",
    aliases: ["rm"],
    description: "removes a song from the queue",
    run: async (client, message, args) => {
        //random comment but i keep forgetting to put semi-colons
        //some kotlin problems
        const { channel } = message.channel.voice;
        const player = client.manager.players.get(message.guild.id);
        
        if (!player) return message.channel.send("There is no player in this server.");
        if (!channel || channel.id !== player.voiceChannel) return message.channel.send("We're not in the same voice channel!");
        if (!player.queue) return message.channel.send("There are no songs in the queue");

        if (!args) return message.channel.send("Which song should I remove, though?")

        player.queue.remove(args - 1);
    }
}