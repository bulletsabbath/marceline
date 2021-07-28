const { MessageEmbed } = require("discord.js");
const { percentage } = require("../utils/functions.js");
const ms = require("parse-ms");

module.exports = {
    name: "nowplaying",
    aliases: ["np", "current"],
    description: "shows what is currently playing!",
    run: (client, message) => {
        const player = client.manager.players.get(message.guild.id);
        const embed = new MessageEmbed()

        if (!player) return message.channel.send("There literally is not player for this guild smh");
        if (!player.playing || player.paused || !player.queue.current) return message.channel.send("There is no song playing in this guild!");
        const song = player.queue.current;

        const time = ms(song.duration);
        const done = ms(player.position);
        const duration = `[${done.hours ? done.hours > 10 ? done.hours : `0${done.hours}` : ""}${done.minutes ? done.minutes >= 10 ? done.minutes : `0${done.minutes}` : "00"}:${done.seconds ? done.seconds > 10 ? done.seconds : `0${done.seconds}` : ""}` + " / " + `${time.hours ? time.hours > 10 ? time.hours : `0${time.hours}` : ""}${time.hours ? ":" : ""}${time.minutes ? time.minutes >= 10 ? time.minutes : `0${time.minutes}` : "00"}:${time.seconds ? time.seconds > 10 ? time.seconds : `0${time.seconds}` : ""}]`
        const percent = percentage(player.position, player.queue.current.duration, 20);

        embed
            .setColor(client.config.color)
            .setTitle(`Now Playing`)
            .setFooter("Command issued by " + message.author.tag)
            .setDescription(`**[${song.title}](${song.uri})**`)
            .addFields(
                { name: "Requested by", value: song.requester },
                { name: "Repeating", value: `${player.trackRepeat ? "Song" : player.queueRepeat ? "Queue" : "None"}`, inline: true },
                { name: "Volume", value: `${player.volume}%`, inline: true },
                { name: "Duration", value: duration },
                { name: "Time", value: `${percent.bar} ${Math.round(percent.percent)}%` }
                
            )
        message.channel.send(embed);
    }
}