require('dotenv').config()
require("./app")
const emoji = require("node-emoji");
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
            {"text": emoji.get('question') + "Questions", "callback_data": "Mangiamo"},
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
  const photo = getRandomImages(Constants.Tektek);
  const messageText = 'Ciao! Benvenuto nel tuo bot personalizzato.' + emoji.get('angel') + emoji.get('pig') ;

  // Tastiera personalizzata
  const options = {
    reply_markup: JSON.stringify({
      keyboard: [['Mangiamo ' + emoji.get('spaghetti') + ' or ' + emoji.get('pizza'), 'ics'], 
                [ 'QuelloDice' + emoji.get('question'), 
                'QuelloRimuove'+ emoji.get('rocket')  ], ['JustToPutANumber'+ emoji.get('three') + ' or'  +emoji.get('eight')  + '?']],
      one_time_keyboard: false,
    }),
  };

  // Invia il messaggio con la tastiera
  bot.sendMessage(chatId, messageText, options);
  console.log("Init from " + photo);
});
  bot.sendPhoto(chatId, photo, options);
});

bot.onText(/init/, async (msg) => {
    done = 0;
    perPranzo = 0;
    console.log("Init from " + msg.from.username);
});

bot.onText(/Start/, (msg) => {
    const chatId = msg.chat.id;

    // Messaggio di benvenuto
    const messageText = 'Ciao! Benvenuto nel tuo bot personalizzato.';
  
    // Tastiera personalizzata
    const options = {
      reply_markup: JSON.stringify({
        keyboard: [['Mangiamo ', 'ics'], ['QuelloDice', 'QuelloRimuove'], ['JustToPutANumber']],
        one_time_keyboard: false,
      }),
    };
  
    // Invia il messaggio con la tastiera
    bot.sendMessage(chatId, messageText, options);
  });


bot.onText(/Version/, async (msg) => {
    console.log("Version");
    console.log(Constants.Version);
    bot.sendMessage(msg.chat.id, "Versione: \n" + Constants.Version);

});

bot.onText(/QuelloRimuove/, async (msg) => {
    
    let name = msg.from.username ? "@"+msg.from.username : msg.from.first_name;
    bot.sendMessage(msg.chat.id, "Quello removed " + name + " from the chat");

});

bot.onText(/JustToPutANumber/, async (msg) => {
    console.log("Just to put a Number");

    if(questions && questions.Number) {
        var quest = rispondi(questions.Number);
        bot.sendMessage(msg.chat.id, "Just to put a Number \n" + quest);
    } else {
        bot.sendMessage(msg.chat.id, whats);
    }

});

bot.onText(/Domandati/, async (msg) => {
    console.log("Domandati");
    var elementi =  questions.domandone.concat(questions.QuelloDiceCose)
    if(questions && elementi) {
        var quest = rispondi(elementi);
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
    

    var elementi =  questions.domandone.concat(questions.QuelloDiceCose)
    if(questions && elementi) {
        var quest = rispondi(elementi);
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


   function getRandomImages(lista){
       return lista[Math.floor(Math.random() * lista.length)]
   }
}