// import { GamePlayer } from "app/game/player";
// import { ShowBountyFloatingText } from "app/libs/utils";
// import { AID } from "app/resources/abilID";

// export function spellEffect() {
// 	const unitSpellEffectTrig: trigger = CreateTrigger();

// 	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
// 		TriggerRegisterPlayerUnitEvent(unitSpellEffectTrig, Player(i), EVENT_PLAYER_UNIT_SPELL_EFFECT, null);
// 	}

// 	TriggerAddCondition(unitSpellEffectTrig, Condition(() => {
// 		const gplayer: GamePlayer = GamePlayer.fromPlayer.get(GetOwningPlayer(GetTriggerUnit()));
// 		const trigU: unit = GetTriggerUnit();

// 		switch (GetSpellAbilityId()) {
// 			case AID.SELL_TOWER:
// 				let effect = AddSpecialEffect("Abilities\\Spells\\Human\\Feedback\\SpellBreakerAttack.mdl", GetUnitX(trigU), GetUnitY(trigU));
// 				BlzSetSpecialEffectScale(effect, 1.25);
// 				DestroyEffect(effect);

// 				effect = AddSpecialEffect("Abilities\\Spells\\Items\\ResourceItems\\ResourceEffectTarget.mdl", GetUnitX(trigU), GetUnitY(trigU));
// 				BlzSetSpecialEffectScale(effect, 2);
// 				DestroyEffect(effect);
// 				effect = null;

// 				RemoveUnit(trigU);
// 				gplayer.giveGold(GetUnitPointValue(trigU));
// 				ShowBountyFloatingText(GetUnitX(trigU), GetUnitY(trigU), `+${GetUnitPointValue(trigU)}`);

// 				break;

// 			default:
// 				break;
// 		}

// 		return true;
// 	}));
// }