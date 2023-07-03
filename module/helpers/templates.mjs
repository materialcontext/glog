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
      "systems/glog/templates/actor/parts/tabs/psi-tab.html",
      "systems/glog/templates/actor/parts/tabs/npcgear.html",
      "systems/glog/templates/actor/parts/tabs/effects-tab.html",
      "systems/glog/templates/actor/parts/tabs/skills.html",
      "systems/glog/templates/actor/parts/tabs/ego-tab.html",
      "systems/glog/templates/actor/parts/currentStatus/sidecar.html",
      "systems/glog/templates/actor/parts/currentStatus/armorSummary.html"
    ]);
  };
