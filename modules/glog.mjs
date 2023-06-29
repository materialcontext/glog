// import document classes
import { PlayerCharacter } from "./documents/actor.mjs";
import { GlogItem } from "./documents/item.mjs";
// import sheet classes
import {PlayerCharacterSheet}  from "./sheets/actor-sheet.mjs"
import {GlogItemSheet} from "./sheets/item-sheet.mjs" 

// import helpers
import { GLOG } from "./helpers/config.mjs"

/* ======== Init Hook ======== */
Hooks.once('init', async function() {

    game.classes = {
        PlayerCharacter,
        Item: GlogItem,
        rollItemMacro
    };

    // add custom constant configuration
    CONFIG.GLOG = GLOG;

    CONFIG.Combat.initiative = {
        formula: "2d6 + @abilities.wis",
        decimals: 2
    };

    // Define custom Document classes
    CONFIG.Actor.documentClass = PlayerCharacter;
    CONFIG.Item.documentClass = GlogItem;

    // Register sheets
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("glog", PlayerCharacterSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("glog", GlogItemSheet, { makeDefault: true });

    // Preload Handlebars
    return preloadHandlebarsTemplates();
});

/* --------------------------------------- */
/* Handlebars Helpers                      */
/* --------------------------------------- */

Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
        if (typeof arguments[arg] != 'object') {
            outSttr += arguments[arg];
        };
    };
    return outStr;
});

Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
});

/* ======== Ready Hook ======= */
Hooks.once("ready", async function() {
    // Wait to register hotbar hook to let modules do whatevs
    Hooks.on("hotbardrop", (bar, data, slot) => createItemMacro(data, slot));

    /* ------------------------------------- */
    /* Hotbar Macros                         */
    /* ------------------------------------- */

    /**
     * Create a Macro from an item drop
     * Get existing item if exists, else create new
     * @param {Object} data     The dropped data
     * @param {number} slot     The hotbar slot used
     * @returns {Promise}
     */
    async function createItemMacro(data, slot) {
        // check that item is valid
        if (data.type !== "Item") return;
        if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
            return Uint16Array.notifications.warn("You can only create maacro buttons for owned items.")
        };

        // retrieve item by uuid
        const item = await Item.fromDropData(data);

        // create macro command
        const command = `game.glog.rollItemMacro("${data.uuid}");`;
        let macro = game.macros.find(m => (m.name === item.name) && m.command === command);
        if (!macro) {
            macro = await macro.create({
                name: item.name,
                type: "script",
                img: item.img,
                command: command,
                flags: { "glog.itemMacro": true }
            });
        };
        game.user.assignHotbarMacro(macro, slot);
        return false;
    }; 

    /**
     * Create a macro from an item drop
     * @param {string} itemUuid
     */
    function rollItemMacro(itemUuid) {
        const dropData = {
            type: 'Item',
            uuid: itemUuid
        };
        // load from uuid
        Item.fromDropData.then(item => {
            if (!item || !item.parent) {
                const itemName = item?.name ?? item.Uuid;
                return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`)
            };

            // roll
            item.roll();
        });
    };
});