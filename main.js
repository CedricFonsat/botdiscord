const Discord = require("discord.js")
const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({intents})
const loadCommands = require('./Loaders/loadCommands')
const loadEvents = require("./Loaders/loadEvents")
const config = require("./config.js")

bot.commands = new Discord.Collection()
bot.voice = {
    connections: new Map(),
  };

bot.login(config.token);
loadCommands(bot)
loadEvents(bot)