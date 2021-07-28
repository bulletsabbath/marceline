module.exports = {
    name: "disconnect",
    aliases: ["dc", "leave"],
    description: "let me leave!!!!!!",
    run: async (client, message) => {
        const { channel } = message.member.voice;
        const player = client.manager.players.get(message.guild.id);

        if (!player) return message.channel.send("There is no player to disconnect smh");
        if (channel.id !== player.voiceChannel) return message.channel.send("Are you sure you and I are in the same voice channel?");

        await player.destroy();
        message.channel.send("Disconnected.");
    }
}