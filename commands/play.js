const { MessageEmbed } = require("discord.js");
const { Player } = require("erela.js");
const { reportError } = require("../utils/functions");

module.exports = {
    name: "play",
    aliases: ["p"],
    description: "plays songs obviously",
    run: async (client, message, args) => {
        const { channel } = message.member.voice;

        const embed = new MessageEmbed()
        .setColor(client.config.color);
        
        if (!channel) return message.channel.send("You need to be in the same voice channel as me!");

        const player = client.manager.create({
            guild: message.guild.id,
            textChannel: message.channel.id,
            voiceChannel: channel.id,
        })

        if (!args.legnth && player.paused) return player.pause(false);
        if (!args.length) return message.channel.send("You need to give me a URL or a query to search!");

        if (player.state !== "CONNECTED") player.connect();

        const search = args.join(" ");
        let res;

        try {
            res = await player.search(search, message.author);
            if (res.loadType == "LOAD_FAILED") {
                message.channel.send("Oops! Something went VERY wrong on our side. Don't worry, this has been reported to our devs!");
                reportError(client, message.guild, res.exception.message, 'Play command: "LOAD_FAILED"');
                setTimeout(() => player.destroy(), 60000);
            }
        } catch (e) {
            message.channel.send("Oops! Something went VERY wrong on our side. Don't worry, this has been reported to our devs!");
            return reportError(client, message.guild, e, `Play command: Couldn't search song: \`${search}\``);
        }

        switch (res.loadType) {
            case "NO_MATCHES":
                if (!player.queue.current) {
                    setTimeout(() => player.destroy(), 60000);
                }
                return message.channel.send(embed.setDescription("Couldn't find any songs! Try something else maybe?"));
        
            case "TRACK_LOADED":
            case "SEARCH_RESULT":
                player.queue.add(res.tracks[0]);
    
                if (!player.playing && !player.paused && !player.queue.size) player.play();
                return message.channel.send(embed.setDescription(`Added \`${res.tracks[0].title}\` to the queue!`));
            
            case "PLAYLIST_LOADED":
                player.queue.add(res.tracks);

                if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                return message.channel.send(embed.setDescription(`Added \`${res.playlist.name}\` to the queue!`)); 
        }
    }
}