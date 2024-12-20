/**
 * Extend the basic item class
 * @extends {Item}
 */
export class GlogItem extends Item {
  prepareData() {
    super.prepareData();
    this.chatTemplate = {
      weapon: 'systems/glog/templates/actor/parts/item-parts/weapons.html',
      gear: 'systems/glog/templates/actor/parts/item-parts/gear.html',
      spell: 'systems/glog/templates/actor/parts/item-parts/spells.html',
      armor: 'systems/glog/templates/actor/parts/item-parts/armor.html',
    };
  }

  async roll() {
    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
    };

    let cardData = {
      ...this.system,
      owner: this.actor.id,
    };

    chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);

    chatData.roll = true;

    return ChatMessage.create(chatData);
  }
}
