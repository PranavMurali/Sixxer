require("dotenv").config();

const { Client} = require('discord.js');
const client = new Client({
    partials:['MESSAGE','REACTION']
});
const PREFIX="..";
const Discord = require('discord.js');
const https = require('https');
const disbut = require('discord-buttons');
disbut(client);

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
        const [CMD,...args] =message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/); //space regex
        var CMD_NAME = String.prototype.toLowerCase.apply(CMD);
        switch(CMD_NAME){
            case "Del":
                message.channel.bulkDelete(parseFloat(args[0])+1, true)
                .catch(console.error);
                break;
            case "Info":
                const infoEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Information on how to use Sixxer')
                        .setAuthor('Sixxer', 'https://img.icons8.com/emoji/48/000000/cricket-game-emoji.png')
                        .setDescription("The bot's prefix is .. and this can be used with commands like news, info, del.")
                        .setThumbnail('https://img.icons8.com/cotton/64/000000/sport-clothes--v2.png')
                        .addFields(
                            { name: '..News Cricket', value: 'News command used to get cricket news, but you could use the name of any sport you want.'},
                            { name: '..Del N', value: 'used to delete N messages.' },
                        )
                        .setTimestamp()
                        .setFooter('Have a nice day!', 'https://img.icons8.com/color/48/000000/sport-net.png');
                message.channel.send(infoEmbed)
                .catch(console.error())
                break;
            case "News":
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
                        .catch(console.error())
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
                                .catch(console.error())
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
                                .catch(console.error())
                            }
                            if(button.id==args[0]+"3"){
                                message.channel.bulkDelete(1, true)
                                .catch(console.error())
                            }
                        });
        }
    }
    process.on('unhandledRejection', error => {
        console.error('nooo', error);
    });
});

//process.env.TOKEN
client.login(process.env.TOKEN)