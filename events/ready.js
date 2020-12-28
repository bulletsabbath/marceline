module.exports = client => {
    client.manager.init(client.user.id);
    console.log("Ready to rock 'n roll!");
    client.user.setStatus("idle");
}