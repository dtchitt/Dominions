interface TimedAction {
	time: number,
	action: Function
}

export class GameTimer {
	private static instance: GameTimer;
	private timer: timer;
	private tickCount: number;
	private timedActions: TimedAction[];

	constructor() {
		this.timer = CreateTimer();
		this.tickCount = 0;
		this.timedActions = [];

		TimerStart(this.timer, 1.0, true, () => {
			this.tickCount++;

			this.timedActions.forEach(timedAction => {
				if (timedAction.time > 0) {
					try {
						timedAction.action();
						timedAction.time -= 1;
					} catch (error) {
						print(error)
						this.timedActions.splice(this.timedActions.indexOf(timedAction), 1);
					}
				} else {
					this.timedActions.splice(this.timedActions.indexOf(timedAction), 1);
				}
			});
		})
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new GameTimer();
		}

		return this.instance;
	}

	public addTimedAction(time: number, action: Function) {
		this.timedActions.push({
			time: time,
			action: action
		})
	}

	public getTickCount(): number {
		return this.tickCount;
	}

	public getElapsedTime(): string {
		let hours: string = `${~~(this.tickCount / 3600)}`;
		hours = parseFloat(hours) <= 9 ? hours.replace(hours, `0${hours}`) : hours;

		let minutes: string = `0${~~(this.tickCount / 60) % 60}`.slice(-2);
		let seconds: string = `0${~~(this.tickCount % 3600) % 60 % 60}`.slice(-2);

		return `${hours}:${minutes}:${seconds}`
	}
}