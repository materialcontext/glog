/**
 * Extend the basic item class
 * @extends {Item}
 */
export default class GlogItem extends Item {

    prepareData() {
        super.prepareData();
      }

    chatTemplate = {
        "weapon": "systems/glog/templates/actor/parts/item-parts/weapons.html",
        "gear": "systems/glog/templates/actor/parts/item-parts/gear.html"
    };

    async roll() {
        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker()
        };

        let cardData = {
            ...this.system,
            owner: this.actor.id
        };

        chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);

        chatData.roll = true;

        return ChatMessage.create(chatData);
    }
}