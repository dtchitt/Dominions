import { File } from "w3ts";

interface CamData {
	distance: number;
	angle: number;
	rotation: number;
}

export enum CamSettings {
	MIN_DISTANCE = 1650.00,
	MAX_DISTANCE = 5000.00,
	DEFAULT_DISTANCE = 1650.00, //Warcraft default == 1650

	MIN_ANGLE = 270.00,
	MAX_ANGLE = 350.00,
	DEFAULT_ANGLE = 304.00, //Warcraft default == 304

	MIN_ROTATION = 0.00,
	MAX_ROTATION = 360.00,
	DEFAULT_ROTATION = 90.00, //Warcraft default == 90
}

export const PlayerCamData: Map<player, CamData> = new Map<player, CamData>();

export default class CameraControls {
	private static instance: CameraControls;
	private pathFolderName: string = "dominions";
	private fileName: string = "camera.pld";

	private constructor() {
		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			const player: player = Player(i)

			let sDist: number;
			let sAngle: number;
			let sRot: number;

			if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING && GetPlayerController(player) == MAP_CONTROL_USER) {
				let contents: string;

				if (player == GetLocalPlayer()) {
					contents = File.read(this.getFilePath(player));
				}

				if (contents) {
					sDist = S2R(contents.split(' ')[0]);
					sAngle = S2R(contents.split(' ')[1]);
					sRot = S2R(contents.split(' ')[2]);
				} else {
					if (player == GetLocalPlayer()) {
						File.write(this.getFilePath(player), `${CamSettings.DEFAULT_DISTANCE} ${CamSettings.DEFAULT_ANGLE} ${CamSettings.DEFAULT_ROTATION}`);
					}
				}

				PlayerCamData.set(player, {
					distance: !sDist ? CamSettings.DEFAULT_DISTANCE : sDist,
					angle: !sAngle ? CamSettings.DEFAULT_ANGLE : sAngle,
					rotation: !sRot ? CamSettings.DEFAULT_ROTATION : sRot
				});
			}
		}

		this.camReset();
		CameraControls.chatCommands();
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new CameraControls();
		}
		return this.instance;
	}


	public static chatCommands() {
		const t: trigger = CreateTrigger();

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			TriggerRegisterPlayerChatEvent(t, Player(i), "-", false);
		}

		TriggerAddCondition(t, Condition(() => {
			const command: string = StringCase(GetEventPlayerChatString().split(' ')[0], false);
			const player: player = GetTriggerPlayer();

			//In case I add more commands in the future
			switch (command) {
				case "-cam":
				case "-zoom":
					let distance: string = GetEventPlayerChatString().split(' ')[1];
					let angle: string = GetEventPlayerChatString().split(' ')[2];
					let rotation: string = GetEventPlayerChatString().split(' ')[3];

					distance = this.getInstance().isNumber(distance) ? distance : `${CamSettings.DEFAULT_DISTANCE}`;
					angle = this.getInstance().isNumber(angle) ? angle : `${CamSettings.DEFAULT_ANGLE}`;
					rotation = this.getInstance().isNumber(rotation) ? rotation : `${CamSettings.DEFAULT_ROTATION}`;

					this.getInstance().checkCamData(PlayerCamData.get(player), [distance, angle, rotation]);

					if (player == GetLocalPlayer()) File.write(this.getInstance().getFilePath(player), `${distance} ${angle} ${rotation}`);

					break;
				default:
					break;
			}

			return true;
		}))
	}

	private camReset() {
		const camTimer: timer = CreateTimer();

		TimerStart(camTimer, 0.5, true, () => {
			for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
				if (PlayerCamData.has(Player(i))) this.setCameraFields(Player(i), PlayerCamData.get(Player(i)))
			}
		});
	}

	private checkCamData(data: CamData, vals: string[]) {
		if (vals[0]) this.checkDistance(data, S2R(vals[0]));
		if (vals[1]) this.checkAngle(data, S2R(vals[1]));
		if (vals[2]) this.checkRotation(data, S2R(vals[2]));
	}

	private checkDistance(data: CamData, val: number) {
		if (val > CamSettings.MAX_DISTANCE) val = CamSettings.MAX_DISTANCE;
		if (val < CamSettings.MIN_DISTANCE) val = CamSettings.MIN_DISTANCE;

		return data.distance = val;
	}

	private checkAngle(data: CamData, val: number) {
		if (val > CamSettings.MAX_ANGLE) val = CamSettings.MAX_ANGLE;
		if (val < CamSettings.MIN_ANGLE) val = CamSettings.MIN_ANGLE;

		return data.angle = val;
	}

	private checkRotation(data: CamData, val: number) {
		if (val > CamSettings.MAX_ROTATION) val = CamSettings.MAX_ROTATION;
		if (val < CamSettings.MIN_ROTATION) val = CamSettings.MIN_ROTATION;

		return data.rotation = val;
	}

	private setCameraFields(p: player, data: CamData) {
		SetCameraFieldForPlayer(p, CAMERA_FIELD_TARGET_DISTANCE, data.distance, 0.00)
		SetCameraFieldForPlayer(p, CAMERA_FIELD_ANGLE_OF_ATTACK, data.angle, 0.00)
		SetCameraFieldForPlayer(p, CAMERA_FIELD_ROTATION, data.rotation, 0.00)
		SetCameraFieldForPlayer(p, CAMERA_FIELD_FARZ, 10000, 0.00)
	}

	private isNumber(str: string): boolean {
		if (typeof str !== 'string') return false;
		if (str.trim() === '') return false;

		return !Number.isNaN(Number(str));
	}

	private getFilePath(player: player): string {
		return `${this.pathFolderName}/${GetPlayerName(player)}/${this.fileName}`;
	}
}