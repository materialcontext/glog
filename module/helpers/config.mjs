export const GLOG = {};

GLOG.system = 'glog';

/** Abilities used in the system
 * @type {Object} 
 * */
GLOG.abilities = {
    "str": "Strength",
    "dex": "Dexterity",
    "con": "Constitution",
    "int": "Intelligence",
    "wis": "Wisdom",
    "cha": "Charisma"
};

GLOG.classes = {
    "acrobat": {
        "name": "Acrobat",
        "0": {
            "Level-0": "You gain +1 Move  and +1 Defense against Melee Attacks for every 2 Acrobat templates. If you are encumbered or have your Movement impaired, you lose these bonuses.",
            "equipment": "50’ of rope; good shoes"
        },
        "1": {
            "Tricky": "Whenever you Attack or execute a Combat Maneuver and get doubles (other than snake-eyes), you may attempt a free Combat Maneuver or Dexterity check.",
            "Nimble": "You get +1 bonus on all Dexterity Checks related to balancing, climbing, tumbling, and Sneak. Reduce all fall damage by 1d6."
        },
        "2": {
            "Escape Artist": "You have +2 bonus on all checks to escape something that is restraining you. This includes grapples, lynchings, and awkward social situations, but not sealed coffins.",
            "Close Call": "You always get a Dexterity save to get out of the path of danger, even if you have no idea it’s coming. Additionally, whenever you have at least 1 HP and would roll a Trauma Save as a result of a critical hit or a failed save, drop to 0 HP instead."
        },
        "3": {
            "Traceur": "You ignore any movement penalties caused by obstacles and any action penalties caused by moving. If there is a stable wall, you may treat it as if it were flat ground while moving, so long as you end your movement on a flat (horizontal) surface.",
            "Redirect": "When an enemy misses you with a melee attack, you may choose an adjacent target to take the blow instead.  The new target rolls their defense as normal."
        },
        "4": {
            "The Greatest Escape": "Once per lifetime, you can literally escape death.  Your DM will describe the afterlife to you, as well as the opportunity that allows you to escape (if  you wish to). This ability has no effect if your body has been destroyed beyond plausibility. A solo adventure to return to the land of the living is encouraged, but not required."
        }
    },
    "assassin": {
        "name": "Assassin",
        "0": {
            "level-0": "You get +2 on all Stealth checks. Attacks you make against unaware targets ignore 2HP for each Assassin template.",
            "equipment": "Fraudulent papers; a black mask; and a knife or a pistol with 1 magazine."
        },
        "1": {
            "Poisoner": "You know all there is to know about poisons and with a week and a few 10s silver to the right people you can acquire just what you need. This includes toxic plants, venomous snakes, and inorganic poisons, but not novel magics or supernatural curses. ",
            "Deadly Improvisation": "You ignore all penalties to improvised weapons and your light weapons deal an additional 1d4 damage."
        },
        "2": {
            "Mr. Thus-and-Such": "With a week and a few 10s of silver to the right friends, you can create a foolproof false identity. For example, you might acquire appropriate clothing, letters of introduction, and official-looking certification to establish yourself as an important merchant from a remote city. Make a disguise check. On 11-12 the effect is perfect. On a 2-3 there is a small flaw, detectable only by those who are exceptionally worldly.",
            "Studied Target": "Keep a list of potential targets – up to the number of Assassin templates you possess – and important facts about them.  Whenever you attempt to track, investigate, or harm a target on your list, you may cross off a fact related to the target and add a +1 bonus to the roll. It’s up to you to explain how such a fact is relevant. These facts can be simple but they shouldn't be obvious."
        },
        "3": {
            "Dramatic Infiltration": "So long as you are not in immediate danger, you may declare that you are walking off-screen. Later on in a different scene, you may reveal yourself to have been a minor NPC in the background of the scene “all along” as long as there actually are minor NPCs in the background of the scene. You can always walk back on stage at any time, even climbing in a window. This ability is limited only by plausibility.",
            "Co-conspirator": "Whenever you work with a hireling you've hired  to murder or spy on a target, that hireling receives bonuses as if they were you so long as you are in the scene with them."
        },
        "4": {
            "Assassinate": "Any target you know three facts about who fails a Trauma Save against you dies instantly."
        }
    },
    "barbarian": {
        "name": "Barbarian",
        "0": {
            "Level-0": "You get +1 HP for each Barbarian template you possess.",
            "equipment": "an ax, hammer, or farm tool; olive oil, whiskey, light armor"
        },
        "1": {
            "Uncivilized": "Your homeland is on the edge of the map, at the border of the empire, beyond the reach of the tax collector. Nobody thinks the bonds of feudal society apply to you. People who consider themselves civilized will universally mark you as an outsider. You can always find someone to explain what is happening, find people looking for disposable assistance, and find people interested in foreign cultures.",
            "Foreign": "You get the language of your homeland, a +1 bonus to Attack rolls with an exotic weapon of your choice,  and 2 random features from Table 2-1. Everyone outside your culture thinks this stuff is weird."
        },
        "2": {
            "Reputation For...": "Whether or not it's true, people of your culture have a certain reputation. There’s a 50% chance characters you meet can tell where you’re from just by appearance. You gain a random reputation from Table 2-2.",
            "Tough": "This civilization makes men weak and decadent. Where they crumble, you survive. You get a +1 bonus on all Endurance checks and Trauma Saves. The first time you take a wound in an encounter regain 1d6 HP."
        },
        "3": {
            "Danger Sense": "You get a +1 bonus to Hide checks for every two Barbarian templates you possess. Additionally, improve all Ambush die results by 1 and any time you would be surprised, make a DC 7 Wisdom Check.  On a success you are not surprised. ",
            "Feats of Strength": "Whenever you roll doubles (other than snake eyes) on a Strength check double your Strength bonus for that roll. Likewise, when you roll doubles and hit with a Melee Attack roll (other than snake-eyes) double your Strength bonus for damage."
        },
        "4": {
            "Tread the Jeweled thrones": "Kings are nothing to you, you were born to lay them low. Sovereigns and tyrants have no HP against you. This includes true sovereigns, leaders of criminal syndicates or cults, champions, etc."
        }
    },
    "courtier": {
        "name": "Courtier",
        "0": {
            "Level-0": " You get a +1 bonus on all Reaction rolls for every 2 Courtier templates you possess.",
            "equipment": "fine clothes, crippling debt, 4d6 silver"
        },
        "1": {
            "Courtly Education": "You get +1 language and are trained in archery. You get +1 on all rolls related to dress, dance, etiquette, horseback riding,  poetry, and verse.",
            "Fast Talker": "You are an expert blatherer, liar, and wit. You can persuade any number of people that what you are saying is true for 1d6 minutes, provided it is not obviously untrue. Sober, angry, and intelligent people get a Save to negate. When the effect ends, they realize what you've been saying is utter nonsense. Idiots believe you forever."
        },
        "2": {
            "Welcome Guest": "You have no trouble finding an invitation to dinner and never pay for lodging. When entering a new town you have a 4-in-6 chance of having already received an invitation from a local lord or wealthy merchant.",
            "Entourage": ""
        },
        "3": {
            "Never Forget a Face": "Memorizing the ins-and-outs of noble lineage and court life has given you a perfect memory for names and faces. When you meet someone new, you have a 3-in-6 chance of knowing their name. If they are nobility or from an otherwise prominent house, you have a 4-in-6 chance and also know their title and details about their family. This may even apply to named monsters and other implausible encounters.",
            "Loyal servants": "If an Attack would cause you to make a Trauma Save, an adjacent hireling takes the damage instead. Your servants will act proactively on your behalf, doing their best to look after what they believe to be your interests. "
        },
        "4": {
            "Windfall": "You inherit 4d6 * 1000 gold. Perhaps an uncle died. 1d6 nuisance relatives will be showing up at your door to live in your house and ask for money, and turning them away would be deadly to your reputation. Coincidentally, there is a 4-in-6 chance that the Assassin's Guild has just accepted a contract to kill you."
        }
    },
    "fighter": {
        "name": "Fighter",
        "0": {
            "Level-0": "You get a +2 bonus on all Attack rolls.",
            "equipment": "any armor of your choice, any 2 melee or thrown weapons or 1 firearm with 2 magazines; a nasty scar"
        },
        "1": {
            "Battle Scars": "Each time you recover from a wound that could have killed you, increase your max HP by 1 up to the number of fighter templates you possess. You regain this much HP at the start and end of every fight.",
            "Veteran's Eye": "You've seen and fought opponents of every imaginable kind and you can size people up at a glance.  You have a good idea of what an enemy is capable of and how much punishment he can take.  At the start of combat you learn the target's current HP (in hit dice) and Strength or Dexterity (whichever is higher) of a number of enemies equal to your intelligence modifier (minimum 1). "
        },
        "2": {
            "Cut Down": "You get a +2 damage bonus on opportunity attacks and attacks against fleeing enemies. Those with a penchant for wanton bloodletting are likely to develop a deserved reputation.",
            "Reputation for Mercy": "You’ve been fair in your dealings and merciful to your opponents. Your reputation has spread far beyond you. Whenever you encounter another fighter or leader of importance there is a 5-in-6 chance they’ve heard of you. You have a +1 bonus to all reaction rolls and Diplomacy checks against characters who’ve heard of you. In the event you do not deserve such a reputation, replace this feature with the Barbarian’s Reputation for Violence feature. Once you lose this feature, you cannot regain it."
        },
        "3": {
            "Superior Combatant": "When you hit with an attack and roll doubles it's a critical hit.  If you miss but get doubles, execute a free Combat Maneuver. ",
            "Impress": "Whenever you win a fight against challenging foes, people who don't like you make a new reaction roll. This even works on people you just defeated in combat, unless you caused them undeserved or disproportionate harm."
        },
        "4": {
            "Double Attack": "You can attack twice per round on your turn."
        }
    },
    "hunter": {
        "name": "Hunter",
        "0": {
            "Level-0": "You are trained in archery and have a +1 Attack bonus with bows for every two Hunter templates you possess.",
            "equipment": "light armor; a bow and 10 arrows or a rifle and 1 magazine;"
        },
        "1": {
            "Tracker": "When you have the Recon Die, your chances of surprising the enemy or finding its trail increase to 2-in-6. You may designate a specific creature as your quarry. You learn one new fact about it whenever you encounter it.",
            "Woodsman": "You don't need to make Endurance checks related to travel, you are not Deprived for resting without bedroll or fire, you have no trouble finding sources of food and water in the wilderness, and you ignore penalties from difficult terrain when alone."
        },
        "2": {
            "Stalker": "You get a +1 bonus to Sneak and Hide checks for every 2 Hunter templates you possess. Improve all results of the Ambush die by 1.",
            "Animal Companion": "You have an animal companion you trained yourself. This companion can perform a certain action when a condition is true. The most common one is “attack when I fire”, but others are possible. Normally you'd spend a round giving orders to your pet. It learns an extra such action for each Hunter template you possess. Animal companions roll 2d6 for three stats and 1d6 for the other three (player's choice). They have 1d4 HP, no Attack bonus, light weapon damage, and start at 6 loyalty. They don't gain levels, take shares of loot, or count toward the number of hirelings you can hire."
        },
        "3": {
            "Trapper": "You're experienced with all kinds of animal traps. You can set any animal trap (snares, pits, cages, etc.) in five minutes and you immediately spot any such trap.  You get a +2 bonus on any roll to construct or spot non-magical traps outside this expertise.",
            "Advantageous Terrain": "If you have the Recon die and roll an active or passive encounter in the wild, you can draw the map for the encounter and may decide where everyone is, so long as it's plausible. If you are outdoors but in an urban environment, you may add 2 minor features to the scene."
        },
        "4": {
            "Legendary Hunt": "You can kill anything. Work with your DM to plan a hunt of any non-humanoid creature in the game world. Whatever you kill should be utterly unique and the reward for killing it should take the place of a capstone feature. "
        }
    },
    "thief": {
        "name": "Thief",
        "0": {
            "Level-0": "You gain +1 Stealth for every 2 Thief templates you possess. You immediately know the price-range of any valuable item you see.",
            "equipment": "light armor; a light weapon or a stolen pistol and 1 magazine."
        },
        "1": {
            "Pick-Pocket": "You can steal a single item off of any person you come into physical contact with so long as it is plausible to do so and they don't have reason to be suspicious of you. The object must not be firmly secured and you must be able to see the object or declare a location on their person (e.g. 'left pocket'). Eventually they figure out it's been stolen. Try not to be a suspect.  You can also use this to place an item on someone.",
            "Black Market gossip": "You have a 4-in-6 chance of knowing the origin, owner, and history of any unique item you see or hear about. This feature also works if you see or hear about the owner of such an item."
        },
        "2": {
            "Well-Planned Heist": "If you thoroughly investigate a building or lair before breaking in, you may add the Recon Die to any one roll during the break-in by explaining how the recon helped. Additionally, when you roll the Recon Die, you reveal evidence of secret passages as well as monsters.",
            "Change Hands": "You don’t have it. At any time you can reduce your HP to zero and declare that you don’t have the thing you had. Give it to any character you’ve encountered since you acquired or last used the item."
        },
        "3": {
            "Always Prepared": "When in town, you may spend any amount of money and inventory slots to buy an Unlabeled Package. When the package is unwrapped, you declare what it contains. The contents must use the appropriate number of Inventory Slots, not cost more than you paid, and be available in town. You can only have two Unlabeled Packages at a time.",
            "A Motley Crew": "You may hire any specialist you need for a heist in place of mercenaries. All characters hired this way are level 1 thieves with a specialized class feature. They all hate each other. Let your DM know in advance so they can prepare a roster of options."
        },
        "4": {
            "Heist of the Century": "You can steal anything. It’s time to prove it. Work with your DM to plan a heist of anything in the game world. Whatever you steal should be irreplaceable and take the place of a capstone feature. "
        }
    },
    "wizard": {
        "name": "Wizard",
        "0": {
            "Level-0": "You gain +1 magic dice (MD) for every Wizard template you possess.        ",
            "equipment": " varies by school"
        },
        "1": {
            "School of Magic": "Pick a school of magic. Each school of magic comes with restrictions,  perks, and minor improvements to certain spells associated with your school. Each school of magic also comes with a starting spellbook. See Schools of Magic for more information. ",
            "Book Casting": "You cast from a scroll or a spellbook in a way that does not expend the spell. You do not gain the free casting die normally generated by a scroll, and automatically fumble the spell if you take any damage before the casting is completed at the end of the round. The spell vanishes from the scroll and returns again the next morning."
        },
        "2": {
            "Ancient Tongues": "When you encounter a bit of language that you don’t know—like a page in a book, inscription on a ring, or occult phrase—there’s a 2-in-6 chance you know it. Not that you know the whole language, just that you happen to know what this particular bit of language means.",
            "Intellect Fortress": "You get  +1 to mental saves for each Wizard template you possess."
        },
        "3": {
            "One More Thing": "When the DM finishes introducing a named character or new part of the  world you can add one extra detail–limited to what the table tolerates.",
            "Autochthonous Spell": "Choose one Legendary spell from your Wizard school or work with your DM to create another. This spell is endemic to your mind, does not take up a spell slot, and vanishes from your mind when cast. It returns to you in the morning--unless you write it down--in which case it becomes a normal spell and can be consumed and destroyed. If you lose it in this way, you have a 1-in-6  chance of recovering it during each downtime."
        },
        "4": {
            "Wizard's Tower": "You feel compelled to build a tower. Maybe not a literal tower. It could be a library, laboratory, or another building suitable for arcane research. You must spend 1000s on a starter structure. If another member of the party already has such a building you may use that instead. Every floor of your tower grants you an additional spell slot.  Each new addition to the tower costs double the previous one. You may enchant it and stock it with creatures if you wish, at great expense."
        }
    }
};

GLOG.genders = {
    "masc": "He/Him",
    "femm": "She/Her",
    "andr": "They/Them"
}

GLOG.origins = {
    "noble": "Noble",
    "freeman": "Freeman",
    "peasant": "Peasant",
    "barbarian": "Barbarian"
};

GLOG.abbrev = {
    "str": "STR",
    "dex": "DEX",
    "con": "CON",
    "int": "INT",
    "wis": "WIS",
    "cha": "CHA"
  };
  