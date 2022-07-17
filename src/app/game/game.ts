import CameraControls from "app/libs/camera-control-system";
import { isHumanPlayer } from "app/libs/utils";
import { HumanPlayer } from "app/players/human-player";
import { MAX_GAME_PLAYERS } from "app/resources/constants";
import { onUnitDeath } from "app/triggers/unit-death-trigger";
import { Round } from "./round";

export class Game {
	private static instance: Game;

	constructor() {
		if (!BlzLoadTOCFile("war3mapimported\\customtoc.toc")) {
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
				this.buildCastleRects();

				for (let i = 0; i < MAX_GAME_PLAYERS; i++) {
					const player: player = Player(i);
					if (!isHumanPlayer(player)) continue

					new HumanPlayer(player, Round.getInstance().castleRects.pop());
				}

				//ClearTextMessages();
				Round.getInstance().newRound();
			} catch (error) {
				print(error)
			}
		})
	}

	private buildCastleRects() {
		Round.getInstance().castleRects.push(Rect(-640.0, 3328.0, 608.0, 4352.0));
		Round.getInstance().castleRects.push(Rect(-608.0, -4352.0, 640.0, -3328.0));
		Round.getInstance().castleRects.push(Rect(-4448.0, -544.0, -3200.0, 480.0));
		Round.getInstance().castleRects.push(Rect(3200.0, -544.0, 4448.0, 480.0));
		Round.getInstance().castleRects.push(Rect(-2496.0, 3264.0, -1248.0, 4288.0));
		Round.getInstance().castleRects.push(Rect(3136.0, 1440.0, 4384.0, 2464.0));
		Round.getInstance().castleRects.push(Rect(1312.0, -4352.0, 2560.0, -3328.0));
		Round.getInstance().castleRects.push(Rect(-4384.0, -2432.0, -3136.0, -1408.0));
		Round.getInstance().castleRects.push(Rect(1280.0, 3296.0, 2528.0, 4320.0));
		Round.getInstance().castleRects.push(Rect(3136.0, -2432.0, 4384.0, -1408.0));
		Round.getInstance().castleRects.push(Rect(-2496.0, -4288.0, -1248.0, -3264.0));
		Round.getInstance().castleRects.push(Rect(-4384.0, 1440.0, -3136.0, 2464.0));

		Round.getInstance().castleRects.reverse();
	}
}