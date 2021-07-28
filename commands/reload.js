const { reportError } = require("../utils/functions");

module.exports = {
    name: "reload",
    aliases: ["rl"],
    description: "mmmmreload",
    run: async (client, message, args) => {
        if (message.author.id !== client.config.owner) return;

        if (!args.length) return message.channel.send("you dumbfuck give me a command to reload");

        let command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        if (!command) return message.channel.send("there is no command like that fab, you out of all people should know that smh");

        try {
            delete require.cache[require.resolve(`./${command.name}.js`)];
            const newFile = require(`./${command.name}.js`);
            client.commands.set(newFile.name, newFile);
            client.aliases.set(newFile.aliases, newFile.name);
            message.channel.send("Successfully reloaded command");
        } catch(e) {
            message.channel.send("oopsie woopsies couldn't reload commandchecklogsformoreinfoBYEEEEEEEEEEEEEE");
            reportError(client, message.guild, e, "In reload command: Couldn't delete require cache.");
        }
    }
}