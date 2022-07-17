import { GamePlayer } from "app/players/game-player";
import { Scoreboard } from "app/game/scoreboard";
import { GameTimer } from "./game-timer";
import { HumanPlayer } from "app/players/human-player";
import { ShuffleArray } from "app/libs/utils";

interface RoundData {
	playerCount: number;
}

export const PHASE = {
	MODE_SELECTION: "Mode Selection Ends: ",
	RACE_SELECTION: "Race Selection Ends: ",
	DAY: "Day Ends In: ",
	NIGHT: "Night Ends In: ",
	COMPLETE: "Game Over"
}

/**
 * Create goldmines
 * Create castles - Set up priority system, middle spawn is first, then left spawn, the right spawn. THis can be manipulated to even out spawns on not full games
 * Create buildings
 * Run Mode selection
 * Run Hero Selection
 * Run Race Selection
 * Timer for day/night
 * victory
 * defeat
 * 
 */
export class Round {
	private static instance: Round;
	private count: number;
	private scoreBoard: Scoreboard;
	public castleRects: rect[];

	private data: Map<number, RoundData>;

	constructor() {
		this.count = 0;
		this.data = new Map<number, RoundData>();
		this.scoreBoard = new Scoreboard();
		this.castleRects = [];
		GameTimer.getInstance();
	}

	public newRound() {
		this.count++;
		this.data.set(this.count, {
			playerCount: GamePlayer.getPlayers().size,
		})

		print(`players in round: ${this.getData().playerCount}`);

		//Scoreboard.getInstance().create();
		// GamePlayer.getPlayers().forEach(gPlayer => {
		// 	gPlayer.giveGold(GamePlayer.STARTING_GOLD);
		// })

		this.startModeSelection();
	}

	private startModeSelection() {

		this.startRaceSelection();
	}

	private startRaceSelection() {
		let players: HumanPlayer[] = [];
		GamePlayer.getPlayers().forEach(p => {
			players.push(p);
		})

		ShuffleArray(players);

		//Place Castles
		//Place merc camps if allowed
		this.startRound();
		//Place race buildings
	}

	private startRound() {

	}

	public getData(key?: number): RoundData {
		return key === undefined ? this.data.get(this.count) : this.data.get(key);
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new Round();
		}
		return this.instance;
	}
}
