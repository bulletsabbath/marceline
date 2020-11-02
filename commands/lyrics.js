const { MessageEmbed } = require("discord.js");
const { getSong } = require("genius-lyrics-api");

module.exports = {
    name: "lyrics",
    aliases: ["ly"],
    description: "Leerixs",
    run: async (client, message) => {
        const player = client.manager.players.get(message.guild.id);
        const req = player.queue.current;

        if (!req) return message.channel.send("There is no song playing!");

        getSong({
            apiKey: client.config.apiKey,
            title: req.title,
            artist: req.author || "",
            optimizeQuery: true
        })
        .then(song => {
            if (!song) return message.channel.send(`No lyrics found for \`${req.title}\``);
    
            if (song.lyrics.length >= 2048) {
                let lyrics = song.lyrics.split(" ");
                let first = lyrics.slice(0, 200).join(" ");
                let second = lyrics.slice(200, lyrics.length - 1).join(" ");

                const embed1 = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(req.title)
                .setThumbnail(song.albumArt)
                .setDescription(first);

                const embed2 = new MessageEmbed() 
                .setColor("RANDOM")
                .setDescription(second)
                .setFooter("Powered by Genius API");
                message.channel.send(embed1);
                message.channel.send(embed2);
            }
        })
    }
}