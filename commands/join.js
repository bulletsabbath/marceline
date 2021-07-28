module.exports = {
    name: "join",
    aliases: ["summon", "j", "sm"],
    description: "Join the voice channel you're in",
    run: async (client, message) => {
        const { channel } = message.member.voice;

        if (!channel) return message.channel.send("You need to be in a voice channel to use this command!");

        const player = client.manager.create({
            guild: message.guild.id,
            textChannel: message.channel.id,
            voiceChannel: channel.id,
        })

        if (player.state === "CONNECTED" && player.voiceChannel === channel.id) return message.channel.send("The bot is already in the channel you are in.");

        if (player.state !== "CONNECTED") player.connect();
        if (player.state === "CONNECTED" && player.voiceChannel !== channel.id) {
            player.voiceChannel = channel.id;
            player.connect();
        }
    }
}