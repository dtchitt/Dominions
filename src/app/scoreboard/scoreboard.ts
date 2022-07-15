import { isHumanPlayer } from "app/libs/utils";
import { GamePlayer } from "app/players/game-player";
import { HumanPlayer } from "app/players/human-player";
import { PLAYER_COLOR_CODES } from "app/resources/colordata";
import { HexColors } from "app/resources/hexColors";
import { Titles } from "app/resources/titles";

export class Scoreboard {
    private board: multiboard
    private players: player[];
    private size: number;

    constructor() {
        this.board = CreateMultiboard();

        this.players = [];
        GamePlayer.getPlayers().forEach(p => {
            if (isHumanPlayer(p.getPlayer())) {
                this.players.push(p.getPlayer())
            }
        })

        MultiboardSetColumnCount(this.board, 4);
        this.size = 1 + this.players.length;

        for (let i = 1; i <= this.size; i++) {
            MultiboardSetRowCount(this.board, MultiboardGetRowCount(this.board) + 1);
            Scoreboard.setItemWidth(this.board, 13.00, i, 1);
            Scoreboard.setItemWidth(this.board, 3.80, i, 2);
            Scoreboard.setItemWidth(this.board, 3.40, i, 3);
            Scoreboard.setItemWidth(this.board, 3.30, i, 4);
            //Scoreboard.setItemWidth(this.board, 3.80, i, 5);
        }

        MultiboardSetItemsStyle(this.board, true, false);

        Scoreboard.setItemValue(this.board, `${HexColors.TANGERINE}Title - Player|r`, 1, 1);
        Scoreboard.setItemValue(this.board, `${HexColors.TANGERINE}Bounty|r`, 1, 2);
        Scoreboard.setItemValue(this.board, `${HexColors.TANGERINE}Razed|r`, 1, 3);
        Scoreboard.setItemValue(this.board, `${HexColors.TANGERINE}Vassels|r`, 1, 4);
        //Scoreboard.setItemValue(this.board, `${HexColors.TANGERINE}Vassels|r`, 1, 5);

        // Scoreboard.setItemWidth(this.board, 20.00, this.size, 1);
        // Scoreboard.setItemWidth(this.board, 0.00, this.size, 2);
        // Scoreboard.setItemWidth(this.board, 0.00, this.size, 3);
        // Scoreboard.setItemWidth(this.board, 0.00, this.size, 4);
        // Scoreboard.setItemWidth(this.board, 0.00, this.size, 5);

        this.step();
        this.setTitle("What Should This Say?")
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
            Scoreboard.setItemValue(this.board, `${sColor}${0}|r`, row, 2);
            Scoreboard.setItemValue(this.board, `${sColor}${0}|r`, row, 3);
            Scoreboard.setItemValue(this.board, `${sColor}${hPlayer.getVassles().length}|r`, row, 4);
            //Scoreboard.setItemValue(this.board, `${sColor}${hPlayer.getVassles().length}`, row, 5);
            row++
        })
    }

    public setTitle(str: string) {
        MultiboardSetTitleText(this.board, str);
    }

    public destory() {
        DestroyMultiboard(this.board);
        this.players.length = 0;
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