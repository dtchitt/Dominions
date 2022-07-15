import { HexColors } from "app/resources/hexColors";
import { TextTag } from "w3ts";

export function ErrorMessage(p: player, msg: string) {
	if (GetLocalPlayer() == p) ClearTextMessages();

	DisplayTimedTextToPlayer(p, 0.52, 0.96, 2.00, `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n${HexColors.TANGERINE} ${msg}|r`);

	PlayLocalSound("Sound\\Interface\\Error.flac", p);
}

export function MessageAll(clear: boolean, msg: string, x?: number, y?: number) {
	if (clear) ClearTextMessages();
	if (!x) x = 0.92;
	if (!y) y = 0.81;

	ForForce(bj_FORCE_ALL_PLAYERS, () => {
		DisplayTimedTextToPlayer(GetEnumPlayer(), x, y, 5.00, msg);
	})
}

export function MessagePlayer(clear: boolean, player: player, msg: string, x?: number, y?: number) {
	if (clear && GetLocalPlayer() == player) ClearTextMessages();
	if (!x) x = 0.92;
	if (!y) y = 0.81;

	DisplayTimedTextToPlayer(player, x, y, 3.0, msg);
}

export function PlayLocalSound(soundPath: string, p: player) {
	let sound = CreateSound(soundPath, false, false, true, 10, 10, "")

	if (GetLocalPlayer() != p) SetSoundVolume(sound, 0);

	StartSound(sound);
	KillSoundWhenDone(sound);
	sound = null;
}

export function PlayGlobalSound(soundPath: string) {
	let sound = CreateSound(soundPath, false, false, true, 10, 10, "")

	StartSound(sound);
	KillSoundWhenDone(sound);
	sound = null;
}

export function GetRandomFromObj(obj: any) {
	const keys = Object.keys(obj);
	return obj[keys[Math.floor(Math.random() * keys.length)]];
}

export function ShuffleArray(arr: any[]): void {
	for (let i: number = arr.length - 1; i > 0; i--) {
		const j: number = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
		// [arr[i], arr[j]] = [arr[j], arr[i]]; // swap elements

		const temp: any = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
}

export function ShowBountyFloatingText(x: number, y: number, text: string) {
	const t = new TextTag();
	t.setText(text, 10, true);
	t.setPos(x - 20, y, 90);
	t.setColor(255, 204, 0, 255);
	t.setPermanent(false);
	t.setLifespan(1);
	t.setFadepoint(1);
	t.setVisible(true);
	t.setVelocity(0, 7.1 / 128 * Sin(3.14159 / 2));;
	return t;
}

export function allyPlayers(p1: player, p2: player, state: boolean, advCtrl: boolean = false) {
	SetPlayerAlliance(p1, p2, ALLIANCE_PASSIVE, state)
	SetPlayerAlliance(p1, p2, ALLIANCE_HELP_REQUEST, state)
	SetPlayerAlliance(p1, p2, ALLIANCE_HELP_RESPONSE, state)
	SetPlayerAlliance(p1, p2, ALLIANCE_SHARED_XP, state)
	SetPlayerAlliance(p1, p2, ALLIANCE_SHARED_SPELLS, state)
	SetPlayerAlliance(p1, p2, ALLIANCE_SHARED_VISION, state)
	SetPlayerAlliance(p1, p2, ALLIANCE_SHARED_CONTROL, state)

	if (advCtrl) SetPlayerAlliance(p1, p2, ALLIANCE_SHARED_ADVANCED_CONTROL, state);

	SetPlayerAlliance(p2, p1, ALLIANCE_PASSIVE, state)
	SetPlayerAlliance(p2, p1, ALLIANCE_HELP_REQUEST, state)
	SetPlayerAlliance(p2, p1, ALLIANCE_HELP_RESPONSE, state)
	SetPlayerAlliance(p2, p1, ALLIANCE_SHARED_XP, state)
	SetPlayerAlliance(p2, p1, ALLIANCE_SHARED_SPELLS, state)
	SetPlayerAlliance(p2, p1, ALLIANCE_SHARED_VISION, state)
	SetPlayerAlliance(p2, p1, ALLIANCE_SHARED_CONTROL, state)


	if (advCtrl) SetPlayerAlliance(p2, p1, ALLIANCE_SHARED_ADVANCED_CONTROL, state);
}

export function isHumanPlayer(who: player): boolean {
	if (GetPlayerSlotState(who) != PLAYER_SLOT_STATE_PLAYING) return false
	if (GetPlayerController(who) != MAP_CONTROL_USER) return false

	return true;
}