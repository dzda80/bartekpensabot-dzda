const { Constants } = require("./constants");
const { Commands } = require("./commands");
const friday = require('./friday.json');
const fs = require('fs');
var done = 0;
var today_global = new Date();
var dayOfWeek_global  = today_global.getDay();

var files = null;

module.exports = {
    
    giornoCambiato: function (dayOfWeek_global ){
        var dayOfWeek = new Date().getDay();
        if(dayOfWeek_global != dayOfWeek) {
            dayOfWeek_global = dayOfWeek;
            return true;
        }
        return false;
    },

    rispondi: function (lista){
        if( this.giornoCambiato(dayOfWeek_global)== true ) console.log("cambiato Giorno " +  (new Date().toDateString()));
        var isFriday = (new Date().getDay() === 5) ; 
        if(isFriday && done < friday?.esclamazioni.length) {  
            return friday.esclamazioni[done++] 
        }
        else{
            return lista[Math.floor(Math.random() * lista.length)]
        }
    },

    rispondiMangiamo: function (lista){
        console.log(lista.length)
        console.log(lista.length)
        
        return lista[Math.floor(Math.random() * lista.length)]
    },

    delay: function (time) {
        return new Promise(resolve => setTimeout(resolve, time));
    },
    


    ElencaTuttiFiltratiPerOggiPesati: async function( inlist, wd) {
        var outList = [];
        if(inlist) {
            inlist.filter(x=> x.giorni.includes(wd))
                .map(x=> {
                        let pesati = Array(x.pesoAttuale).fill(x.nome);
                        pesati.map(c=> outList.push(c));                
                    });
            return outList;
        } else {
            return outList;
        }
    },


    
    helpMessage: function  (){

        var risposta = "";      
        //risposta += "\n" + Commands.AddIcs + " <tx>: to Add New item to the " + Constants.Ics +" list";
        //risposta += "\n" + Commands.RemoveIcs + " <tx>: to Remove an item to the " + Constants.Ics +" list";
        //risposta += "\n" + Commands.IcsAll + " <tx>: to " + Constants.Ics +" list";
        risposta += "\n" + Commands.Ics + " <tx>: " + Constants.Ics +" item";
        //risposta += "\n" + Commands.AddMangiamo + " <tx>: to Add New place where we can EAT " + Constants.Lunch +"";
        //risposta += "\n" + Commands.RemoveMangiamo + " <tx>: to Remove a place where we can EAT " + Constants.Lunch +"";
        //risposta += "\n" + Commands.AddQuelloDiceCose + " <tx>: to Add New Smart Eclamation to " + Constants.QuelloDiceCose +"";
        risposta += "\n" + Commands.QuelloDiceCose + " <tx>: to Add New Smart Eclamation to " + Constants.QuelloDiceCose +"";
        risposta += "\n" + Commands.Mangiamo + " <tx>: to have a suggestion to " + Constants.Mangiamo +"";
        //risposta += "\n" + Commands.RemoveQuelloDiceCose + " <tx>: to Remove an Esclamation to " + Constants.QuelloDiceCose +"";
        //risposta += "\n" + Commands.AllMangiamo + " <tx>: to List all items in " + Constants.Lunch +"";
        //risposta += "\n" + Commands.AllQuelloDiceCose + " <tx>: to List all items in " + Constants.QuelloDiceCose +"";
        risposta += "\n" + Commands.Version + " the current version.";
        risposta += "\n" + Commands.Init + " WIP";

        return risposta;
    },


    
    readMessageForUser: async function (msg) {
        return await redisClient.getInt(msg.chat.id, msg.from.username);
    },

    getFilesDio: async function (ChatId, folder){
        if (files) return files;
        return await redisClient.getJson( ChatId, folder);

    },
    initFilesDio: async function (ChatId, folder)
    {
         files = null;
    },
   
}
