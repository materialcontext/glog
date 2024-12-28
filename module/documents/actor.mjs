import { GLOG } from "../helpers/config.mjs";

/**
 * Extends the basic actor sheet
 * @extends {Actor}
 */

export class PlayerCharacter extends Actor {
  // everything in here MUTATES the playerCharcter document

  /** @override */
  prepareData() {
    super.prepareData();

    const actorModel = this.system;
    const items = this.items;

    //Determin whether any gear is present
    for (let gearCheck of items) {
      if (
        gearCheck.system.displayCategory === "weapon" ||
        gearCheck.system.displayCategory === "gear" ||
        gearCheck.system.displayCategory === "armor" ||
        gearCheck.system.slotType === "consumable"
      ) {
        actorModel.hasGear = true;
        break;
      }
    }
  }

  /** @override */
  prepareBaseData() {
    super.prepareBaseData();
    let context = this.system;
    let abilities = context.abilities;
    let level = context.level;

    // derive abilitiy bonuses from scores and set as ability.mod after factoring exhaustion
    if (abilities) {
      for (let [k, v] of Object.entries(abilities)) {
        v.value = v.base - context.exhaustion;

        if (v.value < 3) {
          abilities[k].mod = -3;
        } else if (v.value == 3 || v.value == 4) {
          abilities[k].mod = -2;
        } else if (v.value == 5 || v.value == 6) {
          abilities[k].mod = -1;
        } else if (v.value == 8 || v.value == 9) {
          abilities[k].mod = 1;
        } else if (v.value == 10 || v.value == 11) {
          abilities[k].mod = 2;
        } else if (v.value > 11) {
          abilities[k].mod = 3;
        } else {
          abilities[k].mod = 0;
        }
      }
    }

    //set exhaustion and encumberance flags before processing ability scores
    context.exhausted = context.exhaustion > 0 ? true : false;
    context.encumbered = context.encumberance > 0 ? true : false;

    // attack
    context.combat.atk = Math.min(level, 4);

    // stealth
    context.stealth.sneak = abilities.dex.mod;
    context.stealth.hide = abilities.wis.mod;
    context.stealth.disguise = abilities.int.mod;

    // explore
    context.explore.ambushMod = 0;
    context.explore.reconMod = 0;

    // social
    context.social.react = abilities.cha.mod;
    context.social.diplo = abilities.cha.mod;
    context.social.intim = abilities.cha.mod;

    // set trauma and endurance mods
    context.traumaMod = abilities.con.mod;
    context.enduranceMod = abilities.con.mod;

    // set initiative mod
    context.initMod = abilities.wis.mod;

    // set move
    context.move.value = 4;

    // calculate inventory
    context.inventory.max =
      6 + Math.max(abilities.str.mod, abilities.con.mod) * 2;
  }

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
    const actorData = this;

    this._prepareCharacterData(actorData);
    this._prepareNPCData(actorData);
  }

  // prepare playerCharacter type specific data
  _prepareCharacterData(actorData) {
    if (actorData.type !== "playerCharacter") return;

    let context = actorData.system;
    let abilities = context.abilities;
    let level = context.level;

    // xp for next level
    context.flags.xpNext = GLOG.xp[level];

    // subtract encumebrance from move
    context.move.value -= context.encumberance;

    // calculate max hp
    context.hp.max = context.hp.base - context.exhuastion + context.hp.bonus;

    /**
     * dexterity check penalties for encumberance are handled in template.json > dex.roll...
     * ...because it simplifies defense calculations
     * */

    // hires
    if (level > 3) {
      context.hires.max = level;
    } else {
      context.hires.max = level + abilities.cha.mod;
    }

    this._applyClass(actorData);
    this._applyFeatures(actorData);

    console.log(actorData);
  }

  // applies class (level 0) roll and data transforms to the document
  _applyClass(actorData) {
    let context = actorData.system;
    let className = context.class;

    let sneak = context.stealth.sneak;
    let hide = context.stealth.hide;
    let disguise = context.stealth.disguise;

    switch (className) {
      case "acrobat":
        sneak += 1;
        break;
      case "assassin":
        sneak += 2;
        hide += 2;
        disguise += 2;
        break;
      case "barbarian":
        context.hp.bonus += context.classTemplates.barbarian; // +1 hp per barbarian template
        break;
      case "courtier":
        context.social.react += this._halfClass(context, "courtier"); // +1 react per 2 couriter levels
        break;
      case "fighter":
        context.combat.atk += 2;
        break;
      case "hunter":
        context.combat.archery = true;
        break;
      case "thief":
        sneak += this._halfClass(context, "thief"); // +1 stealth per 2 thief levels
        hide += this._halfClass(context, "thief");
        disguise += this._halfClass(context, "thief");
        break;
      case "wiard":
        context.magicDice.max = context.classTemplates.wizard; // +1 md per wizard template
        break;
      default:
        break; //do nothing
    }
  }

  // applies feature data and roll transforms to the document
  _applyFeatures(actorData) {
    let context = actorData.system;
    const features = context.features;

    for (let feat in features) {
      switch (feat) {
        case "courtly education":
          context.combat.archery = true;
          break;
        case "danger sense":
          context.social.hide += this._halfClass(context, "barbarian");
          context.explore.ambushMod += 1;
          break;
        case "stalker":
          context.stealth.sneak += 1;
          context.stealth.hide += 1;
          context.explore.ambushMod += 1;
          break;
        case "tough":
          context.enduranceMod += 1;
          context.traumaMod += 1;
          break;
        case "unburdened":
          break;
        default:
          break; // do nothing
      }
    }
  }

  _halfClass(context, templateName) {
    return Math.floor(context.classTemplates[templateName] / 2);
  }

  // prepare NPC type specific data
  _prepareNPCData(actorData) {
    if (actorData.type !== "npc") return;
  }

  // prepare companion specific data
  _prepareCompanionData(actorData) {
    if (actorData.type !== "companion") return;
  }

  // prepare hireling specific data
  _prepareHirelingData(actorData) {
    if (actorData.type !== "hireling") return;
  }

  /**
   * Override getRollData() that's supplied to rolls
   */

  getRollData() {
    const data = super.getRollData();
    // do general roll adjutments in here

    //prepare character roll data
    this._getCharacterRollData(data);
    return data;
  }

  _getCharacterRollData(data) {
    // do character specific roll stuff in here
  }
}
