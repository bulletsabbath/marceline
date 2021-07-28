module.exports = {
    name: "stop",
    aliases: [],
    description: "stops the queue completely and leaves",
    run: async (client, message) => {
        const player = client.manager.get(message.guild.id);
        if (!player) return message.channel.send("There is no player to stop.");

        const { channel } = message.member.voice;
        
        if (!channel) return message.channel.send("You need to join a voice channel!");
        if (channel.id !== player.voiceChannel) return message.channel.send("You are not in the same voice channel as me!");

        player.destroy();
        message.channel.send("Stopped the player and left channel!");
    }
}