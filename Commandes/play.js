const ytdl = require("ytdl-core");
const { createAudioPlayer, createAudioResource, getVoiceConnection } = require("@discordjs/voice");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  name: "play",
  description: "Play music from YouTube",
  permission: "Aucune",
  dm: false,

  async run(bot, message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("You need to be in a voice channel to play music.");

    const connection = getVoiceConnection(message.guild.id);

    if (!connection) {
      // Create a voice connection if not already established
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      bot.voice.connections.set(voiceChannel.guild.id, connection);
    }

    if (!args[0]) return message.reply("Please provide a YouTube URL to play.");

    const stream = ytdl(args[0], { filter: "audioonly" });

    try {
      const resource = createAudioResource(stream);
      const player = createAudioPlayer();

      // Check if there's already a queue; if not, create one
      if (!bot.queue) {
        bot.queue = [];
      }

      // Add the audio resource to the queue
      bot.queue.push(resource);

      // If the player is not already playing, start playing
      if (!connection.subscribers.length) {
        player.play(bot.queue.shift());
        connection.subscribe(player);
      }

      await message.reply(`Now playing: ${args[0]}`);
    } catch (error) {
      console.error("Error playing music:", error);
      message.reply("There was an error playing the music.");
    }
  },
};
