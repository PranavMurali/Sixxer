require("dotenv").config();

const { Client, WebhookClient } = require('discord.js');
const client = new Client({
    partials:['MESSAGE','REACTION']
});
const PREFIX="..";
const webhookClient= new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOOK_TOKEN,
);

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
            if(args.length==0) return message.reply("Please provide an id.");
            if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply("you dont have permission");
            const member = message.guild.members.cache.get(args[0]);
            if(member){
                member
                .kick()
                .then((member)=>message.channel.send(`${member} was removed`))
                .catch((err)=>message.channel.send("no permission"));

            }
            else{
                message.channel.send("Member not exists");
            }
        }
        else if (CMD_NAME=="ann"){
            const msg=args.join(' ');
            webhookClient.send(msg)
            .catch((err)=>message.channel.send("no permission"));
        }
    }
});

client.on("messageReactionAdd",(reaction, user,message)=> {
    const {name} =reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === "858987926163554314"){
        switch(name){
            case '😃':
                member.roles
                .add('750313998951383141')
                .catch((err)=>console.log("asd"));
                console.log(name);
                break;
        }
    }
});
client.login(process.env.BOT_TOKEN)