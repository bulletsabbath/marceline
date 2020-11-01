const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "nowplaying",
    aliases: ["np", "current"],
    description: "what is this song? i love it!",
    run: (client, message) => {
        const player = client.manager.players.get(message.guild.id);
        const embed = new MessageEmbed()

        if (!player) return message.channel.send("There literally is not player for this guild smh");
        if (!player.playing || player.paused || player.queue.current) return message.channel.send("There is no song playing in this guild!");
        const song = player.queue.current;

        embed
        .setColor("RANDOM")
        .setTitle(`Requested by ${message.author.discriminator}`, message.author.displayAvatarURL())
        .setFooter("ummm, uhm... ASS!!")
        .setDescription(`
            Now playing:\n
            **${song.title}**\n
            Duration (ms): ${song.duration}
        `)
        message.channel.send(embed);
    }
}