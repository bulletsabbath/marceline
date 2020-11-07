const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const { reportError } = require("../utils/functions");

module.exports = {
    name: "lyrics",
    aliases: ["ly"],
    description: "Leerixs",
    run: async (client, message) => {
        const player = client.manager.get(message.guild.id);
        const req = player.queue.current;

        if (!req) return message.channel.send("There is no song playing in this guild!");
        if (!player) return message.channel.send("There is no player in this guild!");
        
        let lyrics;

        try {
            lyrics = await lyricsFinder(req.title, req.author);
            if (!lyrics) return message.channel.send(`No lyrics found for \`${req.title}\`!`);
        } catch (e) {
            message.channel.send("Couldn't find lyrics at this time! Try again later.");
            reportError(client, message.guild, e, "In lyrics command: Couldn't search for lyrics");
        }

        if (lyrics >= 2048) {
            lyrics = lyrics.split(" ");
            let first = lyrics.slice(0, 200).join(" ");
            let second = lyrics.slice(200, lyrics.length - 1).join(" ");

            let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${req.title} by ${req.author}`)
            .setDescription(first)
    
            let embed1 = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(second)
            message.channel.send(embed);
            message.channel.send(embed1);
        }
    }
}