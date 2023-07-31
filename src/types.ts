export interface TimeLog {
	startTime: number;
	endTime?: number;
}

export interface Item {
	id: string;
	header: string;
	status: string;
	totalCommittedTime: number;
	content: string;
	timeLogs: TimeLog[];
}

export interface ColumnData {
	id: string;
	name: string;
	items: Item[];
}

export interface TimerData {
	workTime: number;
	breakTime: number;
}
