const { lyricsify } = require("../utils/functions");

module.exports = {
    name: "lyrics",
    aliases: ["ly"],
    description: "Leerixs",
    run: async (client, message) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send("There is no player in this guild!");

        const req = player.queue.current;

        if (!req) return message.channel.send("There is no song playing in this guild!");

        let page = 0;
        let lyrics = await lyricsify(client, message, req, page);
        if (lyrics == null) return message.channel.send(`Couldn't find any lyrics for ${req.title}`);

        let msg = await message.channel.send(lyrics[page]);

        await msg.react("??");
        await msg.react("??");
        await msg.react("??");

        let filter = (reaction, user) => reaction.emoji.name === `??` || reaction.emoji.name === `??` || reaction.emoji.name === `??` && user.id === message.author.id;
        const collector = msg.createReactionCollector(filter, { time: 30000 });

        collector.on("collect", (reaction, user) => {
            try {
                if (reaction.emoji.name === "??" && embeds.length !== 1) {
                    if (page - 1 >= 0) {
                        --page;
                        msg.edit("", embeds[page]);
                    } else {
                        page = embeds.length + 1;
                        msg.edit("", embeds[page - 1]);
                    }
                } else if (reaction.emoji.name === "??" && embeds.length !== 1) {
                    if (page + 1 < embeds.length) {
                        ++page;
                        msg.edit("", embeds[page]);
                    } else {
                        page = 1;
                        msg.edit("", embeds[0]);
                    }
                } else if (reaction.emoji.name === "??") {
                    msg.delete();
                }
            } catch (e) {
                
            }
        })
    }
}