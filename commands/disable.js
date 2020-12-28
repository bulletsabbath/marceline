const { reportError } = require("../utils/functions");
const Disabled = require("../models/Disabled");
const { Types } = require("mongoose");

module.exports = {
    name: "disable",
    aliases: [],
    description: "Disable a commmand",
    run: (client, message, args) => {
        if (message.author.id !== client.config.owner) return;

        if (!args.length) return message.channel.send("you numbnut give me a command to disable");

        let command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        if (!command) return message.channel.send("there is no command like that fab, you out of all people should know that smh");

        Disabled.findOne({
            name: "global"
        }, (err, data) => {
                if (err) console.log(err);

                if (!data) {
                    const disabled = new Disabled({
                        _id: Types.ObjectId(),
                        name: "global",
                        cmds: []
                    })

                    disabled.cmds.push(command);
                    disabled.save()
                        .catch(e => console.log(e));
                    console.log(disabled);
                } else {
                    console.log(data);
                    data.cmds.push(command);
                    data.save()
                        .catch(e => console.log(e));
                }

                return message.channel.send(`Disabled ${command.name} command`);
        })
    }
}