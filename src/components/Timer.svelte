<script lang="ts">
	import { modalStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import { tweened } from 'svelte/motion';
	import type { Tweened } from 'svelte/motion';
	import type { ColumnData, Item, TimerData } from '../types';
	import TimerSetting from './TimerSetting.svelte';
	import { timerData as timerDataFromStore, columnData, isWorkTimerRunning } from '../store';

	let timerData: TimerData = $timerDataFromStore;
	let timer: Tweened<number> = tweened(timerData.workTime);
	let timerFromZero: number = 0;
	let isTimeToWork: boolean = true;
	let isTimerRunning: boolean = false;
	let intervalId: number;

	$: minutes = Math.floor($timer / 60);
	$: seconds = Math.floor($timer - minutes * 60);
	$: percentageDone = (timerFromZero / (isTimeToWork ? timerData.workTime : timerData.breakTime)) * 100;

	function updateInProgressItemEndTimes() {
		const inProgressItems: ColumnData = $columnData[1];

		inProgressItems.items.forEach((item: Item) => {
			const lastTimeLog = item.timeLogs[item.timeLogs.length - 1];
			lastTimeLog.endTime = Math.floor(Date.now() / 1000);
		});
	}

	function updateInProgressItemStartTimes() {
		const inProgressItems: ColumnData = $columnData[1];

		inProgressItems.items.forEach((item) => {
			const lastTimeLog = item.timeLogs[item.timeLogs.length - 1];
			if (item.timeLogs.length === 0 || lastTimeLog?.endTime) {
				item.timeLogs.push({
					startTime: Math.floor(Date.now() / 1000)
				});
			}
		});
	}

	function switchTimer(isTimeToWork: boolean = true) {
		timerFromZero = 0;

		if (isTimeToWork) {
			timer = tweened(timerData.workTime);
		} else {
			timer = tweened(timerData.breakTime);
			intervalId = setInterval(updateTimer, 1000);
			isTimerRunning = true;
		}
	}

	function updateTimer() {
		if ($timer > 0) {
			$timer--;
			timerFromZero++;
			isTimerRunning = true;
		} else {
			if ($isWorkTimerRunning) updateInProgressItemEndTimes();
			clearInterval(intervalId);
			isTimeToWork = !isTimeToWork;
			isTimerRunning = false;

			switchTimer(isTimeToWork);
			isWorkTimerRunning.set(false);
		}
	}

	function onTimerPause() {
		clearInterval(intervalId);
		isTimerRunning = false;
		isWorkTimerRunning.set(false);
	}

	function onTimerStart() {
		isTimeToWork = true;
		isWorkTimerRunning.set(true);
		updateInProgressItemStartTimes();
		intervalId = setInterval(updateTimer, 1000);
		isTimerRunning = true;
	}

	function getTimeDisplay(value, length = 2, char = '0') {
		const { length: currentLength } = value.toString();
		if (currentLength >= length) return value.toString();
		return `${char.repeat(length - currentLength)}${value}`;
	}

	function updateTimerSettingsModal(): void {
		const component: ModalComponent = { ref: TimerSetting };
		const modal: ModalSettings = {
			type: 'component',
			component: component,
			meta: timerData,
			response: (modalData: TimerData) => {
				if (modalData) {
					$timerDataFromStore = modalData;

					if (isTimeToWork) {
						timer = tweened(timerData.workTime);
					} else {
						timer = tweened(timerData.breakTime);
					}

					timerFromZero = 0;
				}
			}
		};
		modalStore.trigger(modal);
	}
</script>

<div class="grid grid-cols-1 justify-items-center">
	<div on:click={updateTimerSettingsModal}>
		<ProgressRadial class="w-60 cursor-pointer" value={percentageDone} stroke={100} meter="stroke-primary-500">
			{getTimeDisplay(minutes)}:{getTimeDisplay(seconds)}
		</ProgressRadial>
	</div>

	{#if isTimeToWork}
		<h1 class="mt-5">Time to work chop chop!</h1>
	{:else}
		<h1 class="mt-5">Alright guess you can take a break!</h1>
	{/if}
	<div class="mt-5">
		{#if isTimerRunning}
			<button type="button" class="chip variant-filled m-2 w-20" on:click={onTimerPause}>Pause</button>
		{:else}
			<button type="button" class="chip variant-filled m-2 w-20" on:click={onTimerStart}>Start</button>
		{/if}
	</div>
</div>
