const { MessageEmbed } = require("discord.js")
const { generate } = require("../utils/functions");

module.exports = {
    name: "help",
    aliases: [],
    description: "shows this embed!",
    run: (client, message, args) => {
        const embed = new MessageEmbed()
        .setColor(client.config.color);

        if (!args[0]) {
            embed
                .setDescription(generate())
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
            ;; - ***description*** - ,, ${command.description || "no description"}
            ;; - ***aliases*** - ,, ${command.aliases.join(", ") || "none"}
            `)
            console.log(command);
            message.channel.send(embed);
        }
    }
}