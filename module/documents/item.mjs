/**
 * Extend the basic item class
 * @extends {Item}
 */
export class GlogItem extends Item{
    prepareData() {
        super.prepareData();
    };

    /**
     * Prepare data to pass to Rolls created by an item
     * @private
     */
    getRollData() {
        if (!this.actor) return null;
        // get actor data
        const rollData = this.actor.getRollData();
        // get item data
        rollData.item = foundry.utils.deepClone(this.system);

        return rollData;
    };

    /**
     * Handle clickable
     * @param {Event} event     originating click event
     * @private
     */
    async roll() {
        const item = this;

        // initialize chat data
        const speaker = ChatMessage.getSpeaker({actor: this.actor});
        const rollMode = game.settings.get('core', 'rollMode');
        const label = `[item.type] ${item.name}`;

        // if there's no roll data send a message else create the roll and message
        if (!this.system.formula) {
            ChatMessage.create({
                speker: speaker,
                rollMode: rollMode,
                flavor: label,
                content: item.system.description ?? ''
            });
        } else {
            const rollData = this.getRollData();

            // roll and submit to chat
            const roll = new this.roll(rollData.item.formula, rollData);
            // if you need to store value for use uncomment next line
            // let result = await roll.roll({async: true});
            roll.toMessage({
                speaker: speaker,
                rollMode: rollMode,
                flavor: label,
            });
            return roll;
        };
    };
};