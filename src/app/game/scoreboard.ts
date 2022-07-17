import { isHumanPlayer } from "app/libs/utils";
import { GamePlayer } from "app/players/game-player";
import { HumanPlayer } from "app/players/human-player";
import { PLAYER_COLOR_CODES } from "app/resources/colordata";
import { HexColors } from "app/resources/hexColors";

export class Scoreboard {
	private board: multiboard
	private players: player[];
	private size: number;
	private title: string;

	constructor() {
		this.title = "";
		this.build();
	}

	public build() {
		this.board = CreateMultiboard();

		this.players = [];
		GamePlayer.getPlayers().forEach(p => {
			if (isHumanPlayer(p.getPlayer()) && !p.isVassel()) {
				this.players.push(p.getPlayer());
			}
		})

		MultiboardSetColumnCount(this.board, 4);
		this.size = 1 + this.players.length;

		let longestStr: string = "";
		this.players.forEach(p => {
			const hPlayer: HumanPlayer = GamePlayer.getPlayer(p);
			const str: string = `${hPlayer.getTitle()}${hPlayer.getNames().acct}`;

			if (str.length > longestStr.length) longestStr = str;
		})

		for (let i = 1; i <= this.size; i++) {
			MultiboardSetRowCount(this.board, MultiboardGetRowCount(this.board) + 1);
			Scoreboard.setItemWidth(this.board, (longestStr.length * .60), i, 1);
			Scoreboard.setItemWidth(this.board, 3.80, i, 2);
			Scoreboard.setItemWidth(this.board, 3.20, i, 3);
			Scoreboard.setItemWidth(this.board, 3.30, i, 4);
			//Scoreboard.setItemWidth(this.board, 3.80, i, 5);
		}

		MultiboardSetItemsStyle(this.board, true, false);

		Scoreboard.setItemValue(this.board, `${HexColors.TANGERINE}Title - Player|r`, 1, 1);
		Scoreboard.setItemValue(this.board, `${HexColors.TANGERINE}Bounty|r`, 1, 2);
		Scoreboard.setItemValue(this.board, `${HexColors.TANGERINE}Heros|r`, 1, 3);
		Scoreboard.setItemValue(this.board, `${HexColors.TANGERINE}Vassels|r`, 1, 4);
		//Scoreboard.setItemValue(this.board, `${HexColors.TANGERINE}Vassels|r`, 1, 5);

		// Scoreboard.setItemWidth(this.board, 20.00, this.size, 1);
		// Scoreboard.setItemWidth(this.board, 0.00, this.size, 2);
		// Scoreboard.setItemWidth(this.board, 0.00, this.size, 3);
		// Scoreboard.setItemWidth(this.board, 0.00, this.size, 4);
		// Scoreboard.setItemWidth(this.board, 0.00, this.size, 5);

		this.step();
		this.setTitle(`${this.title}`);
		MultiboardMinimize(this.board, true);
		MultiboardMinimize(this.board, false);
		MultiboardDisplay(this.board, true);
	}

	public step() {
		let row: number = 2

		this.players.forEach(p => {
			const hPlayer: HumanPlayer = GamePlayer.getPlayer(p);
			const sColor: string = (GetLocalPlayer() == p) ? HexColors.LIGHT_BLUE : HexColors.WHITE;

			Scoreboard.setItemValue(this.board, `${PLAYER_COLOR_CODES[hPlayer.getNames().colorIndex]}${hPlayer.getTitle()}|r ${hPlayer.getColoredName()}`, row, 1);
			Scoreboard.setItemValue(this.board, `${sColor}${0}|r`, row, 2); //TODO track data
			Scoreboard.setItemValue(this.board, `${sColor}${0}|r`, row, 3); //TODO track data
			Scoreboard.setItemValue(this.board, `${sColor}${hPlayer.getVassles().length}|r`, row, 4);
			//Scoreboard.setItemValue(this.board, `${sColor}${hPlayer.getVassles().length}`, row, 5);
			row++
		})
	}

	public setTitle(str: string) {
		this.title = str;
		MultiboardSetTitleText(this.board, this.title);
	}

	public destory() {
		DestroyMultiboard(this.board);
		this.players.length = 0;
	}

	public rebuild() {
		this.destory();
		this.build();
	}

	private static setItemWidth(mb: multiboard, width: number, row: number, col: number) {
		let mbI: multiboarditem = MultiboardGetItem(mb, row - 1, col - 1);
		MultiboardSetItemWidth(mbI, width / 100);
		MultiboardReleaseItem(mbI);
		mbI = null;
	}

	private static setItemValue(mb: multiboard, value: string, row: number, col: number) {
		let mbI: multiboarditem = MultiboardGetItem(mb, row - 1, col - 1);
		MultiboardSetItemValue(mbI, value);
		MultiboardReleaseItem(mbI);
		mbI = null;
	}
}