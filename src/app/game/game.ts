import CameraControls from "app/libs/camera-control-system";
import { isHumanPlayer } from "app/libs/utils";
import { HumanPlayer } from "app/players/human-player";
import { MAX_GAME_PLAYERS } from "app/resources/constants";
import { onUnitDeath } from "app/triggers/unit-death-trigger";
import { Round } from "./round";

export class Game {
	private static instance: Game;

	constructor() {
		if (!BlzLoadTOCFile("war3mapimported\\tower-defense.toc")) {
			print("Failed to load TOC file!");
		};

		SetGameSpeed(MAP_SPEED_FASTEST);
		SetMapFlag(MAP_LOCK_SPEED, true);
		SetMapFlag(MAP_USE_HANDICAPS, false);
		SetMapFlag(MAP_LOCK_ALLIANCE_CHANGES, true);
		SetTimeOfDay(8.00);
		SetAllyColorFilterState(0);
		FogEnable(true);
		FogMaskEnable(false);

		
		//Triggers
		// onPlayerLeave();
		onUnitDeath();
		// spellEffect();

		//Load Game
		this.onLoad();
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new Game;
		}

		return this.instance;
	}

	private onLoad() {
		const timer: timer = CreateTimer();

		TimerStart(timer, 0.0, false, () => {
			try {
				//Start timer for game length
				//UserInterface.onLoad();
				CameraControls.getInstance();

				for (let i = 0; i < MAX_GAME_PLAYERS; i++) {
					const player: player = Player(i);
					if (!isHumanPlayer(player)) continue

					new HumanPlayer(player);
				}

				Round.getInstance().newRound();
			} catch (error) {
				print(error)
			}
		})
	}
}