<script lang="ts">
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import EditCard from './EditCard.svelte';
	import type { Item } from '../types';

	export let item;
	export let handleCardDelete;

	function updateCardModalForm(): void {
		const component: ModalComponent = { ref: EditCard };
		const modal: ModalSettings = {
			type: 'component',
			component: component,
			title: 'Update work item',
			body: '',
			meta: item,
			response: (modalData: Item) => {
				if (modalData && modalData.status === 'deleting') handleCardDelete(item.id);
				else if (modalData) item = modalData;
			}
		};
		modalStore.trigger(modal);
	}

	function getStartedTime(): string {
		if (!item.timeLogs || item.timeLogs.length === 0) return 'Time not yet recorded';
		const date = new Date(item.timeLogs[item.timeLogs.length - 1].startTime * 1000);

		let hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');

		const period = hours >= 12 ? 'PM' : 'AM';

		hours = hours % 12;
		hours = hours ? hours : 12;

		return 'Started ' + hours + ':' + minutes + ':' + seconds + ' ' + period;
	}

	function getTotalTimeWorked(item: Item): string {
		const totalWorkTimeInSeconds = item.timeLogs?.reduce((acc, curr) => acc + (curr.endTime - curr.startTime), 0) || 0;
		const totalWorkTimeInHours = totalWorkTimeInSeconds / 3600;
		return totalWorkTimeInHours.toFixed(2);
	}
</script>

<div class="card card-hover m-3" on:click={updateCardModalForm}>
	<header class="card-header">{item.header}</header>

	{#if item.content}
		<section class="p-4">{item.content}</section>
	{:else}
		<section class="p-2" />
	{/if}

	<hr class="opacity-50" />

	{#if item.status === 'doing'}
		<footer class="p-4 flex justify-start items-center space-x-4">
			<div class="flex-auto flex justify-between items-center">
				<h6 class="font-bold">Committed</h6>
				<small>{getStartedTime()}</small>
			</div>
		</footer>
	{/if}

	{#if item.status === 'done'}
		<footer class="p-4 flex justify-start items-center space-x-4">
			<div class="flex-auto flex justify-between items-center">
				<h6 class="font-bold">Total time: {getTotalTimeWorked(item)} hrs</h6>
			</div>
		</footer>
	{/if}
</div>
