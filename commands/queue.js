const { MessageEmbed } = require("discord.js");
const { embedify } = require("../utils/functions");

module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "shows the current queue",
    run: async (client, message) => {
        const player = client.manager.get(message.guild.id);

        if (!player) return message.channel.send("There is no player in this guild!");
        if (player.queue.length == 1 || !player.queue.length) return message.channel.send("There is no queue to show lol");

        let page = 0;
        const embeds = embedify(player.queue, page);

        const msg = await message.channel.send(embeds[page].setFooter(`Page ${page + 1}/${embeds.length}`));

        await msg.react("⏮️");
        await msg.react("⏭️");
        await msg.react("⏹️");

        let filter = (reaction, user) => reaction.emoji.name === `⏮️` || reaction.emoji.name === `⏭️` || reaction.emoji.name === `⏹️` && user.id === message.author.id;
        const collector = msg.createReactionCollector(filter, { time: 30000 });

        collector.on("collect", (reaction, user) => {
            try {
                if (reaction.emoji.name === "⏮️" && embeds.length !== 1) {
                    if (page - 1 >= 0) {
                        --page;
                        msg.edit("", embeds[page]);
                    } else {
                        page = embeds.length + 1;
                        msg.edit("", embeds[page - 1]);
                    }
                } else if (reaction.emoji.name === "⏭️" && embeds.length !== 1) {
                    if (page + 1 < embeds.length) {
                        ++page;
                        msg.edit("", embeds[page]);
                    } else {
                        page = 1;
                        msg.edit("", embeds[0]);
                    }
                } else if (reaction.emoji.name === "⏹️") {
                    msg.delete();
                }
            } catch (e) {
                message.channel.send("Oops! Cannot show queue right now, try again later?");
                reportError(client, message.guild, e, "In queue command: Cannot collect reactions.");
            }
        })
    }
}