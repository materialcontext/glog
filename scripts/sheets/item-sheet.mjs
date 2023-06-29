/**
 * Extends the basic item sheet
 * @extends {ItemSheet}
 */

export class GlogItemSheet extends ItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["glog", "sheet", "item"],
            width: 520,
            height: 480,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
        });
    };

    /** @override */
    get template() {
        const path = "systems/glog/templates/item";
        return `${path}/item-sheet.html`;
    };

    /* -------------------------------------------- */
    /** @override */
    getData() {
        const context = super.getData();

        // clone the item
        const itemData = context.item;

        // get roll data
        context.rollData = {};
        let actor = this.object?.parent ?? null;
        if (actor) {
            context.rollData = actor.getRollData();
        };
        
        // convenience
        context.system = itemData.system;
        context.flags = itemData.flags;

        return context
    };

    /* ------------------------------------------_- */
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // do stuff here for editable fields
        if (!this.isEditable) return;

        // any roll handlers or click handlers or whatever should go here
    };
};