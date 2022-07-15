import { Titles } from "app/resources/titles";
import { GhostPlayer } from "./ghost-player";
import { HumanPlayer } from "./human-player";

interface Names {
	btag: string;
	acct: string;
	color: string;
	colorIndex: number;
}

export type PlayerType = HumanPlayer | GhostPlayer;

export abstract class GamePlayer {
	protected player: player;
	protected title: string;
	protected names: Names;
	protected hero: unit;

	protected static ghosts: Map<player, GhostPlayer> = new Map<player, GhostPlayer>();
	protected static players: Map<player, HumanPlayer> = new Map<player, HumanPlayer>();
	protected static names: Map<string, HumanPlayer> = new Map<string, HumanPlayer>();

	public static readonly STARTING_GOLD: number = 1000; //TODO Round Settings - 1000 is base

	constructor(who: player) {
		this.player = who;
		this.title = Titles[0];

		SetPlayerState(this.player, PLAYER_STATE_RESOURCE_GOLD, 0);
		SetPlayerState(this.player, PLAYER_STATE_GIVES_BOUNTY, 1);
	}

	abstract onKill(u: unit);
	abstract onDeath(dUnit: unit, kPlayer: HumanPlayer);
	abstract giveGold(val: number);

	public getNames() {
		return this.names;
	}

	public getPlayer() {
		return this.player;
	}

	public getTitle() {
		return this.title;
	}

	public getHero() {
		return this.hero;
	}

	public static get(who: player): PlayerType {
		return GamePlayer.isPlayer(who) ? GamePlayer.getPlayer(who) : GamePlayer.getGhost(who);
	}

	public static getGhost(who: string | player): GhostPlayer {
		if (typeof who === "string") {
			return null
		} else {
			return this.ghosts.get(who);
		}
	}

	public static getPlayer(who: string | player): HumanPlayer {
		if (typeof who === "string") {
			return GamePlayer.names.get(who);
		} else {
			return GamePlayer.players.get(who);
		}
	}

	public static getPlayers(): Map<player, HumanPlayer> {
		return this.players;
	}

	public static isPlayer(who: player): boolean {
		return this.players.has(who);
	}

	public static isGhost(who: player): boolean {
		return this.ghosts.has(who);
	}
}