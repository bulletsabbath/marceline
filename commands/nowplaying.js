const { MessageEmbed } = require("discord.js");
const ms = require("parse-ms");

module.exports = {
    name: "nowplaying",
    aliases: ["np", "current"],
    description: "what is this song? i love it!",
    run: (client, message) => {
        const player = client.manager.players.get(message.guild.id);
        const embed = new MessageEmbed()

        if (!player) return message.channel.send("There literally is not player for this guild smh");
        if (!player.playing || player.paused || !player.queue.current) return message.channel.send("There is no song playing in this guild!");
        const song = player.queue.current;

        const time = ms(song.duration);
        const duration = `${time.hours ? time.hours > 10 ? time.hours :  `0${time.hours}` : ""}${time.hours ? ":" : ""}${time.minutes ? time.minutes > 10 ? time.minutes : `0${time.minutes}` : "00"}:${time.seconds ? time.seconds > 10 ? time.seconds : `0${time.seconds}` : ""}`

        embed
        .setColor("RANDOM")
        .setTitle(`${song.title}`)
        .setURL(song.uri)
        .setFooter("ummm, uhm... ASS!!")
        .setDescription(`
            Requested by: ${song.requester.tag}\n
            Duration: ${duration}
        `)
        .setThumbnail(song.thumbnail)
        message.channel.send(embed);
    }
}