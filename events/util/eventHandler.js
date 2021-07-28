const req = (event) => require(`./${event}`)

module.exports = (client) => {
    client.once("ready", req("ready")(client))
    client.on("message", req("message"))
}