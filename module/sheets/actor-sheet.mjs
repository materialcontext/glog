import { GLOG } from "../helpers/config.mjs";
import { prepareActiveEffectCategories } from "../helpers/effects.mjs";
import { registerEffectHandlers,registerCommonHandlers,_tempEffectCreation,confirmation } from "../helpers/common-sheet-functions.mjs";

/** @extends { ActorSheet } */
export class PlayerCharacterSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["glog", "sheet", "actor"],
      resizable: false,
      template: "systems/glog/templates/actor/actor-sheet.html",
      width: 1210,
      height: 720,
      tabs: [
        {
          navSelector: ".primary-tabs",
          contentSelector: ".primary-body",
          initial: "history",
        },
        {
          navSelector: ".secondary-tabs",
          contentSelector: ".secondary-body",
          initial: "general",
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/glog/templates/actor/actor-sheet.html`;
  }

  /* --------------------------------------------------- */

  /** @override */
  async getData() {
    const context = super.getData();
    context.dtypes = ["String", "Number", "Boolean"];

    // copy the actor to operate safely
    const actorData = this.actor.toObject(false);

    // add to context for easy access
    context.config = GLOG;
    context.system = actorData.system;

    // prepare playerCharacter data and items
    if (actorData.type == "playerCharacter") {
      this._prepareItems(context);
      this._preparePlayerCharacterData(context);
    }

    //prepare NPC data
    if (actorData.type == "npc") {
    }

    //prepareCompanionData
    if (actorData.type == "companion") {
    }

    //prepare hireling data
    if (actorData.type == "hireling") {
    }

    // roll data access
    context.rollData = context.actor.getRollData();

    // prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    await this._prepareRenderedHTMLContent(context);
    return context;
  }

  _preparePlayerCharacterData(context) {
    // set ability score localization
    for (let [k, v] of Object.entries(context.system.abilities)) {
      v.label = game.i18n.localize(CONFIG.glog.abilities[k]) ?? k;
    }
  }

  _prepareItems(context) {
    let actor = context.actor;
    let equip = actor.system.equipment;

    const gear = [];
    const features = [];
    const consumables = [];
    const spells = [];
    const itemEffects = [];
    const weapons = [];
    const armors = [];
    const shields = [];

    for (let item of context.items) {
      let itemModel = item.system;

      if (itemModel.displayCategory === "weapon") {
        weapons.push(item);
      } else if (itemModel.displayCategory === "armor") {
        armors.push(item);
      } else if (itemModel.displayCategory === "shield") {
        shields.push(item);
      } else if (itemModel.displayCategory === "effect") {
        itemEffects.push(item);
      } else if (itemModel.displayCategory === "consumable") {
        consumables.push(item);
      } else if (itemModel.displayCategory === "spell") {
        spells.push(item);
      } else if (itemModel.displayCategory === "feature") {
        features.push(item);
      } else {
        gear.push(item);
      }
    }

    equip.weapons = weapons;
    equip.armors = armors;
    equip.shields = shields;
    equip.consumables = consumables;
    equip.gear = gear;

    actor.system.spells = spells;
    actor.system.features = features;
    actor.system.itemEffects = itemEffects;

    // apply inventory
    let inventory = 0;
    Object.values(equip).forEach(arr => arr.forEach(item => inventory += item.system.slots));
    actor.system.inventory.value = inventory;

    console.log(inventory, actor.system.inventory)
    actor.system.encumberance = Math.max(0, actor.system.inventory.value - actor.system.inventory.max);
  }

  async _prepareRenderedHTMLContent(context) {
    let actorModel = context.actor.system;

    let bio = await TextEditor.enrichHTML(actorModel.biography, {
      async: true,
    });
    context["htmlBiography"] = bio;
  }

  /* ------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    let actor = this.actor;

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    registerEffectHandlers(html, actor);
    registerCommonHandlers(html, actor);

    //render before edit check
    html.find(".item-edit").click((ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // editable
    if (!this.isEditable) return;

    // add inventory
    html.find(".item-create").click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find(".item-delete").click(async (ev) => {
      let askForOptions = ev.shiftKey;

      if (!askForOptions) {
        const li = $(ev.currentTarget).parents(".item");
        const itemName = [li.data("itemName")] ? [li.data("itemName")] : null;
        const popUpTitle = "Confirmation Needed";
        const popUpHeadline = "Delete" + " " + (itemName ? itemName : "");
        const popUpCopy =
          "<b>Warning:</b>This will delete the item from your sheet permanently";
        const popUpInfo =
          "<i><p style='font-size: 11px;'>To delete items without seeing this pop-up hold SHIFT while pressing the delete button.</p></i>";

        let popUp = await confirmation(
          popUpTitle,
          popUpHeadline,
          popUpCopy,
          popUpInfo
        );

        if (popUp.confirm === true) {
          actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
          li.slideUp(200, () => this.render(false));
        } else {
          return;
        }
      } else if (askForOptions) {
        const li = $(ev.currentTarget).parents(".item");
        actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
        li.slideUp(200, () => this.render(false));
      }
    });

    // anything rollable
    html.find(".rollable").click(this._onRoll.bind(this));

    // drag events for macros
    if (this.actor.isOwner) {
        let handler = ev => this._onDragStart(ev);
        html.find('li.item').each((i, li) => {
            if (li.classList.contains("inventory-header")) return;
            li.setAttribute("draggable", true);
            li.addEventListener("dragstart", handler, false);
        });
    };

    //Edit Item Input Fields
    html.find(".sheet-inline-edit").change(this._onSkillEdit.bind(this));

    //Edit Item Checkboxes
    html.find(".equipped.checkBox").click(async (ev) => {
      const itemId =
        ev.currentTarget.closest(".equipped.checkBox").dataset.itemId;
      const item = actor.items.get(itemId);
      let toggle = !item.system.active;
      const updateData = {
        "system.active": toggle,
      };
      const updated = item.update(updateData);

      //handles activation/deactivation of values provided by effects inherited from items
      let allEffects = this.object.effects;
      let effUpdateData = [];
      for (let effectScan of allEffects) {
        if (effectScan.origin) {
          let parentItem = await fromUuid(effectScan.origin);

          if (itemId === parentItem._id) {
            effUpdateData.push({
              _id: effectScan._id,
              disabled: !toggle,
            });
          }
        }
      }
      actor.updateEmbeddedDocuments("ActiveEffect", effUpdateData);
    });

    //show on hover
    html
      .find(".reveal")
      .on("mouseover mouseout", this._onToggleReveal.bind(this));
  }

  /** @override */
  async _onDropItemCreate(item) {
    // Create the owned item as normal
    return super._onDropItemCreate(item);
  }

  /**
   * Handle creating new Owned items for a character based on the HTML data
   * @param {Event} event     The originating click event
   * @private
   */
  async  _onItemCreate(event) {
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
  };

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
      if (dataset.rollType == "item") {
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }
    // handle rolls that supply their own formula
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : "";
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get("core", "rollMode"),
      });
      return roll;
    }
  }
}
