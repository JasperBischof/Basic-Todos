export interface TodoInterface {
	id: string;
	text: string;
	done: boolean;
	list_id: string;
}

export interface TodoListInterface {
	id: string;
	name: string;
	todos: TodoInterface[];
	active: boolean;
}
