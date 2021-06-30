require("dotenv").config();

const { Client, WebhookClient } = require('discord.js');
const client = new Client({
    partials:['MESSAGE','REACTION']
});
const PREFIX="..";
const Discord = require('discord.js');
const https = require('https');
const { url } = require('inspector');

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
        switch(CMD_NAME){
            case "kick":
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
            
            case "news":
                https.get('https://newsapi.org/v2/top-headlines?country=in&q=cricket&category=sports&apiKey=5c11ebffeec94be1a53221296fb72097', (resp) => {
                    let data = '';

                    // A chunk of data has been received.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });

                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        N=JSON.parse(data).articles.length;
                        for (let i = 0; i < 1; i++) {
                            title=JSON.parse(data).articles[i].title;
                            urls=JSON.parse(data).articles[i].url;
                            description=JSON.parse(data).articles[i].description;
                            content=JSON.parse(data).articles[i].content;
                            const exampleEmbed = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(title)
                                .setURL(urls)
                                .setAuthor('Cricket News', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
                                .setDescription(description)
                                .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                                .addField('Inline field title', 'Some value here', true)
                                .setImage('https://i.imgur.com/wSTFkRM.png')
                                .setTimestamp()
                                .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
                            message.channel.send(exampleEmbed);
                            message.react('👍').then(() => message.react('👎'));

                            const filter = (reaction, user) => {
                                return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
                            };

                            message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                .then(collected => {
                                    const reaction = collected.first();
                                    if (reaction.emoji.name === '👍') {
                                        message.reply('you reacted with a thumbs up.');
                                    } else {
                                        message.reply('you reacted with a thumbs down.');
                                    }
                                })
                                .catch(collected => {
                                    message.reply('News Navigation closed.');
                                });
                        }
                    });

                })
                .on("error", (err) => {
                        console.log("Error: " + err.message);
                });
                
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
//process.env.TOKEN
client.login(process.env.BOT_TOKEN)