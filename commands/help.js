const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "help",
    aliases: [],
    description: "Helps you, duh!",
    run: (client, message, args) => {
        const embed = new MessageEmbed()
        .setColor("RANDOM");

        if (!args[0]) {
            embed
            //awful descriptions go BRRRRRRRRRRR
            .setDescription(`
                \`help\` - shows this embed!
                \`ping\` - shows latency
                \`nowplaying\` - learn what is currently playing!
                \`pause\` - pauses the queue without getting rid of it
                \`play\` - plays the song you want!
                \`queue\` - shows the current queue
                \`skip\` - skips the current song
                \`stop\` - stops the queue completely and leaves

            `)
            .setFooter("footer go brr")
            message.channel.send(embed);
        }

        if (args[0]) {
            let command = args[0].toLowerCase();
            if (!client.commands.has(command) && !client.aliases.has(command)) return message.channel.send("That ain't no valid command, king/queen!");
            command = client.commands.get(command) || client.aliases.get(command);
            embed
            .setTitle(`${command.name}`)
            .setDescription(`
            ;; - ***description*** - ,, ${command.description || "no ~~useless~~ description"}
            ;; - ***aliases*** - ,, ${"test" || "none"}
            `)
            .setFooter("...and i put a whole bag of jellybeans up my ass")
            console.log(command);
            message.channel.send(embed);
        }
    }
}