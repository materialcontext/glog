/**
 * Extends the basic actor sheet
 * @extends {Actor}
 */

export class PlayerCharacter extends Actor {
  /** @override */
  prepareData() {
    super.prepareData();

    const actorModel = this.system;
    const items = this.items;

    //Determin whether any gear is present
    for(let gearCheck of items){
      if(gearCheck.system.displayCategory === "weapon" || gearCheck.system.displayCategory === "gear" || gearCheck.system.displayCategory === "armor" || gearCheck.system.slotType === "consumable") {
        actorModel.hasGear = true;
        break;
      };
    };
  };

  /** @override */
  prepareBaseData() {}

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
    const actorData = this;

    this._prepareCharacterData(actorData);
    this._prepareNPCData(actorData);
  };

  // prepare playerCharacter type specific data
  _prepareCharacterData(actorData) {
    if (actorData.type !== "playerCharacter") return;

    let abilities = actorData.system.abilities;
    if (abilities) {
      for (let [k, v] of Object.entries(abilities)) {
        if (v.value < 3) { abilities[k].mod = -3; }
        else if (v.value == 3 || v.value == 4) { abilities[k].mod = -2; } 
        else if (v.value == 5 || v.value == 6) { abilities[k].mod = -1; } 
        else if (v.value == 8 || v.value == 9) { abilities[k].mod = 1; } 
        else if (v.value == 10 || v.value == 11) { abilities[k].mod = 2; }
        else if (v.value > 11) { abilities[k].mod = 3; }
        else { abilities[k].mod = 0; 
        };
      };
    };
  };

  // prepare NPC type specific data
  _prepareNPCData(actorData) {
    if (actorData.type !== "npc") return;
  };

  // prepare companion specific data
  _prepareCompanionData(actorData) {
    if (actorData.type !== "companion") return;
  };

  // prepare hireling specific data
  _prepareHirelingData(actorData) {
    if (actorData.type !== "hireling") return;
  };
  
  /**
   * Override getRollData() that's supplied to rolls
   */

  getRollData() {
    const data = super.getRollData();

    //prepare character roll data
    this._getCharacterRollData(data);

    return data;
  };

  _getCharacterRollData(data) {
    if (this.type !== "playerCharacter" || this.type !== "hireling") {
      return;
    };
    // add ability data to top level for access like `@str + 4`
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      };
    };

    // do the same for level or fallback to 0
    if (data.attributes.level) {
      data.level = data.attributes.level.value ?? 0;
    };
  };
};
