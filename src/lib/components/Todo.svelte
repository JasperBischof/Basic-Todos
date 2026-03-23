<!-- Todo.svelte -->
<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import type { TodoInterface } from '$lib/utils/types';

	interface Props {
		todo: TodoInterface;
		onDelete: (id: string) => void;
		onCheck: (id: string) => void;
	}

	let { todo, onDelete, onCheck }: Props = $props();
</script>

<form
	class="flex items-center rounded-sm px-2 hover:bg-gray-100"
	onsubmit={() => onDelete(todo.id)}
>
	<input
		id={todo.id}
		type="checkbox"
		checked={todo.done}
		onchange={() => onCheck(todo.id)}
		hidden
	/>
	<label
		class={` flex h-full flex-1 items-center gap-2 py-1 break-all hover:cursor-pointer ${todo.done ? 'text-gray-500 line-through' : ''}`}
		for={todo.id}
	>
		<Checkbox checked={todo.done} />
		{todo.text}
	</label>
	<Button label="D" />
</form>
