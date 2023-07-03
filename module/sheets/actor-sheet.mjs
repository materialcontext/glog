import { onManageActiveEffect, prepareActiveEffectCategories } from "../helpers/effects.mjs"

/** @extends { ActorSheet }*/
export class PlayerCharacterSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["glog", "sheet", "actor"],
      resizable: false,
      template: "systems/glog/templates/actor/actor-npc-sheet.html",
      width: 1058,
      height: 550,
      tabs: [
        {
          navSelector: ".primary-tabs",
          contentSelector: ".primary-body",
          initial: "ego",
        },
      ],
    });
  };

  /** @override */
  get template() {
    return `systems/glog/templates/actor/actor-npc-sheet.html`
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

  _preparePlayerCharacterData(context) {
    // set ability score localization
    for (let [k, v] of Object.entries(context.system.abilities)) {
        v.label = game.i18n.localize(CONFIG.GLOG.abilities [k]) ?? k;
    };
  };

  _prepareItems(context) {
    // initialize containers
    const gear = [];
    const features = [];
    const spells = [];

    // allocate items to proper containers
    for (let i of context.items) {
        i.img = i.img || DEFAULT_TOKEN;

        if (i.type == 'item') {
            gear.push(i);
        } else if (i.type == 'feature') {
            features.push(i);
        } else if (i.type == 'spell') {
            spells.push(i);
        };

        context.gear = gear;
        context.features = features;
        context.spells = spells;
    };
  };

    /* ------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html)

        //render before edit check
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents('.item');
            const item = this.actor.items.get(li.data("itemId"));
        });

        // editable
        if (!this.isEditable) return;

        // add inventory
        html.find('.item-create').click(this._onItemCreate.bind(this));

        // delete inventory
        html.find('item-delete').click(ev => {
            const li = $(ev.currentTarget).parents('.item');
            const item = this.actor.items.get(li.data("itemId"));
            item.delete();
            item.slideUp(200, () => this.render(false));
        })

        // Active effect management
        html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

        // anything rollable
        html.find('.rollable').click(this._onRoll.bind(this));

        // drag events for macros
        if (this.actor.isOwner) {
            let handler = ev => this._onDragStart(ev);
            html.find('li.item').each((i, li) => {
                if (li.classList.contains("inventory-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
        };
    };
    /**
     * Handle creating new Owned items for a character based on the HTML data
     * @param {Event} event     The originating click event
     * @private
     */
    async _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        // get the type of the item
        const type = header.dataset.type;
        // clopy any relevant data
        const data = duplicate(header.dataset)
        // initialize a default name
        const name = `New ${type.capitalize()}`;
        // prepare the item object
        const itemData = {
            name: name,
            type: type,
            system: data
        };

        //clean up
        delete itemData.system["type"];

        return await Item.create(itemData, {parent: this.actor});
    };

    /**
     * Handle clickable rolls
     * @param {Event} event     the originating click event
     * @private
     */
    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        
        // handle item rolls
        if (dataset.rollType) {
            if (dataset.rollType == 'item') {
                const itemId = element.closest('.item').dataset.itemId;
                const item = this.actor.items.get(itemId);
                if (item) return item.roll();
            };
        };
        // handle rolls that supply their own formula
        if (dataset.roll) {
            let label = dataset.label ? `[ability] ${dataset.label}`: '';
            let roll = new Roll(dataset.roll, this.actor.getRollData());
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label,
                rollMode: game.settings.get('core', 'rollMode'),
            });
            return roll;
        };
    };
}
