import { isHumanPlayer } from "app/libs/utils";
import { GamePlayer } from "app/players/game-player";
import { HumanPlayer } from "app/players/human-player";
import { PLAYER_COLOR_CODES } from "app/resources/colordata";
import { HexColors } from "app/resources/hexColors";
import { Titles } from "app/resources/titles";

export class sbtesting {
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

        MultiboardSetColumnCount(this.board, 2);
        this.size = 26;

        for (let i = 1; i <= this.size; i++) {
            MultiboardSetRowCount(this.board, MultiboardGetRowCount(this.board) + 1);
            sbtesting.setItemWidth(this.board, .6, i, 1);
            sbtesting.setItemWidth(this.board, .3, i, 2);
        }

        MultiboardSetItemsStyle(this.board, true, false);

        const capletters = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
        ]

        const letters = [
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
        ]

        for (let i = 1; i <= 26; i++) {
            sbtesting.setItemValue(this.board, capletters[i - 1], i, 1);
            sbtesting.setItemValue(this.board, letters[i - 1], i, 2);

            // sbtesting.setItemValue(this.board, `B`, i, 1);
            // sbtesting.setItemValue(this.board, `b`, i, 2);

            // sbtesting.setItemValue(this.board, `C`, i, 1);
            // sbtesting.setItemValue(this.board, `c`, i, 2);

            // sbtesting.setItemValue(this.board, `D`, i, 1);
            // sbtesting.setItemValue(this.board, `d`, i, 2);

            // sbtesting.setItemValue(this.board, `E`, i, 1);
            // sbtesting.setItemValue(this.board, `e`, i, 2);

            // sbtesting.setItemValue(this.board, `F`, i, 1);
            // sbtesting.setItemValue(this.board, `g`, i, 2);

            // sbtesting.setItemValue(this.board, `G`, i, 1);
            // sbtesting.setItemValue(this.board, `g`, i, 2);

            // sbtesting.setItemValue(this.board, `H`, i, 1);
            // sbtesting.setItemValue(this.board, `h`, i, 2);

            // sbtesting.setItemValue(this.board, `I`, i, 1);
            // sbtesting.setItemValue(this.board, `i`, i, 2);

            // sbtesting.setItemValue(this.board, `J`, i, 1);
            // sbtesting.setItemValue(this.board, `j`, i, 2);
            
            // sbtesting.setItemValue(this.board, `K`, i, 1);
            // sbtesting.setItemValue(this.board, `k`, i, 2);

            // sbtesting.setItemValue(this.board, `L`, i, 1);
            // sbtesting.setItemValue(this.board, `l`, i, 2);

            // sbtesting.setItemValue(this.board, `M`, i, 1);
            // sbtesting.setItemValue(this.board, `m`, i, 2);

            // sbtesting.setItemValue(this.board, `N`, i, 1);
            // sbtesting.setItemValue(this.board, `n`, i, 2);

            // sbtesting.setItemValue(this.board, `O`, i, 1);
            // sbtesting.setItemValue(this.board, `o`, i, 2);

            // sbtesting.setItemValue(this.board, `P`, i, 1);
            // sbtesting.setItemValue(this.board, `p`, i, 2);

            // sbtesting.setItemValue(this.board, `Q`, i, 1);
            // sbtesting.setItemValue(this.board, `q`, i, 2);

            // sbtesting.setItemValue(this.board, `S`, i, 1);
            // sbtesting.setItemValue(this.board, `s`, i, 2);

            // sbtesting.setItemValue(this.board, `R`, i, 1);
            // sbtesting.setItemValue(this.board, `r`, i, 2);

            // sbtesting.setItemValue(this.board, `T`, i, 1);
            // sbtesting.setItemValue(this.board, `t`, i, 2);

            // sbtesting.setItemValue(this.board, `U`, i, 1);
            // sbtesting.setItemValue(this.board, `u`, i, 2);

            // sbtesting.setItemValue(this.board, `V`, i, 1);
            // sbtesting.setItemValue(this.board, `v`, i, 2);

            // sbtesting.setItemValue(this.board, `W`, i, 1);
            // sbtesting.setItemValue(this.board, `w`, i, 2);

            // sbtesting.setItemValue(this.board, `X`, i, 1);
            // sbtesting.setItemValue(this.board, `x`, i, 2);

            // sbtesting.setItemValue(this.board, `Y`, i, 1);
            // sbtesting.setItemValue(this.board, `y`, i, 2);

            // sbtesting.setItemValue(this.board, `Z`, i, 1);
            // sbtesting.setItemValue(this.board, `z`, i, 2);
        }

        MultiboardMinimize(this.board, true);
        MultiboardMinimize(this.board, false);
        MultiboardDisplay(this.board, true);
    }

    public step() {
        let row: number = 2

        this.players.forEach(p => {
            const hPlayer: HumanPlayer = GamePlayer.getPlayer(p);
            const sColor: string = (GetLocalPlayer() == p) ? HexColors.LIGHT_BLUE : HexColors.WHITE;

            sbtesting.setItemValue(this.board, `${PLAYER_COLOR_CODES[hPlayer.getNames().colorIndex]}${hPlayer.getTitle()}|r ${hPlayer.getColoredName()}`, row, 1);
            sbtesting.setItemValue(this.board, `${sColor}${0}|r`, row, 2);
            sbtesting.setItemValue(this.board, `${sColor}${0}|r`, row, 3);
            sbtesting.setItemValue(this.board, `${sColor}${hPlayer.getVassles().length}|r`, row, 4);
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