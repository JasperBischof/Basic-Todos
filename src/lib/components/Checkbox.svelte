<script lang="ts">
	let { checked }: { checked: boolean } = $props();
</script>

<div
	class={`flex h-5 min-w-5 items-center justify-center rounded-full border-2 ${checked ? 'border-violet-300' : 'border-violet-500'}`}
>
	{#if checked}
		<div class={`h-3 w-3 rounded-full  ${checked ? 'bg-violet-300' : 'bg-violet-500'}`}></div>
	{/if}
</div>
