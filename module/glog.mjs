// import document classes
import { PlayerCharacter } from './documents/actor.mjs';
import { GlogItem } from './documents/item.mjs';
// import sheet classes
import { PlayerCharacterSheet } from './sheets/actor-sheet.mjs';
import { GlogGearSheet } from './sheets/gear-sheet.mjs';

// import helpers
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { GLOG } from './helpers/config.mjs';

function registerSystemSettings() {
  game.settings.register('glog', 'effectPanel', {
    config: true,
    scope: 'world',
    name: 'Enable Effect Panel',
    hint: 'Enable the Effect Panel on Actors',
    type: Boolean,
    default: false,
  });

  game.settings.register('glog', 'GMmenu', {
    config: true,
    scope: 'world',
    name: 'Enable GM Menu',
    hint: 'Shows special GM menu on the lefthand side of the game canvas (marked in blue)',
    type: Boolean,
    default: true,
  });
}

/* ======== Init Hook ======== */
Hooks.once('init', async function () {
  game.glog = {
    PlayerCharacter,
    GlogItem,
    rollItemMacro,
  };

  CONFIG.Combat.initiative = {
    formula: '2d6 + @initMod',
    decimals: 2,
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = PlayerCharacter;
  CONFIG.glog = GLOG;
  CONFIG.Item.documentClass = GlogItem;

  // Register sheets
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet(GLOG.system, PlayerCharacterSheet, {
    types: ['playerCharacter', 'npc', 'hireling', 'companion'],
    makeDefault: true,
    label: 'glog.playerCharacterSheet',
  });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet(GLOG.system, GlogGearSheet),
    {
      types: ['gear', 'weapon', 'armor', 'spell'],
      makeDefault: true,
      label: 'glog.gearSheet',
    };

  // Preload Handlebars
  await preloadHandlebarsTemplates();

  // register settings
  registerSystemSettings();
});

/* --------------------------------------- */
/* Handlebars Helpers                      */
/* --------------------------------------- */

Handlebars.registerHelper('concat', function () {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

// Helper to dump content from within the handlebars system
Handlebars.registerHelper('inspect', function (obj) {
  return '> ' + JSON.stringify(obj);
});

/* ======== Ready Hook ======= */
Hooks.once('ready', async function () {
  // Wait to register hotbar hook to let modules do whatevs
  Hooks.on('hotbardrop', (bar, data, slot) => createItemMacro(data, slot));
});

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
  // first check that item is valid
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return Uint16Array.notifications.warn('You can only create macro buttons for owned items.');
  }
  // if so, retrieve item by uuid
  const item = await Item.fromDropData(data);

  // create macro command
  const command = `game.glog.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find((m) => m.name === item.name && m.command === command);
  if (!macro) {
    macro = await macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'glog.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a macro from an item drop
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // load the item from uuid
  Item.fromDropData(dropData).then((item) => {
    if (!item || !item.parent) {
      const itemName = item?.name ?? item.Uuid;
      return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`);
    }

    // trigger the item roll
    item.roll();
  });
}
