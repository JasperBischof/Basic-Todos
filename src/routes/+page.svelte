<script lang="ts">
	//
	// Imports
	//
	import Button from '$lib/components/Button.svelte';
	import Todo from '$lib/components/Todo.svelte';
	import TodoList from '$lib/components/TodoList.svelte';
	import { nanoid } from 'nanoid/non-secure';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import type { TodoInterface, TodoListInterface } from '$lib/utils/types';

	//
	// Variables
	//
	let flipAnimation = { duration: 200 };

	// Data management
	let todoLists: TodoListInterface[] = $state([]);
	let todos: TodoInterface[] = $state([]);
	let todoListsWithTodos: TodoListInterface[] = $derived(
		todoLists.map((todoList) => ({
			...todoList,
			todos: todos.filter((todo) => todo.list_id === todoList.id)
		}))
	);
	let activeList: TodoListInterface = $derived(
		todoListsWithTodos.find((list) => list.active) ?? todoListsWithTodos[0]
	);
	let todosOfActiveList: TodoInterface[] = $derived(
		todos.filter((todo) => todo.list_id === activeList.id)
	);

	// User Input variables
	let userInputTodo: string = $state('');
	let userInputList: string = $state('');

	//
	// Functions
	//
	function toggleActiveStates(listToActivate: TodoListInterface) {
		todoLists = todoLists.map((list) => ({ ...list, active: listToActivate.id === list.id }));
	}

	function idGenerator(list: string): string {
		const maxAttempts: number = 100;
		let newID: string = nanoid(21);
		let attempts: number = 0;

		if (list === 'todos') {
			while (todos.some((todo) => todo.id === newID) && attempts < maxAttempts) {
				newID = nanoid(21);
				attempts++;
			}
		}
		if (list === 'todolists') {
			while (todoLists.some((todoList) => todoList.id === newID) && attempts < maxAttempts) {
				newID = nanoid(21);
				attempts++;
			}
		}
		if (attempts === maxAttempts) {
			throw new Error('Failed to generate a unique ID after multiple attempts.');
		} else {
			return newID;
		}
	}

	function addTodo(text: string) {
		text.trim();
		if (text === '') {
			return;
		}
		let theNewTodoToAdd: TodoInterface = {
			id: idGenerator('todo'),
			text: text,
			done: false,
			list_id: activeList.id
		};
		todos.push(theNewTodoToAdd);
		userInputTodo = '';
	}

	function addTodoList(name: string) {
		name.trim();
		if (name === '' || todoLists.some((todoList) => todoList.name === name)) {
			return;
		}
		const newList: TodoListInterface = {
			id: idGenerator('todolists'),
			name,
			active: false,
			todos: []
		};
		// Alles in einer Zuweisung: alte Listen deaktivieren + neue anhängen
		todoLists = [
			...todoLists.map((list) => ({ ...list, active: false })),
			{ ...newList, active: true }
		];
		userInputList = '';
	}

	function deleteTodo(id: string) {
		todos = todos.filter((todo) => todo.id !== id);
	}

	function deleteTodoList(todoList: TodoListInterface) {
		if (todoLists.length <= 1) {
			return;
		}
		if (todoList.id === activeList.id) {
			const idx = todoLists.findIndex((list) => list.id === todoList.id);
			const nextList = todoLists[idx === 0 ? 1 : idx - 1];
			toggleActiveStates(nextList); // active flag setzen, BEVOR wir filtern
		}
		todoLists = todoLists.filter((list) => list.id !== todoList.id);
		todos = todos.filter((todo) => todo.list_id !== todoList.id);
	}

	function checkTodo(id: string) {
		todos = todos.map((todo) => {
			if (todo.id === id) {
				return { ...todo, done: !todo.done };
			}
			return todo;
		});
	}

	onMount(() => {
		const storedTodos = localStorage.getItem('todos');
		if (storedTodos) {
			todos = JSON.parse(storedTodos);
		}

		const storedTodoLists = localStorage.getItem('todoLists');
		if (storedTodoLists) {
			todoLists = JSON.parse(storedTodoLists);
		} else {
			todoLists.push({ id: nanoid(1), name: 'Main', active: true, todos: [] });
		}
	});

	$effect(() => {
		localStorage.setItem('todos', JSON.stringify(todos));
		localStorage.setItem('todoLists', JSON.stringify(todoLists));
	});
</script>

<!--  -->
<!-- todolists panel -->
<!--  -->
<div class="flex h-dvh w-dvw p-2">
	<div class="flex flex-1 flex-col rounded-xl bg-gray-100" id="todoListsPanel">
		<h1 class="px-4 py-2 text-3xl font-bold">Lists</h1>
		<div class="listOfTodoLists flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-scroll p-2">
			{#each todoListsWithTodos as todoList (todoList.id)}
				<div animate:flip={{ duration: 200 }}>
					<TodoList
						{todoList}
						onDelete={deleteTodoList}
						onToggle={toggleActiveStates}
						showDeleteButton={todoLists.length > 1}
					/>
				</div>
			{/each}
		</div>
		<form
			id="userInputList"
			class="flex items-center gap-2 p-2"
			action="submit"
			onsubmit={(e) => {
				e.preventDefault();
				addTodoList(userInputList);
			}}
		>
			<input
				placeholder="List name"
				type="text"
				bind:value={userInputList}
				class="flex-1 rounded-sm px-4 py-2 outline"
			/>
			<Button label="S" />
		</form>
	</div>
	<!--  -->
	<!-- todos panel -->
	<!--  -->
	<div class="flex flex-2 flex-col" id="todosPanel">
		<h1 class="px-4 py-2 text-3xl font-bold">Todos</h1>
		<div class="listOfTodos flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-scroll p-2">
			{#each todosOfActiveList as todo (todo.id)}
				<div animate:flip={flipAnimation}>
					<Todo {todo} onDelete={deleteTodo} onCheck={checkTodo} />
				</div>
			{/each}
		</div>
		<form
			id="userInputTodo"
			action="submit"
			class="flex items-center gap-2 p-2"
			onsubmit={(e) => {
				e.preventDefault();
				addTodo(userInputTodo);
			}}
		>
			<input
				placeholder="What do you have to do?"
				type="text"
				bind:value={userInputTodo}
				class="flex-1 rounded-sm px-4 py-2 outline"
			/>
			<Button label="S" />
		</form>
	</div>
</div>
