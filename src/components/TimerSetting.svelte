<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { TimerData } from '../types';

	export let parent: any;
	export let timerData: TimerData;

	const cBase: string = 'card p-4 w-modal shadow-xl space-y-4';

	let updatedWorkTimer: number = $modalStore[0]?.meta.workTime;
	let updatedBreakTimer: number = $modalStore[0]?.meta.breakTime;

	function onFormSubmit() {
		if ($modalStore[0].response) {
			console.log('submitting form');
			$modalStore[0].meta.workTime = updatedWorkTimer;
			$modalStore[0].meta.breakTime = updatedBreakTimer;
			$modalStore[0].response($modalStore[0].meta);
		}
		modalStore.close();
	}

	function onWorkTimerChange(event) {
		updatedWorkTimer = event.target.value * 60;
	}

	function onBreakTimerChange(event) {
		updatedBreakTimer = event.target.value * 60;
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<h1 class="pl-5 pt-5">⏰ Timer Settings</h1>
		<div class="grid grid-cols-2">
			<label class="label pl-5">
				<span>Work Timer</span>
				<input
					class="input variant-form-material"
					type="number"
					placeholder="25"
					value={updatedWorkTimer / 60}
					on:change={onWorkTimerChange}
				/>
			</label>

			<label class="label pl-5">
				<span>Break Timer</span>
				<input
					class="input variant-form-material w-30"
					type="number"
					placeholder="10"
					value={updatedBreakTimer / 60}
					on:change={onBreakTimerChange}
				/>
			</label>
		</div>

		<footer class="modal-footer {parent.regionFooter} pt-5 pb-2">
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Update</button>
		</footer>
	</div>
{/if}
