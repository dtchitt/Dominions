import { allyPlayers } from "app/libs/utils";
import { PLAYER_COLORS, PLAYER_COLOR_CODES, PLAYER_COLOR_NAMES } from "app/resources/colordata";
import { NEUTRAL_HOSTILE } from "app/resources/constants";
import { Titles } from "app/resources/titles";
import { UID } from "app/resources/unitID";
import { GamePlayer } from "./game-player";
import { GhostPlayer } from "./ghost-player";

export class HumanPlayer extends GamePlayer {
	private slave: GhostPlayer;
	private race: any; //TODO decide on how race is stored and selected
	private goldMines: unit[];
	private king: HumanPlayer;
	private vassels: HumanPlayer[];
	private color: {
		real: playercolor,
		delta: playercolor
	}
	private castle: {
		unit: unit,
		x: number,
		y: number
	}

	constructor(who: player, rect: rect) {
		super(who);

		this.names = {
			btag: GetPlayerName(who),
			acct: GetPlayerName(who).split('#')[0],
			color: "",
			colorIndex: 0
		}

		for (let i = 0; i < PLAYER_COLORS.length; i++) {
			if (GetPlayerColor(this.player) != PLAYER_COLORS[i]) break;

			this.names.colorIndex = i;
			this.names.color = PLAYER_COLOR_NAMES[i];
		}

		GamePlayer.names.set(this.names.acct, this);
		GamePlayer.players.set(who, this);

		this.slave = GhostPlayer.create(Player(GetPlayerId(who) + 12), this);
		this.goldMines = [];
		this.color = {
			real: GetPlayerColor(this.player),
			delta: GetPlayerColor(this.player)
		}

		this.vassels = [];

		const cx: number = GetRectCenterX(rect);
		print(`x ${cx}`)
		const cy: number = GetRectCenterY(rect);
		print(`y ${cy}`)

		this.castle = {
			unit: CreateUnit(this.player, UID.CASTLE, cx, cy, 270),
			x: cx,
			y: cy
		}
	}

	public onKill(u: unit) {
		//if (kPlayer == this) return;
		//TODO: Tracking
		//TODO: Bounty
		//TODO: Goldmines
	}

	public onDeath(dUnit: unit, kPlayer: HumanPlayer) {
		if (kPlayer == this) return; //TODO instead of return, just build castle. but also we want to avoid letting units attack own units/allies may need trigger to stop it
		//TODO: Tracking

		if (dUnit == this.castle.unit) {
			//TODO Message players this player has been conquered
			//TODO Play sound?

			this.king = kPlayer; //Set this king to kPlayer
			this.setColor(kPlayer.color.real); //Set this color to kPlayers color
			kPlayer.getVassles().push(this); //Add this to kPlayer vassels
			allyPlayers(this.player, kPlayer.getPlayer(), true); //Ally this with kPlayer
			allyPlayers(this.player, kPlayer.getSlave().getPlayer(), true); //Ally this with kPlayer slave
			allyPlayers(this.slave.getPlayer(), kPlayer.getPlayer(), true); //Ally slave with kPlayer
			allyPlayers(this.slave.getPlayer(), kPlayer.getSlave().getPlayer(), true); //Ally slave with kPlayer slave

			for (let i = 0; i < kPlayer.getVassles().length; i++) {
				const kVassels: HumanPlayer[] = kPlayer.getVassles();

				allyPlayers(this.player, kVassels[i].getPlayer(), true); //Ally this with all kPlayers vassels
				allyPlayers(this.player, kVassels[i].getSlave().getPlayer(), true); //Ally this with all kPlayers vassels slave
				allyPlayers(this.slave.getPlayer(), kVassels[i].getPlayer(), true); //Ally slave with all kPlayers vassels
				allyPlayers(this.slave.getPlayer(), kVassels[i].getSlave().getPlayer(), true); //Ally slave with all kPlayers vassels slave

				for (let j = 0; j < this.vassels.length; j++) {
					const vassel: HumanPlayer = this.vassels[j];

					vassel.setKing(kPlayer); //Set vassels king to Kplayer
					vassel.setColor(kPlayer.color.real) //Set vassels color to Kplayer
					kPlayer.getVassles().push(vassel); //Add vassel to kPlayer vassels

					allyPlayers(vassel.getPlayer(), kPlayer.getPlayer(), true); //Ally vassels to Kplayer
					allyPlayers(vassel.getPlayer(), kPlayer.getSlave().getPlayer(), true); //Ally vassels to Kplayer slave
					allyPlayers(vassel.getPlayer(), kVassels[i].getPlayer(), true); //Ally vassels to kPlayer vassels
					allyPlayers(vassel.getPlayer(), kVassels[i].getSlave().getPlayer(), true); //Ally vassels to kPlayer vassels slave
					allyPlayers(vassel.getSlave().getPlayer(), kPlayer.getPlayer(), true); //Ally vassels slave to Kplayer
					allyPlayers(vassel.getSlave().getPlayer(), kPlayer.getSlave().getPlayer(), true); //Ally vassels slave to Kplayer slave
					allyPlayers(vassel.getSlave().getPlayer(), kVassels[i].getPlayer(), true); //Ally vassels slave to kPlayer vassels
					allyPlayers(vassel.getSlave().getPlayer(), kVassels[i].getSlave().getPlayer(), true); //Ally vassels slave to kPlayer vassels slave
				}
			}

			this.vassels.length = 0; //Remove all current vassels
			this.updateTitle();

			this.buildCastle(this.castle.x, this.castle.y);

			this.goldMines.forEach(mine => {
				SetUnitOwner(mine, kPlayer.player, true);
			})
		}
	}

	public giveGold(val: number) {
		SetPlayerState(this.player, PLAYER_STATE_RESOURCE_GOLD, GetPlayerState(this.player, PLAYER_STATE_RESOURCE_GOLD) + val);
	}

	public getSlave(): GhostPlayer {
		return this.slave;
	}

	public getCastle(): unit {
		return this.castle.unit;
	}

	public getCastleX(): number {
		return this.castle.x;
	}

	public getCastleY(): number {
		return this.castle.y;
	}

	public getVassles(): HumanPlayer[] {
		return this.vassels;
	}

	public setKing(newKing: HumanPlayer | null) {
		this.king = newKing;
	}

	public getKing(): HumanPlayer {
		return this.king;
	}

	public isVassel(): boolean {
		return (this.king == null || this.king == undefined) ? false : true;
	}

	public updateTitle() {
		this.title = Titles[this.vassels.length];
	}

	public getColoredName(): string {
		return `${PLAYER_COLOR_CODES[this.names.colorIndex]}${GetPlayerName(this.player)}|r`
	}

	public buildCastle(x: number, y: number) {
		this.castle = {
			x: x,
			y: y,
			unit: CreateUnit(this.player, UID.CASTLE, x, y, 270)
		}
	}

	public setColor(color: playercolor) {
		this.color.delta = color;
		SetPlayerColor(this.player, this.color.delta);
		SetPlayerColor(this.slave.getPlayer(), this.color.delta);

		const g: group = CreateGroup();
		GroupEnumUnitsOfPlayer(g, this.player, () => {
			SetUnitColor(GetEnumUnit(), this.color.delta);
			return false;
		})

		GroupEnumUnitsOfPlayer(g, this.slave.getPlayer(), () => {
			SetUnitColor(GetEnumUnit(), this.color.delta);
			return false;
		})

		DestroyGroup(g);
	}

	public onLeave() {
		const g: group = CreateGroup();

		this.goldMines.forEach(mine => {
			SetUnitOwner(mine, NEUTRAL_HOSTILE, true);
		})

		GroupEnumUnitsOfPlayer(g, this.player, () => {
			RemoveUnit(GetEnumUnit());
			return false;
		})

		GroupEnumUnitsOfPlayer(g, this.slave.getPlayer(), () => {
			RemoveUnit(GetEnumUnit());
			return false;
		})

		DestroyGroup(g);

		if (this.king) {
			const index = this.king.vassels.indexOf(this);

			if (index > -1) this.king.vassels.splice(index, 1);
		}

		this.setColor(this.color.real);

		//TODO: Message Players
		//TODO: Play Sound
	}
}