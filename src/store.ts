import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { TimerData } from './types';
import type { ColumnData } from './types';
import { v4 as uuidv4 } from 'uuid';

const mockColumnData: ColumnData[] = [
	{
		id: 'c1',
		name: 'TODO',
		items: [
			{ id: uuidv4(), header: 'Todo 1', status: 'todo', totalCommittedTime: 0, content: '', timeLogs: [] },
			{ id: uuidv4(), header: 'Todo 2', status: 'todo', totalCommittedTime: 0, content: '', timeLogs: [] },
			{ id: uuidv4(), header: 'Todo 3', status: 'todo', totalCommittedTime: 0, content: '', timeLogs: [] }
		]
	},
	{
		id: 'c2',
		name: 'DOING',
		items: [
			{
				id: uuidv4(),
				header: 'Learn Svelte',
				status: 'doing',
				totalCommittedTime: 0,
				content: 'Read the documentation and go through the tutorial.',
				timeLogs: [{ startTime: 1689435934 }]
			},
			{
				id: uuidv4(),
				header: 'Build something with Svelte app',
				status: 'doing',
				content: 'The goal of this task is to build a simple Kanban app with Svelte.',
				totalCommittedTime: 0,
				timeLogs: [{ startTime: 1689435934 }]
			}
		]
	},
	{
		id: 'c3',
		name: 'DONE',
		items: [
			{ id: uuidv4(), header: 'Download Svelte', status: 'done', totalCommittedTime: 0, content: '', timeLogs: [] }
		]
	}
];
export const timerData: Writable<TimerData> = writable({
	workTime: 25 * 60,
	breakTime: 10 * 60
});

export const columnData: Writable<ColumnData[]> = writable(mockColumnData);

export const isWorkTimerRunning: Writable<boolean> = writable(false);
