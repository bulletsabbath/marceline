module.exports = {
    name: "loop",
    aliases: [],
    description: "Loop the queue or the song",
    run: (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);

        if (!player || !player.queue) return message.channel.send("There is no queue to loop!");
        if (!args.length) return message.channel.send("You need to specify whether to loop/unloop the queue or the song!");

        if (args[0].toLowerCase() == "song") {
            if (!player.trackRepeat) {
                player.setTrackRepeat(true);
                return message.channel.send("The song is now being looped!");
            } else {
                player.setTrackRepeat(false);
                return message.channel.send("The song is now unlooped!");
            }
        } else if (args[0] == "queue") {
            if (!player.queueRepeat) {
                player.setQueueRepeat(true);
                return message.channel.send("Queue is now being looped!");
            } else {
                player.setQueueRepeat(false);
                return message.channel.send("Queue is now unlooped!");
            }
        }
    }
}