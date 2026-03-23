<!-- TodoList.svelte -->
<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	interface Todo {
		id: string;
		text: string;
		done: boolean;
		list_id: string;
	}

	interface TodoList {
		id: string;
		name: string;
		todos: Todo[];
		active: boolean;
	}

	interface Props {
		todoList: TodoList;
		onDelete: (todoList: TodoList) => void;
		onToggle: (todoList: TodoList) => void;
		showDeleteButton: boolean;
	}

	let { todoList, onDelete, onToggle, showDeleteButton }: Props = $props();
</script>

<form
	class={`${todoList.active ? 'bg-violet-500 font-bold text-white hover:bg-violet-500' : 'hover:bg-gray-200'} flex items-center gap-2 rounded-sm px-2`}
	onsubmit={() => onDelete(todoList)}
>
	<button
		type="button"
		class="flex flex-1 cursor-pointer flex-col rounded-sm py-1 text-left uppercase"
		onclick={() => onToggle(todoList)}
	>
		{todoList.name}
		<p
			class={`text-xs font-normal lowercase ${todoList.active ? 'text-gray-300' : 'text-gray-500'}`}
		>
			Open: {todoList.todos.filter((todo) => !todo.done).length} | Done: {todoList.todos.filter(
				(todo) => todo.done
			).length}
		</p>
	</button>
	{#if showDeleteButton}
		<Button label="D" />
	{/if}
</form>
