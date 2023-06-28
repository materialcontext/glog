export class PlayerCharacter extends Actor{
    
    /** @override */
    prepareData() {
        super.prepareData();
    };

    /** @override */
    prepareBaseData() {};

    /** @override */
    prepareDerivedData() {
        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags.glog || {};

        this._preparePlayerCharacterData(actorData);
        this._prepareNPCData(actorData);
    };
};