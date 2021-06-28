require("dotenv").config();

const { Client } = require('discord.js');
const client = new Client();
const PREFIX="..";

client.on('ready', ()=> {
    console.log(`${client.user.tag} has logged in.`);
})

client.on('message', (message)=>{
    if(message.author.bot) return;
    console.log(`[${message.author.tag}]: ${message.content}`);
    if(message.content =="hello"){
        message.reply("hey there!") //tag reply
        message.channel.send("heyo")//send in channel
    }
    if(message.content.startsWith(PREFIX)){
        const [CMD_NAME,...args] =message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/); //space regex
        console.log(CMD_NAME);
        console.log(args)

        if(CMD_NAME=="kick"){
            const member = message.guild.members.cache;
            console.log(member)
        }
    }
});

client.login(process.env.BOT_TOKEN)