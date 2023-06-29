/** @extends { ActorSheet }*/
export class playerCharacterSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["glog", "sheet", "actor"],
      template: "systems/glog/templates/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [
        {
          naveSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "features",
        },
      ],
    });
  };

  /** @override */
  get template() {
    return `systems/glog/templates/actor/actor-${this.actor.data.type}-sheet.html`
  };

  /* --------------------------------------------------- */

  /** @override */
  getData() {
    const context = super.getData();
    
    // copy the actor to operate safely
    const actorData = this.actor.toObject(false);
    
    // add to context for easy access
    context.system = actorData.system;
    context.flags = actorData.flags;

    // prepare playerCharacter data and items
    if (actorData.type == 'playerCharacter') {
        this._prepareItems(context);
        this._preparePlayerCharacterData(context);
    };

    //prepare NPC data
    if (actorData.type == 'npc') {};

    //prepareCompanionData
    if (actorData.type == 'companion') {};

    //prepare hireling data
    if (actorData.type == 'hireling') {};

    // roll data access
    context.rollData = context.actor.getRollData();

    // prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  };

  _preparePlayerCharacterData() {
    // set ability score lcoalization
    for (let [k, v] of Object.entries(context.data.abilities)) {
        v.label = game.il8n.localize(CONFIG.GLOG.abilities [k]) ?? k;
    };
  };
}
