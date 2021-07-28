module.exports = async message => {
    const client = message.client;
    if (message.author.bot || !message.guild) return;

    if (!message.content.startsWith(prefix)) return;
    const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

    const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));
    if (!command) return;

    command.run(client, message, args);
}