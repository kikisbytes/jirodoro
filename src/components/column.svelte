<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import { v4 as uuidv4 } from 'uuid';
	import JsPDF from 'jspdf';
	import Card from './DisplayCard.svelte';
	import EditCard from './EditCard.svelte';
	import type { Item, TimeLog } from '../types';
	import { columnData } from '../store';

	const flipDurationMs = 150;
	export let name;
	export let items;
	export let onDrop;

	function handleDndConsiderCards(e) {
		items = e.detail.items;
	}

	function handleDndFinalizeCards(e) {
		onDrop(e.detail.items, e.detail.info);
	}

	function onAddCard() {
		addNewCardModalContent();
	}

	function handleCardDelete(id: string) {
		items = items.filter((item: Item) => item.id !== id);
	}

	function addNewCardModalContent(): void {
		const component: ModalComponent = { ref: EditCard };
		const modal: ModalSettings = {
			type: 'component',
			component: component,
			title: 'Add new work item',
			body: '',
			meta: {
				header: '',
				content: '',
				status: 'adding'
			},
			response: (modalData: Item) => {
				if (modalData) {
					const newItem: Item = {
						id: uuidv4(),
						header: modalData.header,
						content: modalData.content,
						status: 'todo',
						totalCommittedTime: 0,
						timeLogs: []
					};
					items = [...items, newItem];
				}
			}
		};
		modalStore.trigger(modal);
	}

	function onExportDoneData(): void {
		const doc = new JsPDF();
		const doneCards = $columnData[2];
		let lineLeftPadding = 20;
		let lineStart = 20;

		// Format date to desired format
		const options = {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			hour12: true,
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
		};

		doneCards.items.forEach((card: Item, index: number) => {
			doc.text(card.header, lineLeftPadding, lineStart);
			lineStart += 10;
			card.timeLogs.forEach((timeLog: TimeLog, index: number) => {
				let timeLogText = '';
				const startTime = new Date(timeLog.startTime * 1000);
				const endTime = new Date(timeLog.endTime * 1000);
				const totalTime = ((timeLog.endTime - timeLog.startTime) / 3600).toFixed(2);
				const formattedStartData = startTime.toLocaleDateString('en-US', options as any);
				const formattedEndData = endTime.toLocaleDateString('en-US', options as any);

				timeLogText += `${index + 1} - ${formattedStartData} - ${formattedEndData} (${totalTime} hrs)`;

				doc.text(timeLogText, lineLeftPadding, lineStart);
				lineStart += 10;
			});

			lineStart += 20;
		});

		doc.save('done-items.pdf');
	}
</script>

<div class="wrapper">
	<div class="flex justify-between">
		<div class="col-span-1 pl-3.5">{name}</div>
		{#if name.toLowerCase() === 'todo'}
			<span class="chip variant-filled w-1/5 mr-5" on:click={onAddCard}>Add</span>
		{/if}
		{#if name.toLowerCase() === 'done'}
			<span class="chip variant-filled w-1/5 mr-5" on:click={onExportDoneData}>Export</span>
		{/if}
	</div>
	<div
		class="column-content"
		use:dndzone={{ items, flipDurationMs, zoneTabIndex: -1 }}
		on:consider={handleDndConsiderCards}
		on:finalize={handleDndFinalizeCards}
	>
		{#each items as item (item.id)}
			<div animate:flip={{ duration: flipDurationMs }}>
				<Card {item} {handleCardDelete} />
			</div>
		{/each}
	</div>
</div>

<style>
	.wrapper {
		height: 100%;
		width: 100%;
		/*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/
		overflow-y: hidden;
	}

	.column-content {
		height: calc(100% - 2.5em);
		/* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
		overflow-y: scroll;
	}
</style>
