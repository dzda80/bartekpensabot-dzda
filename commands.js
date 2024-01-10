module.exports.Commands = process.env.COMMAND_VERSION =="FAKE" ? 

{
    Start : /NosStart/,
    Init : /no init/,
    Version :/no Version/,
    Help : /no Help/,
    AddIcs : /no IcsAdd /,
    RemoveIcs : /no IcsRemove /,
    AllMangiamo : /NOT-MangiareAll/,
    AddMangiamo : /NOT-MangiareAdd /,
    RemoveMangiamo : /NOT-MangiareRemove /,
    Ics : /no ics/,
    IcsAll : /NOIcsAll/,
    Mangiamo : /no Mangiamo/,
    QuelloDiceCose: /no QuelloDice/,
    AllQuelloDiceCose: /no RDiceAll/,
    AddQuelloDiceCose: /no RDiceAdd /,
    RemoveQuelloDiceCose: /no RDiceRemove /,
    Dio: /DiOpork/
   } :
   {
    Start : /Start/,
    Init : /init/,
    Version :/Version/,
    Help : /Help/,
    AddIcs : /IcsAdd /,
    RemoveIcs : /IcsRemove /,
    AllMangiamo : /NOT-MangiareAll/,
    AddMangiamo : /NOT-MangiareAdd /,
    RemoveMangiamo : /NOT-MangiareRemove /,
    Ics : /ics/,
    IcsAll : /IcsAll/,
    Mangiamo : /Mangiamo/,
    QuelloDiceCose: /QuelloDice/,
    AllQuelloDiceCose: /RDiceAll/,
    AddQuelloDiceCose: /RDiceAdd /,
    RemoveQuelloDiceCose: /RDiceRemove /,
    Dio: /Dio/
   };