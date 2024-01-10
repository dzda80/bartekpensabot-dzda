require("./app")
const { Constants } = require("./constants");
const friday = require('./friday.json'); 
var questions = require('./questions.json');
const utility = require("./utility");

const Utility = require("./utility");

const whats ="Cosa?";
const TelegramBot =require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_API_KEY, {polling:true});

 

var id_message_start ="";



const keyboard = {
    "inline_keyboard": [
        [
            {"text": "Questions", "callback_data": "Mangiamo"},
            {"text": "Dove mangiare",  "callback_data": "Domandati"},
            {"text": "Ics", "callback_data": "ics"},
        ]
        ]
    };

    

var done = 0;
var perPranzo = 0;
var today_global = new Date();
var dayOfWeek_global  = today_global.getDay();
var menutoogle = true;


bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Messaggio di benvenuto
  const messageText = 'Ciao! Benvenuto nel tuo bot personalizzato.';

  // Tastiera personalizzata
  const options = {
    reply_markup: JSON.stringify({
      keyboard: [['Mangiamo', 'Domandati'], ['QeulloDice']],
      one_time_keyboard: true,
    }),
  };

  // Invia il messaggio con la tastiera
  bot.sendMessage(chatId, messageText, options);
});

bot.onText(/init/, async (msg) => {
    done = 0;
    perPranzo = 0;
    console.log("Init from " + msg.from.username);
   
  
});

bot.onText(/}Start/, (msg) => {
    console.log("Start from " + msg.from.username);

    bot.sendMessage(msg.chat.id, Constants.WelcomeMessage, {
        reply_markup : {
            keyboard : keyboard,
            force_reply : true
        }
    })
});


bot.onText(/Version/, async (msg) => {
    console.log("Version");
    console.log(Constants.Version);
    bot.sendMessage(msg.chat.id, "Versione: \n" + Constants.Version);

});

bot.onText(/Domandati/, async (msg) => {
    console.log("Domandati");

    if(questions && questions.domandone) {
        var quest = rispondi(questions.domandone);
        bot.sendMessage(msg.chat.id, "Quello dice: \n" + quest);
    } else {
        bot.sendMessage(msg.chat.id, whats);
    }

});

bot.onText(/sistema/, async (msg) => {
    console.log("coseeee");
     menutoogle = !menutoogle;
 
     data = !menutoogle ? 
         {"reply_to_message_id": msg.message_id, "force_reply" : "true"}
         :{"reply_to_message_id": msg.message_id, "reply_markup": JSON.stringify(keyboard), "force_reply" : "true"};
 
     bot.sendMessage(msg.chat.id, !menutoogle ? "Menu Disattivato": "Menu Attivato", data , function (isSuccess) {
         console.log(isSuccess);
     });
 
     return;
     
 });
 
  bot.onText(/QuelloDice/, async (msg) => {
    
     if(questions && questions.QuelloDiceCose) {
         var quest = rispondi(questions.QuelloDiceCose);
         bot.sendMessage( msg.chat.id, "Quello dice: " + quest);         
     } else {
         bot.sendMessage(msg.chat.id, whats);
     }
 });
 
 bot.onText(/Mangiamo/, async (msg) => {

     if( GiornoCambiato()) console.log("cambiato Giorno");
     if(perPranzo <= 0) {
         if(questions && questions.pranzo) {
             var quest = rispondi(questions.pranzo);
             bot.sendMessage(msg.chat.id, "Oggi Mangerai da \n" + quest);
         } else {
             bot.sendMessage(msg.chat.id, whats);
         }
         
         perPranzo++;
     } else {
         bot.sendMessage(msg.chat.id, msg.from.first_name + ", per Oggi ho già risposto");
     }
 });
 
 bot.onText(/ics/, async (msg) => {
     if(questions && questions.ics) {
         var quest = questions.ics.map(x=> x + " \n");
 
         bot.sendMessage(msg.chat.id, "Questi sono ICS: \n" + quest);
     } else {
         bot.sendMessage(msg.chat.id, whats);
     }
 });


 bot.onText(/help/, async (msg) => {
    if(questions && questions.ics) {
        var quest = utility.helpMessage();

        bot.sendMessage(msg.chat.id, "Questi sono ICS: \n" + quest);
    } else {
        bot.sendMessage(msg.chat.id, whats);
    }
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