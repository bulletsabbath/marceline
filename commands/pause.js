module.exports = {
    name: "pause",
    aliases: ["holup"],
    description: "STOP! WAIT A MINUTE!",
    run: async (client, message) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send("There is no player in this guild!");

        const { channel } = message.member.voice;

        if (!channel) return message.channel.send("You need to be in a voice channel to use this command!");
        if (channel.id == player.voiceChannel.id) return message.channel.send("You need to be in the same voice channel as me!");
        if (player.paused) return message.channel.send("The queue is already paused??");
        
        player.pause(true);
        message.channel.send("Paused the queue.");
    }
}