<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import Column from './Column.svelte';
	import Timer from './Timer.svelte';
	import { columnData, isWorkTimerRunning } from '../store';

	const flipDurationMs = 300;

	function handleDndConsiderColumns(e) {
		// $columnData = e.detail.items;
	}

	function handleDndFinalizeColumns(e) {
		// onFinalUpdate(e.detail.items);
	}

	function handleItemFinalize(columnIdx, newItems, itemInfo) {
		const currentItemId = itemInfo.id;

		newItems = newItems.map((item) => {
			// item is dragged into doing column
			// we also only want to start the time when work timer is running
			if ($columnData[columnIdx].name.toLowerCase() === 'doing' && item.id === currentItemId && $isWorkTimerRunning) {
				if (item.timeLogs.length === 0 || item.timeLogs[item.timeLogs.length - 1].endTime) {
					item.timeLogs.push({ startTime: new Date().getTime() / 1000 });
				}
			}

			// item was in doing and dragged out of doing
			if ($columnData[columnIdx].name.toLowerCase() !== 'doing' && item.id === currentItemId) {
				if (item.timeLogs.length > 0 && !item.timeLogs[item.timeLogs.length - 1].endTime) {
					item.timeLogs[item.timeLogs.length - 1].endTime = new Date().getTime() / 1000;
					item.totalCommittedTime +=
						item.timeLogs[item.timeLogs.length - 1].endTime - item.timeLogs[item.timeLogs.length - 1].startTime;
				}
			}
			return { ...item, status: $columnData[columnIdx].name.toLowerCase() };
		});

		$columnData[columnIdx].items = newItems;
		columnData.set([...$columnData]);
	}
</script>

<section
	class="board"
	use:dndzone={{ items: $columnData, flipDurationMs, type: 'column', dragDisabled: true }}
	on:consider={handleDndConsiderColumns}
	on:finalize={handleDndFinalizeColumns}
>
	{#each $columnData as { id, name, items }, idx (id)}
		<div class="column" animate:flip={{ duration: flipDurationMs }}>
			<Column
				{name}
				{items}
				onDrop={(newItems, currentItemInfo) => handleItemFinalize(idx, newItems, currentItemInfo)}
			/>
		</div>
	{/each}

	<Timer />
</section>

<style>
	.board {
		height: 90vh;
		width: 100%;
		padding: 0.5em;
	}

	.column {
		height: 100%;
		width: 25%;
		padding: 0.5em;
		margin: 0.5em;
		float: left;
		border: 1px solid #333333;
	}
</style>
