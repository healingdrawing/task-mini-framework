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
  const counted_todos = todoService.getTodos().filter((todo) => !todo.completed);
  const todoCounter = document.getElementById('todo-counter');
  if (todoCounter) todoCounter.innerText = `${counted_todos.length} items left`;


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

      events.on('change', checkbox, () => {
        todoService.toggleCompleted(todo.id);
      });
      // checkbox.addEventListener('change', () => {
      //   todoService.toggleCompleted(todo.id);
      // });
      todoItem.appendChild(checkbox);

      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.value = todo.text;
      textInput.readOnly = true;

      events.on('dblclick', textInput, () => {
        textInput.readOnly = false;
      });
      // textInput.addEventListener('dblclick', () => {
      //   textInput.readOnly = false;
      // });


      events.on('blur', textInput, () => {
        todoService.editTodo(todo.id, textInput.value);
        textInput.readOnly = true;
      });
      // textInput.addEventListener('blur', () => {
      //   todoService.editTodo(todo.id, textInput.value);
      //   textInput.readOnly = true;
      // });
      todoItem.appendChild(textInput);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';

      events.on('click', deleteButton, () => {
        todoService.removeTodo(todo.id);
      });
      // deleteButton.addEventListener('click', () => {
      //   todoService.removeTodo(todo.id);
      // });
      todoItem.appendChild(deleteButton);

      todoList.appendChild(todoItem);
    });
  }
}

// Add todo to list (html "input" type=text, which add new todo after press enter)
const addTodoInput = document.getElementById('add-todo-input') as HTMLInputElement;
if (addTodoInput) {

  events.on('keypress', addTodoInput, (event: { key: string; }) => {
    if (event.key === 'Enter') {
      const text = addTodoInput.value;
      if (text.trim() !== '') {
        todoService.addTodo(text);
        addTodoInput.value = '';
      }
    }
  });

  // addTodoInput.addEventListener('keypress', (event) => {
  //   if (event.key === 'Enter') {
  //     const text = addTodoInput.value;
  //     if (text.trim() !== '') {
  //       todoService.addTodo(text);
  //       addTodoInput.value = '';
  //     }
  //   }
  // });
}

// Add event listeners for filter buttons
const allButton = document.getElementById('all-button');
const activeButton = document.getElementById('active-button');
const completedButton = document.getElementById('completed-button');
if (allButton && activeButton && completedButton) {
  allButton.addEventListener('click', () => {
    store.setState({ filter: 'all' });
  });

  activeButton.addEventListener('click', () => {
    store.setState({ filter: 'active' });
  });

  completedButton.addEventListener('click', () => {
    store.setState({ filter: 'completed' });
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
