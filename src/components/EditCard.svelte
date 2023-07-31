<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import { flip } from 'svelte/animate';
	import type { TimeLog } from '../types';

	export let parent: any;
	const flipDurationMs = 150;

	const cBase: string = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader: string = 'text-2xl font-bold';
	const cForm: string = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	// Form Data
	let updatedHeader: string = $modalStore[0]?.meta?.header || '';
	let updatedContent: string = $modalStore[0]?.meta?.content || '';
	let status: string = $modalStore[0]?.meta?.status || '';
	let deleteConfirmation: boolean = false;

	function onHeaderChange(event) {
		updatedHeader = event.target.value;
	}

	function onContentChange(event) {
		updatedContent = event.target.value;
	}

	function onFormSubmit() {
		if ($modalStore[0].response) {
			$modalStore[0].meta.header = updatedHeader;
			$modalStore[0].meta.content = updatedContent;
			$modalStore[0].response($modalStore[0].meta);
		}
		modalStore.close();
	}

	function onCancellingDelete() {
		deleteConfirmation = false;
	}

	function onConfirmingDelete() {
		deleteConfirmation = false;
		$modalStore[0].meta.status = 'deleting';
		$modalStore[0].response($modalStore[0].meta);
		modalStore.close();
	}

	function onAttemptingDelete(): void {
		deleteConfirmation = true;
	}

	function getTotalTimeCommitted() {
		const totalWorkTimeInSeconds = $modalStore[0]?.meta?.timeLogs?.reduce((acc, curr, index) => {
			if (index === $modalStore[0]?.meta.timeLogs.length - 1) {
				return acc + (Date.now() / 1000 - curr.startTime);
			}

			return acc + (curr.endTime - curr.startTime);
		}, 0);
		const totalWorkTimeInHours = totalWorkTimeInSeconds / 3600;
		return totalWorkTimeInHours.toFixed(2);
	}

	function getTimeLogHours(timeLog: TimeLog): string {
		if (!timeLog.endTime) return ((Date.now() / 1000 - timeLog.startTime) / 3600).toFixed(2) + ' hrs in progress';
		return ((timeLog.endTime - timeLog.startTime) / 3600).toFixed(2) + ' hrs added';
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<div class="flex justify-between">
			<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>

			{#if status !== 'adding'}
				<button class="btn {parent.buttonTextCancel}" on:click={onAttemptingDelete}>Delete</button>
			{/if}
		</div>

		{#if deleteConfirmation}
			<aside class="alert variant-filled-warning">
				<div class="alert-message">
					<p>Are you sure you want to delete?</p>
				</div>
				<!-- Actions -->
				<div class="alert-actions">
					<button class="btn-icon variant-filled" on:click={onCancellingDelete}>No</button>
					<button class="btn-icon variant-filled" on:click={onConfirmingDelete}>Yes</button>
				</div>
			</aside>
		{/if}

		<article>{$modalStore[0].body ?? '(body missing)'}</article>

		<form class="modal-form {cForm}">
			<input
				class="input variant-form-material"
				type="text"
				value={updatedHeader}
				placeholder="Title"
				on:change={onHeaderChange}
			/>
			<textarea class="textarea" rows="4" placeholder={'Body'} on:change={onContentChange}> {updatedContent}</textarea>
		</form>

		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
		</footer>

		{#if status !== 'adding'}
			<ol class="list">
				<h1>Time logs:</h1>
				{#each $modalStore[0]?.meta?.timeLogs as item, index (index)}
					<div animate:flip={{ duration: flipDurationMs }}>
						<li>
							<span>{index + 1}.</span>
							<span class="flex-auto">{getTimeLogHours(item)}</span>
						</li>
					</div>
				{/each}
			</ol>
			<div>Time committed: {getTotalTimeCommitted()} hrs</div>
		{/if}
	</div>
{/if}
