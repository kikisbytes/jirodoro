<script lang="ts">
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { Modal } from '@skeletonlabs/skeleton';
	import Board from './Board.svelte';
	import EditCard from './EditCard.svelte';
	import TimerSetting from './TimerSetting.svelte';
	import type { ColumnData, TimerData } from '../types';
	import { timerData, columnData, isWorkTimerRunning } from '../store';
	import { onDestroy } from 'svelte';

	const timerDataUnsubscribe = timerData.subscribe((value: TimerData) => {
		console.debug('subscribed to timerData');
	});

	const columnDataUnsubscribe = columnData.subscribe((value: ColumnData[]) => {
		console.debug('subscribed to columnData');
	});

	const isTimerRunningUnsubscribe = isWorkTimerRunning.subscribe((value: boolean) => {
		console.debug('subscribed to isTimerRunning');
	});

	const modalComponentRegistry: Record<string, ModalComponent> = {
		modalComponentOne: {
			ref: EditCard,
			props: { background: 'bg-red-500' }
		},
		modalComponentTwo: {
			ref: TimerSetting,
			props: { background: 'bg-blue-500' }
		}
	};

	onDestroy(() => {
		timerDataUnsubscribe();
		columnDataUnsubscribe();
		isTimerRunningUnsubscribe();
	});
</script>

<div>
	<Modal components={modalComponentRegistry} />
	<Board />
</div>
