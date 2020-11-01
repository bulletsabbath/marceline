const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "help",
    aliases: [],
    description: "Helps you, duh!",
    run: (client, message, args) => {
        const embed = new MessageEmbed()
        .setColor("RANDOM");

        if (!args) {
            embed
            //awful descriptions go BRRRRRRRRRRR
            .setDescription(`
                \`help\` - shows this embed!
                \`ping\` - shows latency
                \`nowplaying\` - learn what is currently playing!
                \`pause\` - pauses the queue without getting rid of it
                \`play\` - plays the song you want!
                \`queue\` - shows the current queue
            `)
            .setFooter("i like ya cut g *SLAP*!!!!")
            message.channel.send(embed);
        }

        if (args) {
            let command = args[0];
            if (!client.commands.has(command) && !client.aliases.has(command)) return;
            embed
            .setTitle(`${command.toLowerCase()}`)
            .setDescription(`
            ;; - ***description*** - ,, ${command.description}
            ;; - ***aliases*** - ,, ${command.aliases.join(", ") || "none"}
            `)
            .setFooter("...and i put a whole bag of jellybeans up my ass")
            message.channel.send(embed);
        } else message.channel.send("That ain't no valid command, king/queen!");
    }
}