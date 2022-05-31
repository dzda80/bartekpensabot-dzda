require("./app")
const redisClient = require("./redisClient")
const { Constants } = require("./constants");
const friday = require('./friday.json'); 
const questionsRedisKey = "questions";
const questions_bck = require('./questions.json');

const TelegramBot =require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.BOT_API_KEY, {polling:true});
var done = 0;
var perPranzo = 0;
var today_global = new Date();
var dayOfWeek_global  = today_global.getDay();

async function readQuestions(msg) {
    return await redisClient.getJson(msg.chat.id,questionsRedisKey);
 } 

 async function readMessageForUser(msg) {
    return await redisClient.getInt(msg.chat.id, msg.from.username);
 } 

 async function setMessageForUser(msg) {
    var num = await readMessageForUser(msg) ?? 0;
    await redisClient.setInt(msg.chat.id, msg.from.username, num + 1);
    return num + 1;
 } 
 
// bot.on("message", async (msg) => {
//     var n = await setMessageForUser(msg);
//         if (n> 4)  {
//             console.log(msg.from.username + "! Clicca di meno merda!");
//         }
//     }
// );

bot.onText(/^[\/]{1}Start/, async (msg) => {
    console.log("Start from " + msg.from.username);
    
    var questions = await readQuestions(msg);
    if(!questions) {
       console.log("Init redis values");
       await redisClient.setJson(msg.chat.id,questionsRedisKey, JSON.stringify(questions_bck));
       questions = questions_bck;
    }
    bot.sendMessage(msg.chat.id, Constants.WelcomeMessage, {
        reply_markup : {
            keyboard : [[Constants.Question],[Constants.Lunch],[Constants.Ics]],
            force_reply : true
        }
    })

});




bot.onText(/init/, async (msg) => {
    done = 0;
    perPranzo = 0;
    console.log("Init from " + msg.from.username);
});


bot.onText(/mangiamo/, async (msg) => {
    var questions = await readQuestions(msg);
    await setMessageForUser(msg);
    if( GiornoCambiato()) console.log("cambiato Giorno");
    if(perPranzo <= 0) {
        const quest = rispondi(questions.pranzo);
        bot.sendMessage(msg.chat.id,quest);
        perPranzo++;
    } else {
        bot.sendMessage(msg.chat.id, msg.from.first_name + ", per Oggi ho già risposto");
    }
});
bot.onText(/ics/, async (msg) => {
    await setMessageForUser(msg);
    var questions = await readQuestions(msg);
    const quest = rispondi(questions.ics);
    bot.sendMessage(msg.chat.id,quest);
});
bot.onText(/Domandati/, async (msg) => {
    
    var questions = await readQuestions(msg);
    const quest = rispondi(questions.domandone);
    bot.sendMessage(msg.chat.id,quest);
});
function GiornoCambiato(){
    var dayOfWeek = new Date().getDay();
    if(dayOfWeek_global != dayOfWeek) {
        dayOfWeek_global =  dayOfWeek;
        done = 0;
        perPranzo = 0;
        return true;
    }
    return false;
}
function rispondi(lista){
    
    if( GiornoCambiato()) console.log("cambiato Giorno");

    var isFriday = (new Date().getDay() === 5) ; 

    if(isFriday && done < friday.esclamazioni.length) {  
        perPranzo = -1;   
        return friday.esclamazioni[done++] 
   }
   else{
       return lista[Math.floor(Math.random() * lista.length)]
   }
}
