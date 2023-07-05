import { registerEffectHandlers,registerCommonHandlers,_tempEffectCreation,confirmation } from "../helpers/common-sheet-functions.mjs";

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
      if(gearCheck.system.displayCategory === "ranged" || gearCheck.system.displayCategory === "ccweapon" || gearCheck.system.displayCategory === "gear" || gearCheck.system.displayCategory === "armor" || gearCheck.system.slotType === "consumable" || gearCheck.system.slotType === "digital"){
        actorModel.additionalSystems.hasGear = true;
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

    console.log(actorData);

    this._preparePlayerCharacterData(actorData);
    this._prepareNPCData(actorData);
  };

  // prepare playerCharacter type specific data
  _preparePlayerCharacterData(actorData) {
    if (actorData.type !== "playerCharacter") return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
  
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


  async getData() {
    const sheetData = super.getData();
    const actor = sheetData.actor;
    sheetData.dtypes = ["String", "Number", "Boolean"];
    
    // Prepare items.
    if(actor.img === "icons/svg/mystery-man.svg"){
      actor.img = "systems/eclipsephase/resources/img/anObjectificationByMichaelSilverRIP.jpg";
    }

    if (actor.type === 'playerCharacter') {
      this._prepareCharacterItems(sheetData);
    }

    await this._prepareRenderedHTMLContent(sheetData)

    //Prepare dropdowns
    sheetData.config = CONFIG.glog;

    return mergeObject(sheetData, {
      isGM: game.user.isGM
    });
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

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} sheetData the object handlebars uses to render templates
   *
   * @return {undefined}
   */
  async _prepareCharacterItems(sheetData) {
    const actor = sheetData.actor

    const gear = [];
    const consumables = [];
    const spells = [];
    const effects = [];
    const weapons = [];
    const armors = [];
    const shields = [];

    for (let item of sheetData.items) {
      let itemModel = item.system;

      if (itemModel.displayCategory === 'weapon') { weapons.push(item); }
      else if (itemModel.displayCategory === 'armor') { armors.push(item); }
      else if (itemModel.displayCategory === 'shield') { shields.push(item); }
      else if (itemModel.displayCategory === 'effect') { effects.push(item); }
      else if (itemModel.displayCategory === 'consumable') { consumables.push(item); }
      else if (itemModel.displayCategory === 'spell') { spells.push(item); }
      else { gear.push(item); };
    };

    actor.weapons = weapons;
    actor.armors = armors;
    actor.shields = shields;
    actor.spells = spells;
    actor.consumables = consumables;
    actor.gear = gear;
    actor.effects = effects;
  };

  async _prepareRenderedHTMLContent(sheetData) {
    let actorModel = sheetData.actor.system

    let bio = await TextEditor.enrichHTML(actorModel.biography, { async: true })
    sheetData["htmlBiography"] = bio
  }

  /** ----------------------------------------------------  */
  
  _onDrop

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    let actor = this.actor;

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    registerEffectHandlers(html, actor);
    registerCommonHandlers(html, actor);
   /* registerItemHandlers(html,this.actor,this);*/

    

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(async ev => {
      let askForOptions = ev.shiftKey;

      if (!askForOptions){
        const li = $(ev.currentTarget).parents(".item");
        const itemName = [li.data("itemName")] ? [li.data("itemName")] : null;
        const popUpTitle = "Confirmation Needed";
        const popUpHeadline = "Delete" + " " +(itemName?itemName:"");
        const popUpCopy = "<b>Warning:</b>This will delete the item from your sheet permanently";
        const popUpInfo = "<i><p style='font-size: 11px;'>To delete items without seeing this pop-up hold SHIFT while pressing the delete button.</p></i>";

        let popUp = await confirmation(popUpTitle, popUpHeadline, popUpCopy, popUpInfo);

        if(popUp.confirm === true){
          actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
          li.slideUp(200, () => this.render(false));
        }
        else{
          return
        }

      }
      else if (askForOptions){
        const li = $(ev.currentTarget).parents(".item");
        actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
        li.slideUp(200, () => this.render(false));
      }
    });

    // Drag events for macros.
    if (actor.isOwner) {
      let handler = ev => this._onDragItemStart(ev);
      html.find('li.item').each((i, li) => {
          if (li.classList.contains("inventory-header")) return;
          li.setAttribute("draggable", true);
          li.addEventListener("dragstart", handler, false);
      });
    }

    //Edit Item Input Fields
    html.find(".sheet-inline-edit").change(this._onSkillEdit.bind(this));

    //Edit Item Checkboxes
    html.find('.equipped.checkBox').click(async ev => {
        const itemId = ev.currentTarget.closest(".equipped.checkBox").dataset.itemId;
        const item = actor.items.get(itemId);
        let toggle = !item.system.active;
        const updateData = {
            "system.active": toggle
        };
        const updated = item.update(updateData);
        
        //handles activation/deactivation of values provided by effects inherited from items
        let allEffects = this.object.effects
        let effUpdateData=[];
        for(let effectScan of allEffects){

          if (effectScan.origin){
            let parentItem = await fromUuid(effectScan.origin);

            if (itemId === parentItem._id){

              effUpdateData.push({
                "_id" : effectScan._id,
                disabled: !toggle
              });

            }
          }
        }
        actor.updateEmbeddedDocuments("ActiveEffect", effUpdateData);
    });

    //show on hover
    html.find(".reveal").on("mouseover mouseout", this._onToggleReveal.bind(this));

    //post to chat WIP
    html.find('.post-chat').click(this._postToChat.bind(this));

  };

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */

  async _postToChat(event) {
    const itemID = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemID);

    console.log("this is item ", item);


    await item.roll();
  };

  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;
    const data = duplicate(header.dataset);
    const name = `New ${type.capitalize()}`;
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    
    delete itemData.data["type"];
    this.actor.createEmbeddedDocuments("Item", [itemData]);
  }


  _onSkillEdit(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;
    let item = this.actor.items.get(itemId);
    let field = element.dataset.field;

    return item.update({ [field]: element.value });
  }

  _onToggleReveal(event) {
    const reveals = event.currentTarget.getElementsByClassName("info");
    $.each(reveals, function (index, value){
      $(value).toggleClass("icon-hidden");
    })
    const revealer = event.currentTarget.getElementsByClassName("toggle");
    $.each(revealer, function (index, value){
      $(value).toggleClass("noShow");
    })
  }
};
