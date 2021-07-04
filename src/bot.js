require("dotenv").config();

const { Client, WebhookClient } = require('discord.js');
const client = new Client({
    partials:['MESSAGE','REACTION']
});
const PREFIX="..";
const Discord = require('discord.js');
const https = require('https');
const disbut = require('discord-buttons');
disbut(client);
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
            case "del":
                message.channel.bulkDelete(args[0], true)
                .catch(console.error);
                message.reply(`**Successfully** Deleted ***${args[0]}*** Messages.`)
                console.log(args[0])
                break;
            case "news":
                let j=0;
                titles=[];
                urlss=[];
                descriptions=[];
                contents=[];
                function gets(j){
                    https.get('https://newsapi.org/v2/top-headlines?country=in&q=cricket&category=sports&apiKey=5c11ebffeec94be1a53221296fb72097', (resp) => {
                    let data = '';
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    resp.on('end', () => {
                        
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
                    });
                });
                const exampleEmbed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(titles[j])
                            .setURL(urlss[j])
                            .setDescription(descriptions[j])
                            .setTimestamp()
                    return exampleEmbed;
                }
                        const embeds= new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTimestamp()
                        .setDescription("Asd")

                        let next = new disbut.MessageButton()
                        .setStyle('red')
                        .setLabel('Next Article') 
                        .setID('1')
                        .setEmoji("👉");

                        let prev = new disbut.MessageButton()
                        .setStyle('green')
                        .setLabel('Prev Article') 
                        .setID('2')
                        .setEmoji("👈");

                        const btns= new disbut.MessageActionRow()
                        .addComponent(next)
                        .addComponent(prev)
                        message.channel.send(embeds,btns)
                        client.on('clickButton', async (button) => {
                            if(button.id=="1"){
                                message.channel.bulkDelete(1, true)
                                j++;
                                newsem=gets(j);
                                message.channel.send(newsem,btns)
                            }
                            if(button.id=="2"){
                                message.channel.bulkDelete(1, true)
                                j--;
                                oldem=gets(j);
                                message.channel.send(oldem, btns)
                            }
                        });
        }
    }
    process.on('unhandledRejection', error => {
        console.error('Unhandled promise rejection:', error);
    });
});

//process.env.TOKEN
client.login(process.env.TOKEN)