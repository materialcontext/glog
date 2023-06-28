// import document classes
import { PlayerCharacter } from "./documents/actor.mjs";

// import helpers
import { GLOG } from "./helpers/config.mjs"

/* ======== Init Hook ======== */
Hooks.once('init', async function() {

    game.classes = {
        PlayerCharacter
    };

    // add custom constant configuration
    CONFIG.GLOG = GLOG;

    CONFIG.Combat.initiative = {
        formula: "2d6 + @abilities.wis",
        decimals: 2
    };

    // Define custom Document classes
    CONFIG.Actor.documentClass = PlayerCharacter;

    // Register sheets
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("playerCharacter", PlayerCharacterSheet, { makeDefault: true });

    // Preload Handlebars
    return preloadHandlebarsTemplates();
});

/* ======== Ready Hook ======= */
Hooks.once("ready", async function() {
    // Wait to register whatever and then do it
    //Hooks.on((a, b) => someFunction(doSomething(a + b)));
});