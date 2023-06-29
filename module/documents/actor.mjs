export class PlayerCharacter extends Actor {
    
    /** @override */
    prepareData() {
        super.prepareData();
    };

    /** @override */
    prepareBaseData() {};

    /** @override */
    prepareDerivedData() {
        const actorData = this;
        const systemData = actorData.system;
        const flags = actorData.flags.glog || {};

        this._preparePlayerCharacterData(actorData);
        this._prepareNPCData(actorData);
    };
    
    // prepare playerCharacter type specific data
    _preparePlayerCharacterData(actorData) {
        if (actorData.type !== 'playerCharacter') return;

        //make data modifications here
    };

    // prepare NPC type specific data
    _prepareNPCData(actorData) {
        if (actorData.type !== 'npc') return;
    };

    // prepare companion specific data
    _prepareCompanionData(actorData) {
        if (actorData.type !== 'companion') return;
    };
    
    // prepare hireling specific data
    _prepareHirelingData(actorData) {
        if (actorData.type !== 'hireling') return;
    };

    /**
     * Override getRollData() that's supplied to rolls
     */
    getRollData() {
        const data = supeer.getRollData();

        //prepare character roll data
        this._getCharacterRollData(data);

        return data;
    };

    _getCharacterRollData() {
        // add ability data to top level for access like `@str + 4`
        if (data.abilities) {
            for (let [k, v] of Object.entries(data.abilities)) {
                data[k] = foundry.utils.deepClone(v);
            };
        };

        // do the same for level or fallback to 0
        if (data.overview.level) {
            data.level = data.overview.level.value ?? 0;
        };
    };
};