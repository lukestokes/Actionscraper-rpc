const {ActionScraper} = require('../classes/ActionScraper');
const {ActionHandler} = require('../classes/ActionHandler');
const {File_StateManager} = require('../classes/File_StateManager');


const eosconfig = {
    chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473", //jungle2
    httpEndpoint: "http://junglehistory.cryptolions.io", //node with mongodb plugin
}

const scraperconfig = {
    batch_size : 10,
    stop_at_last_action: true,
    handle_actions_from_origin: 'internal', //internal, external or all (default: internal)
    block_interval: false// {start: 500, stop: -1} execute handler on actions starting from block 500 (included) and don't stop
}

let my_actionHandler = new ActionHandler();


//using a wildcard will ignore other registered handler. TODO: make it possible to register multiple handlers for the same action
my_actionHandler.register({

    account_name : 'kasdactokens',

    'transfer' : async (actiondata, state, eosapi) => {

        if(actiondata.irreversible){
            state.write('all_actions6.txt', actiondata.receipt.receiver+' ' +JSON.stringify(actiondata.act) );
        }
    },

})

let deamon = new ActionScraper( eosconfig, my_actionHandler, new File_StateManager(), scraperconfig);
//start the action scaper
deamon.loop();
