const Discord = require('discord.js')
const mongo = require('../src/connect')

function ticketMessage(id){
    return new Discord.MessageEmbed()
        .setColor('#bbf1c8')
        .setTitle('**Paypal Related Ticket**')
        .setDescription(`Hello <@${id}> ,\n\nIf you're here to pay with paypal, Please check the below conditions\n\n**1.** Will you pay with Family & Friends? Do you know how to use it?\n**2.** Will you pay with PayPal balance or with something else?\n**3.** Do you understand charging back payments may have serious consequences?\n**4.** We will charge 3$+ fees to convert to BTC  - will you still pay?\n\nIf you accept ^^ above conditions\nYou can pay the amount (Each key 5$ + 3$ Fee) as **F&F** to \`gregoriozanivan2@protonmail.com\`\nAfter Sending the money please send the screenshot where the Paypal email and current time is visible.\nThen you can ping any of our support member and they'll take care of rest`)
        .setTimestamp()
        .setFooter('Spotiz.xyz™  - Type $help 🎵','https://cdn.discordapp.com/avatars/774628881910202378/548e0caa288842504514596856039e9c.png?size=256');
}

function SpamTicket(auID,chID){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setDescription(`<@${auID}> You've Already a Ticket opened at <#${chID}>`)
        .setTimestamp()
        .setFooter('Spotiz.xyz™  - Type $help 🎵','https://cdn.discordapp.com/avatars/774628881910202378/548e0caa288842504514596856039e9c.png?size=256');
}

function paypal_ticket(message,user){
    mongo.validateTicket_Author(user.id,async (res)=>{
        try{
            if(res && res.status !== 'closed'){
                return user.send(SpamTicket(user.id,res.channelID))
            }
            else{
                await message.guild.channels.create(`paypal-${user.username}`, {
                    type: 'text', 
                    parent: '779807547993227302',
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            id: user.id,
                            allow: ['VIEW_CHANNEL'],
                        },
                    ],
                }).then(channel=>{
                    mongo.validateConfig(message.guild.id,(r)=>{
                        if(r){
                            if(r.support.roles){
                                let roles = r.support.roles.split(',')
                                for(let role of roles){
                                    channel.updateOverwrite(role, { VIEW_CHANNEL: true})
                                }
                            }
    
                            channel.send(`<@${user.id}>`)
                            channel.send(ticketMessage(user.id)).then(async msg=>{
                                await msg.react('🔒').then(m => {
                                    mongo.newTicket(msg.guild.id,user.id,channel.id,msg.id,(result)=>{
                                        if(result){
                                            console.log('New Ticket Created Successfully')
                                        }
                                    })
                                })
                            })
                        }
                    })
                })
            }
        }
        catch(error){

        }
        
    })
}

module.exports = { paypal_ticket }