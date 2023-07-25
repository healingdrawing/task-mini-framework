// index.ts
import { router, store, events } from './framework';
import { todoService, Todo } from './todo';

// Add state to handle the current filter ("all", "active", "completed")
store.setState({ filter: 'all' });

// Add a utility function to get filtered todos based on the current filter
function getFilteredTodos(): Todo[] {
  const filter = store.getState().filter;
  if (filter === 'active') {
    return todoService.getTodos().filter((todo) => !todo.completed);
  } else if (filter === 'completed') {
    return todoService.getTodos().filter((todo) => todo.completed);
  }
  return todoService.getTodos();
}

// Display todo's list on the screen
function renderTodos() {
  const todos = getFilteredTodos();

  const todoList = document.getElementById('todo-list');
  if (todoList) {
    todoList.innerHTML = '';
    todos.forEach((todo) => {
      const todoItem = document.createElement('li');
      todoItem.className = 'todo-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      events.on('change', () => {
        todoService.toggleCompleted(todo.id);
      });
      todoItem.appendChild(checkbox);

      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.value = todo.text;
      textInput.readOnly = true;
      events.on('dblclick', () => {
        textInput.readOnly = false;
      });
      events.on('blur', () => {
        todoService.editTodo(todo.id, textInput.value);
        textInput.readOnly = true;
      });
      todoItem.appendChild(textInput);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      events.on('click', () => {
        todoService.removeTodo(todo.id);
      });
      todoItem.appendChild(deleteButton);

      todoList.appendChild(todoItem);
    });
  }
}


// Add todo to list (html "input" type=text, which add new todo after press enter)
const addTodoInput = document.getElementById('add-todo-input') as HTMLInputElement;
if (addTodoInput) {
  events.on('keypress', (event: KeyboardEvent) => {
    if (event.key === 'Enter' && event.target === addTodoInput) {
      const text = addTodoInput.value;
      if (text.trim() !== '') {
        todoService.addTodo(text);
        addTodoInput.value = '';
      }
    }
  });
}

// Add event listeners for filter buttons
const allButton = document.getElementById('all-button');
const activeButton = document.getElementById('active-button');
const completedButton = document.getElementById('completed-button');
if (allButton && activeButton && completedButton) {
  events.on('click', (event: Event) => {
    if (event.target === allButton) {
      store.setState({ filter: 'all' });
    } else if (event.target === activeButton) {
      store.setState({ filter: 'active' });
    } else if (event.target === completedButton) {
      store.setState({ filter: 'completed' });
    }
  });
}

// Subscribe to state changes and update the UI accordingly
store.subscribe(renderTodos);

// Initial render
renderTodos();

// Abstracting the DOM Routing System
router.addRoute('/', () => {
  store.setState({ filter: 'all' });
});

router.addRoute('/active', () => {
  store.setState({ filter: 'active' });
});

router.addRoute('/completed', () => {
  store.setState({ filter: 'completed' });
});

// Start the router
router.navigate(window.location.pathname);
