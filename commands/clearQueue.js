const { MessageEmbed } = require("discord.js");
const { reportError } = require("../utils/functions");

module.exports = {
    name: "clearqueue",
    aliases: ["cq"],
    description: "as clean and smooth as a baby's butt!",
    run: (client, message) => {
        const player = client.manager.players.get(message.guild.id);
        
        if (!player) return message.channel.send("There is no queue to clear???");
        
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`
            Oh shit oh fuck are you sure? <:shake:772882367340871702>

            Gotta warn you mate if you clear the queue you'll never get it back?

            :white_check_mark: Clear it!
            :negative_squared_cross_mark: OMG NVM I CHANGED MY MIND (or just wait a minute)
        `)

        if (!player.queue) return message.channel.send("There is no queue to clear!");
        
        let filter = (reaction, user) => {
            reaction.emoji.name === `✅` || reaction.emoji.name === `❎` && user.id === call.message.author.id;
        }

        message.channel.send(embed)
        .then(async msg => {
            await msg.react("✅");
            await msg.react("❎");
        })

        try {
            message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                if (collected.emoji === `✅`) player.queue.clear();
                else if (collected.emoji === `❎`) message.channel.send("Okie dokie, cancelled command!");
                console.log(collected);
            })

        } catch(e) {
            message.channel.send("Oopsie whoopsies! Can't clear queue right now. Try again later :(");
            reportError(client, message.guild, e, "In clearQueue command: Cannot fetch reactions");
        } 
    }
}