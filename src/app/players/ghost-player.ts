import { allyPlayers } from "app/libs/utils";
import { PLAYER_COLORS } from "app/resources/colordata";
import { GamePlayer } from "./game-player";
import { HumanPlayer } from "./human-player";

export class GhostPlayer extends GamePlayer {
	private owner: HumanPlayer;

	constructor(who: player) {
		super(who);

		GamePlayer.ghosts.set(who, this);
	}

	public onKill(u: unit) {
		this.owner.onKill(u);
	}

	public onDeath(dUnit: unit, kPlayer: HumanPlayer) {
		this.owner.onDeath(dUnit, kPlayer);
	}

	public giveGold(val: number) {
		this.owner.giveGold(val);
	}

	public getOwner(): HumanPlayer {
		return this.owner
	}

	public static create(who: player, owner: HumanPlayer): GhostPlayer {
		const gp: GhostPlayer = new GhostPlayer(who);
		this.init(gp, owner);
		return gp;
	}

	private static init(gp: GhostPlayer, human: HumanPlayer) {
		gp.owner = human;

		gp.names = {
			btag: gp.owner.getNames().btag,
			acct: gp.owner.getNames().acct,
			color: gp.owner.getNames().color,
			colorIndex: gp.owner.getNames().colorIndex
		}

		SetPlayerName(gp.player, gp.names.acct);
		SetPlayerColor(gp.player, PLAYER_COLORS[gp.names.colorIndex]);

		allyPlayers(gp.getPlayer(), human.getPlayer(), true, true);

		//TODO: get rid of multiboard
	}
}