/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([
  
      // Actor partials.
      "systems/glog/templates/actor/parts/headerblock.html",
      "systems/glog/templates/actor/parts/healthbar.html",
      "systems/glog/templates/actor/parts/tabs/spells.html",
      "systems/glog/templates/actor/parts/tabs/gear.html",
      "systems/glog/templates/actor/parts/tabs/effects-tab.html",
      "systems/glog/templates/actor/parts/tabs/overview.html",
      "systems/glog/templates/actor/parts/tabs/general.html",
      "systems/glog/templates/actor/parts/tabs/wounds-tab.html",
      "systems/glog/templates/actor/parts/tabs/templates-tab.html",
      "systems/glog/templates/actor/parts/currentStatus/sidecar.html",
      "systems/glog/templates/actor/parts/currentStatus/encumberanceSummary.html",
      "systems/glog/templates/actor/parts/currentStatus/weaponSummary.html",
      "systems/glog/templates/actor/parts/currentStatus/stealthSummary.html",
      "systems/glog/templates/actor/parts/currentStatus/socialSummary.html",
      "systems/glog/templates/actor/parts/currentStatus/statusSummary.html",
      "systems/glog/templates/actor/parts/item-parts/weapons.html",,
      "systems/glog/templates/actor/parts/item-parts/consumables.html",
      "systems/glog/templates/actor/parts/item-parts/gear.html",
      "systems/glog/templates/actor/parts/item-parts/armors.html",
      "systems/glog/templates/actor/parts/item-parts/spells.html",
      "systems/glog/templates/item/item-spell-sheet.html",
      "systems/glog/templates/item/item-weapon-sheet.html",
      "systems/glog/templates/item/item-gear-sheet.html",
      "systems/glog/templates/item/item-consumable-sheet.html",
      "systems/glog/templates/item/item-armor-sheet.html"
    ]);
  };
