import { HexColors } from "app/resources/hexColors";

export class UserInterface {
	public static onLoad() {
		BlzFrameSetVisible(BlzFrameGetChild(BlzFrameGetChild(BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 5), 0), false); //Hide game clock

		//Disable resource tooltips
		const resourceFrame: framehandle = BlzGetFrameByName("ResourceBarFrame", 0);
		BlzFrameSetVisible(BlzFrameGetChild(resourceFrame, 0), false); //gold tooltip
		BlzFrameSetVisible(BlzFrameGetChild(resourceFrame, 1), false); //lumber tooltip
		BlzFrameSetVisible(BlzFrameGetChild(resourceFrame, 2), false); //upkeep tooltip
		BlzFrameSetVisible(BlzFrameGetChild(resourceFrame, 3), false); //supply tooltip

		//Create resource bar
		const reBar: framehandle = BlzCreateFrameByType("BACKDROP", "neBar", BlzGetFrameByName("ConsoleUIBackdrop", 0), "ButtonBackdropTemplate", 0);
		BlzFrameSetTexture(reBar, "NightElfResourceBarLarge.dds", 0, true);
		BlzFrameSetPoint(reBar, FRAMEPOINT_TOP, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), FRAMEPOINT_TOP, 0.24, 0.0);
		BlzFrameSetSize(reBar, 0.40, 0.026);
		BlzFrameSetLevel(reBar, 1);

		let frame = BlzGetFrameByName("ResourceBarLumberText", 0)
		BlzFrameSetSize(frame, 0.0000001, 0.0000001); //Hide lumber text

		frame = BlzGetFrameByName("ResourceBarSupplyText", 0)
		BlzFrameSetSize(frame, 0.0000001, 0.0000001); //Hide supply text

		frame = BlzGetFrameByName("ResourceBarUpkeepText", 0)
		BlzFrameSetSize(frame, 0.0000001, 0.0000001); //Hide upkeep text

		frame = null;

		//Timer Text
		const nextRound: framehandle = BlzCreateFrameByType("TEXT", "nextRound", reBar, "EscMenuLabelTextTemplate", 0);
		BlzFrameSetPoint(nextRound, FRAMEPOINT_LEFT, reBar, FRAMEPOINT_LEFT, 0.116, 0.002);
		BlzFrameSetTextAlignment(nextRound, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_CENTER);
		BlzFrameSetText(nextRound, ``);
		BlzFrameSetLevel(nextRound, 2);

		const timer: framehandle = BlzCreateFrameByType("TEXT", "timer", nextRound, "EscMenuLabelTextTemplate", 0);
		BlzFrameSetPoint(timer, FRAMEPOINT_LEFT, nextRound, FRAMEPOINT_RIGHT, 0.0, 0.0);
		BlzFrameSetTextAlignment(timer, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_RIGHT);
		BlzFrameSetLevel(timer, 2);
		//UserInterface.updateTimer(``);

		//Round Number Text
		const roundNum: framehandle = BlzCreateFrameByType("TEXT", "roundNum", reBar, "EscMenuLabelTextTemplate", 0);
		BlzFrameSetPoint(roundNum, FRAMEPOINT_LEFT, reBar, FRAMEPOINT_LEFT, 0.223, 0.002);
		BlzFrameSetTextAlignment(roundNum, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_CENTER);
		BlzFrameSetText(roundNum, `${HexColors.WHITE}Round:|r `);
		BlzFrameSetLevel(roundNum, 2);

		const round: framehandle = BlzCreateFrameByType("TEXT", "round", roundNum, "EscMenuLabelTextTemplate", 0);
		BlzFrameSetPoint(round, FRAMEPOINT_LEFT, roundNum, FRAMEPOINT_RIGHT, 0.0, 0.0);
		BlzFrameSetTextAlignment(round, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_RIGHT);
		BlzFrameSetLevel(round, 2);
		UserInterface.updateTurn(``);

		//Round Type Text
		const roundType: framehandle = BlzCreateFrameByType("TEXT", "roundType", reBar, "EscMenuLabelTextTemplate", 0);
		BlzFrameSetPoint(roundType, FRAMEPOINT_CENTER, reBar, FRAMEPOINT_LEFT, 0.34, 0.002);
		BlzFrameSetTextAlignment(roundType, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_CENTER);
		BlzFrameSetText(roundType, `Basic`);
		BlzFrameSetLevel(roundType, 2);
	}

	public static updateTimer(time: string, tick: number, duration: number) {
		if (tick > duration) {
			BlzFrameSetText(BlzGetFrameByName("nextRound", 0), `${HexColors.WHITE}Round Start:|r `);
			time = `${tick - duration}`;
		} else {
			BlzFrameSetText(BlzGetFrameByName("nextRound", 0), `${HexColors.WHITE}Round End:|r `);
		}

		BlzFrameSetText(BlzGetFrameByName("timer", 0), time);
	}

	public static updateTurn(turn: string) {
		BlzFrameSetText(BlzGetFrameByName("round", 0), turn);
	}

	public static hideUI(hidden: boolean) {
		BlzHideOriginFrames(hidden)
		BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop", 0), !hidden);
		BlzFrameSetVisible(BlzGetFrameByName("UpperButtonBarFrame", 0), !hidden);
	}
}