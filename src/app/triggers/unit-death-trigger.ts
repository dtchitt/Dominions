import { GamePlayer, PlayerType } from "app/players/game-player";

export function onUnitDeath() {
	const unitDeathTrig: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
		TriggerRegisterPlayerUnitEvent(unitDeathTrig, Player(i), EVENT_PLAYER_UNIT_DEATH, null);
	}

	TriggerAddCondition(unitDeathTrig, Condition(() => {
		const kPlayer: PlayerType = GamePlayer.get(GetOwningPlayer(GetKillingUnit()));
		
		if ("getSlave" in kPlayer) {
			GamePlayer.get(GetOwningPlayer(GetTriggerUnit())).onDeath(GetTriggerUnit(), kPlayer);
			print("human killer")
		} else {
			GamePlayer.get(GetOwningPlayer(GetTriggerUnit())).onDeath(GetTriggerUnit(), kPlayer.getOwner());
			print("slave killer")
		}

		kPlayer.onKill(GetTriggerUnit());
		
		//TODO Check for Victory if its a castle dying
		return true;
	}));
}