import { GLOG } from '../helpers/config.mjs';
import { registerEffectHandlers, registerCommonHandlers } from '../helpers/common-sheet-functions.mjs';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class GlogGearSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['glog', 'sheet', 'item'],
      resizable: false,
      width: 520,
      height: 445,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' }],
    });
  }

  /** @override */
  get template() {
    const path = 'systems/glog/templates/item';
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  _prepareContext() {
    const sheetData = super._prepare_context();
    const item = sheetData.item;

    sheetData.config = GLOG;
    item.showEffectsTab = true;

    return sheetData;
  }

  /** @override */
  _onRender(context) {
    super._onRender(context);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    registerEffectHandlers(html, this.item);
    registerCommonHandlers(html, this.item);
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find('.sheet-body');
    const bodyHeight = position.height - 192;
    sheetBody.css('height', bodyHeight);
    return position;
  }

  /* -------------------------------------------- */
}
