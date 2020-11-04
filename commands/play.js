const { MessageEmbed } = require("discord.js");
const { reportError } = require("../utils/functions");

module.exports = {
    name: "play",
    aliases: ["p"],
    description: "ya like jazz?",
    run: async (client, message, args) => {
        const { channel } = message.member.voice;

        const embed = new MessageEmbed()
        .setColor("RANDOM");
        
        if (!channel) return message.channel.send("You need to be in the same voice channel as me!");
        if (!args.length) return message.channel.send("You need to give me a URL or a song to search!");

        const player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
        })

        player.connect();

        const search = args.join(" ");
        let res;

        try {
            res = await player.search(search, message.author);
            if (res.loadType == "LOAD_FAILED") {
                message.channel.send("Oopsie doodles! Something went VERY wrong on our side. Don't worry, this has been reported to our devs!");
                reportError(client, res.exception.message);
                setTimeout(() => player.destroy(), 60000);
            }
        } catch (e) {
            message.channel.send("Oopsie doodles! Something went VERY wrong on our side. Don't worry, this has been reported to our devs!");
            return reportError(client, e);
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
    
                if (!player.playing && !player.paused && !player.queue.length) player.play();
                return message.channel.send(embed.setDescription(`Added \`${res.tracks[0].title}\` to the queue!`));
            
            case "PLAYLIST_LOADED":
                player.queue.add(res.tracks);

                if (!player.playing && !player.paused && !player.queue.length) player.play();
                return message.channel.send(embed.setDescription(`Added \`${res.playlist.name}\` to the queue!`)); 
        }
    }
}