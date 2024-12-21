import { GLOG } from '../helpers/config.mjs';
import { prepareActiveEffectCategories } from '../helpers/effects.mjs';
import { registerEffectHandlers, registerCommonHandlers, confirmation } from '../helpers/common-sheet-functions.mjs';

/** @extends { ActorSheet } */
export class PlayerCharacterSheet extends ActorSheet {
  /** @override */

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['glog', 'sheet', 'actor'],
      resizable: false,
      width: 1210,
      height: 720,
      tabs: [
        { navSelector: '.primary-tabs', contentSelector: '.primary-body', initial: 'history' },
        { navSelector: '.secondary-tabs', contentSelector: '.secondary-body', initial: 'general' },
      ],
    });
  }

  // static PARTS = { actor: { template: 'systems/glog/templates/actor/actor-sheet.html' } };

  /** @override */
  get template() {
    return `systems/glog/templates/actor/actor-sheet.html`;
  }

  /* --------------------------------------------------- */

  /** @override */
  async _prepareContext() {
    const actorData = super._prepare_context();
    context.dtypes = ['String', 'Number', 'Boolean'];

    // Copy the actor to operate safely
    const context = actorData.data;

    // Add to context for easy access
    context.config = GLOG;
    context.system = actorData.system;

    // Prepare playerCharacter data and items
    if (context.type === 'playerCharacter') {
      this._prepareItems(context);
      this._preparePlayerCharacterData(context);
    }

    // Roll data access
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    await this._prepareRenderedHTMLContent(context);
    return context;
  }

  _preparePlayerCharacterData(context) {
    for (let [k, v] of Object.entries(context.system.abilities)) {
      v.label = k;
    }
  }

  _prepareItems(context) {
    console.log(context);
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

      if (itemModel.displayCategory === 'weapon') {
        weapons.push(item);
      } else if (itemModel.displayCategory === 'armor') {
        armors.push(item);
      } else if (itemModel.displayCategory === 'shield') {
        shields.push(item);
      } else if (itemModel.displayCategory === 'effect') {
        itemEffects.push(item);
      } else if (itemModel.displayCategory === 'consumable') {
        consumables.push(item);
      } else if (itemModel.displayCategory === 'spell') {
        spells.push(item);
      } else if (itemModel.displayCategory === 'feature') {
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

    let inventory = 0;
    Object.values(actor.system.equipment).forEach((arr) => {
      arr.forEach((item) => (inventory += item.system.slots));
    });
    actor.system.inventory.value = inventory;

    actor.system.encumberance = Math.max(0, actor.system.inventory.value - actor.system.inventory.max);
    if (actor.overrides.system && actor.overrides.system.encumberance) {
      actor.system.encumberance += actor.overrides.system.encumberance;
    }
  }

  async _prepareRenderedHTMLContent(context) {
    let actorModel = context.actor.system;

    let bio = await TextEditor.enrichHTML(actorModel.biography, {
      async: true,
    });
    context['htmlBiography'] = bio;
  }

  /* ------------------------------------- */

  /** @override */
  _onRender(context) {
    super._onRender(context);

    let actor = this.actor;

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    registerEffectHandlers(html, actor);
    registerCommonHandlers(html, actor);

    // Render before edit check
    html.find('.item-edit').click((ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    // Editable
    if (!this.isEditable) return;

    // Add inventory
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(async (ev) => {
      let askForOptions = ev.shiftKey;

      if (!askForOptions) {
        const li = $(ev.currentTarget).parents('.item');
        const itemName = li.data('itemName') ?? null;
        const popUpTitle = 'Confirmation Needed';
        const popUpHeadline = 'Delete' + ' ' + (itemName ? itemName : '');
        const popUpCopy = '<b>Warning:</b>This will delete the item from your sheet permanently';
        const popUpInfo =
          "<i><p style='font-size: 11px;'>To delete items without seeing this pop-up hold SHIFT while pressing the delete button.</p></i>";

        let popUp = await confirmation(popUpTitle, popUpHeadline, popUpCopy, popUpInfo);

        if (popUp.confirm === true) {
          actor.deleteEmbeddedDocuments('Item', [li.data('itemId')]);
          li.slideUp(200, () => this.render(false));
        } else {
          return;
        }
      } else if (askForOptions) {
        const li = $(ev.currentTarget).parents('.item');
        actor.deleteEmbeddedDocuments('Item', [li.data('itemId')]);
        li.slideUp(200, () => this.render(false));
      }
    });

    // Anything rollable
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros
    if (actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }

    // Edit Item Input Fields
    html.find('.sheet-inline-edit').change(this._onSkillEdit.bind(this));

    // Edit Item Checkboxes
    html.find('.equipped.checkBox').click(async (ev) => {
      const itemId = ev.currentTarget.closest('.equipped.checkBox').dataset.itemId;
      const item = actor.items.get(itemId);
      let toggle = !item.system.active;
      const updateData = {
        'system.active': toggle,
      };
      const updated = item.update(updateData);

      // Handles activation/deactivation of values provided by effects inherited from items
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
      actor.updateEmbeddedDocuments('ActiveEffect', effUpdateData);
    });

    // Show on hover
    html.find('.reveal').on('mouseover mouseout', this._onToggleReveal.bind(this));
  }
}
