require("dotenv").config();

const { Client, WebhookClient } = require('discord.js');
const client = new Client({
    partials:['MESSAGE','REACTION']
});
const PREFIX="..";
const Discord = require('discord.js');
const https = require('https');
const { url } = require('inspector');
const { title } = require("process");

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
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    resp.on('end', () => {
                        titles=[];
                        urlss=[];
                        descriptions=[];
                        contents=[];
                        N=JSON.parse(data).articles.length;
                        for (let i = 0; i < 10; i++) {
                            let title=JSON.parse(data).articles[i].title;
                            let urls=JSON.parse(data).articles[i].url;
                            let description=JSON.parse(data).articles[i].description;
                            let content=JSON.parse(data).articles[i].content;
                            titles[i]=title;
                            urlss[i]=urls;
                            descriptions[i]=description;
                            contents[i]=content;
                        }
                        let i=0;
                        stert: while(i>=0){
                            const exampleEmbed = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(titles[i])
                                .setURL(urlss[i])
                                .setAuthor('Cricket News', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
                                .setDescription(descriptions[i])
                                .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                                .addField('Inline field title', 'Some value here', true)
                                .setImage('https://i.imgur.com/wSTFkRM.png')
                                .setTimestamp()
                                .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
                            message.channel.send(exampleEmbed)
                            .then(function (message) {
                                message.react("👍")
                                message.react("👎")
                            }).catch(function() {
                                //Something
                            });
                            i=-1;
                        }
                        console.log("asd");
                    });

                })
                .on("error", (err) => {
                        console.log("Error: " + err.message);
                });
                
        }
    }
});

//process.env.TOKEN
client.login(process.env.TOKEN)