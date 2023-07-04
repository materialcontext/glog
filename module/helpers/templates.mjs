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
      "systems/glog/templates/actor/parts/tabs/history.html",
      "systems/glog/templates/actor/parts/tabs/exploration.html",
      "systems/glog/templates/actor/parts/tabs/general.html",
      "systems/glog/templates/actor/parts/tabs/wounds-tab.html",
      "systems/glog/templates/actor/parts/tabs/templates-tab.html",
      "systems/glog/templates/actor/parts/currentStatus/sidecar.html",
      "systems/glog/templates/actor/parts/currentStatus/armorSummary.html",
      "systems/glog/templates/actor/parts/currentStatus/statusSummary.html",
      "systems/glog/templates/actor/parts/currentStatus/weaponSummary.html",
      "systems/glog/templates/actor/parts/currentStatus/lightSummary.html",
      "systems/glog/templates/actor/parts/currentStatus/gearSummary.html",
      "systems/glog/templates/actor/parts/currentStatus/consumableSummary.html"
    ]);
  };
