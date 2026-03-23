<script lang="ts">
	let { label }: { label: string } = $props();
</script>

<button
	type="submit"
	class="h-6 w-6 cursor-pointer rounded-full bg-violet-950 text-xs font-bold text-white hover:bg-violet-800"
	>{label}</button
>
