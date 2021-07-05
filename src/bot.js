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
                break;
            case "news":
                let j=-2;
                let titles=[];
                let urlss=[];
                let descriptions=[];
                let contents=[];
                let imgs=[];
                let N=0;
                function gets(j, sport){
                    var sports = String.prototype.toLowerCase.apply(sport);
                    https.get('https://newsapi.org/v2/top-headlines?country=in&q='+sports+'&category=sports&apiKey=5c11ebffeec94be1a53221296fb72097', (resp) => {
                    let data = '';
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    resp.on('end', () => {
                        
                        N=JSON.parse(data).articles.length;
                        for (let i = 0; i < N; i++) {
                            let title=JSON.parse(data).articles[i].title;
                            let urls=JSON.parse(data).articles[i].url;
                            let description=JSON.parse(data).articles[i].description;
                            let content=JSON.parse(data).articles[i].content;
                            let img=JSON.parse(data).articles[i].urlToImage
                            titles[i]=title;
                            urlss[i]=urls;
                            descriptions[i]=description;
                            contents[i]=content;
                            imgs[i]=img;
                        }
                    });
                });
                const exampleEmbed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(titles[j])
                            .setURL(urlss[j])
                            .setDescription(descriptions[j])
                            .setTimestamp()
                            .addFields(
		                        { name: 'Content', value: contents[j] }
                            )
                            .setImage(imgs[j])
                    return exampleEmbed;
                }
                        const embeds= new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTimestamp()
                        .setTitle("News from Sixxer..")
                        .setDescription("Latest News!")

                        let next = new disbut.MessageButton()
                        .setStyle('red')
                        .setLabel('Next Article') 
                        .setID(args[0]+'1')
                        .setEmoji("👉");

                        let prev = new disbut.MessageButton()
                        .setStyle('green')
                        .setLabel('Prev Article') 
                        .setID(args[0]+'2')
                        .setEmoji("👈");

                        let end = new disbut.MessageButton()
                        .setStyle('blurple')
                        .setLabel('End News') 
                        .setID(args[0]+'3')
                        .setEmoji("🛑");

                        const btns= new disbut.MessageActionRow()
                        .addComponent(next)
                        .addComponent(prev)
                        .addComponent(end)
                        message.channel.send(embeds,btns)
                        client.on('clickButton', async (button) => {
                            if(button.id==args[0]+"1"){
                                message.channel.bulkDelete(1, true)
                                .catch(console.error())
                                j++;
                                newsem=gets(j,args[0]);
                                if(newsem.title=="undefined"){
                                    newsem.title="Buffer Section";
                                    newsem.description="Move onto the next article";
                                }
                                message.channel.send(newsem,btns)
                            }
                            if(button.id==args[0]+"2"){
                                message.channel.bulkDelete(1, true)
                                .catch(console.error())
                                j--;
                                if(newsem.title=="undefined"){
                                    newsem.title="Buffer Section";
                                    newsem.description="Move onto the next article";
                                }
                                oldem=gets(j,args[0]);
                                message.channel.send(oldem, btns)
                            }
                            if(button.id==args[0]+"3"){
                                message.channel.bulkDelete(1, true)
                                .catch(console.error())
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