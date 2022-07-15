import { GamePlayer } from "app/players/game-player";

export function onPlayerLeave() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYERS; i++) {
	    TriggerRegisterPlayerEvent(t, Player(i), EVENT_PLAYER_LEAVE);
	}

	TriggerAddCondition(t, Condition(() => {
		GamePlayer.getPlayer(GetTriggerPlayer()).onLeave();

		return true;
	}))
}