module.exports = {
    name: "volume",
    aliases: ["setvolume"],
    run: async (client, message, args) => {
        if (!args.length) return message.channel.send("You need to specify the number!");
        if (!(typeof parseInt(args[0]) === "number")) return message.channel.send("It needs to be a number smh");

        const player = client.manager.players.get(message.guild.id);
        if (!player || !player.queue.current) return message.channel.send("There is no song to change the volume of!");

        player.setVolume(Number(args[0]));
    }
}