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
		Round.getInstance().castleRects.push(gg_rct_arenaRed)
		Round.getInstance().castleRects.push(gg_rct_arenaGreen)
		Round.getInstance().castleRects.push(gg_rct_arenaLightBlue)
		Round.getInstance().castleRects.push(gg_rct_arenaPurple)
		Round.getInstance().castleRects.push(gg_rct_arenaBrown)
		Round.getInstance().castleRects.push(gg_rct_arenaTeal)
		Round.getInstance().castleRects.push(gg_rct_arenaOrange)
		Round.getInstance().castleRects.push(gg_rct_arenaGrey)
		Round.getInstance().castleRects.push(gg_rct_arenaBlue)
		Round.getInstance().castleRects.push(gg_rct_arenaYellow)
		Round.getInstance().castleRects.push(gg_rct_arenaPink)
		Round.getInstance().castleRects.push(gg_rct_arenaDarkGreen)

		Round.getInstance().castleRects.reverse();//Im so lazy :P
	}
}