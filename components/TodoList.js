// Import the TodoItem web component
import "./TodoItem.js";

// Define the TodoList class, extending from the built-in HTMLElement
class TodoList extends HTMLElement {
  // The constructor is called when an instance of the element is created
  constructor() {
    super(); // Call the superclass constructor

    // Attach a shadow DOM to this element, which encapsulates its content and styles
    this.attachShadow({ mode: "open" });
    // Initialize the tasks array with tasks retrieved from local storage
    this.tasks = this.getTasksFromLocalStorage();
  }
  // The connectedCallback method is called when the element is added to the DOM
  connectedCallback() {
    this.render(); // Render the component
  }
  // Method to render the component's HTML and attach event listeners
  render() {
    // Set the inner HTML of the shadow DOM, including styles and task items
    this.shadowRoot.innerHTML = `
  <style>
       /* Basic styles for the todo list */
    .todo-list {
      list-style: none; /* Remove default list styling */
      padding: 0; /* Remove default padding */
      margin-top: 20px;
      overflow-y: auto; /* Enable vertical scrolling */
    }

    .todo-list__counters {
      display: flex;
      justify-content: space-between;
      position: sticky;
      top: 0;
      background-color:gray;
      font-weight:semi-bold;
      padding: 10px;
      z-index: 1000; /* Ensure the counters are always on top */
      border-bottom: 2px solid #ccc; /* Optional: Add a border to separate counters and list */
    }

    .todo-list__completed-count {
      display: inline-flex;
      justify-items:center;
      align-items:center;
      border: 1px solid black;
      padding: 2px;
      background-color: #FBB13C; /* Background color to make sure text is visible */
      border-radius: 4px; /* Optional: Add rounded corners */
    }

    .todo-list__completed-count span {
      display: inline-block;
      padding: 5px;
      margin-left: 4px;
      background-color: #B66D0D; /* Background color for the span */
      color: #333; /* Text color for the span */
      font-weight: bold; /* Make text bold */
      border-radius: 4px; /* Optional: Add rounded corners to span */
    }
    @media (max-width: 600px) {
    .todo-list__completed-count p{
    font-size: 14px;
  }
    }
  </style>
  
  <div class="todo-list__counters">
    <div class="todo-list__completed-count">
      <p>Completed</p> <span>${this.getCompletedTasksCount()}</span>
    </div>
    <div class="todo-list__completed-count">
      <p>Remaining</p> <span>${this.getUncompletedCompletedTasksCount()}</span>
    </div>
    <div class="todo-list__completed-count">
      <p>Total</p> <span>${this.tasks.length}</span>
    </div>
  </div>
  <div class="todo-list">
      ${this.tasks
        .map(
          (task) => `
          <todo-item
            id="task-${task.id}" <!-- Assign a unique ID to each task item -->
            todo='${JSON.stringify(
              task
            )}'> <!-- Pass the task data to the todo-item element -->
          </todo-item>
        `
        )
        .join("")}
  </div>
`;

    // Attach event listeners to each rendered todo-item element
    this.tasks.forEach((task) => {
      // Get the todo-item element by its unique ID
      const todoItem = this.shadowRoot.getElementById(`task-${task.id}`);

      // Assign the task data to the todo property of the todo-item element
      todoItem.todo = task;

      // Listen for the "todo-removed" custom event from the todo-item
      todoItem.addEventListener(
        "todo-removed",
        (e) => this.removeTask(e.detail) // Remove the task when the event is triggered
      );

      // Listen for the "todo-toggled" custom event from the todo-item
      todoItem.addEventListener(
        "todo-toggled",
        (e) => this.toggleTaskCompletion(e.detail) // Toggle the task's completion status when the event is triggered
      );
      todoItem.addEventListener("important-toggled", (e) =>
        this.toggleImportant(e.detail)
      );
    });
  }
  // Method to add a new task to the tasks array
  addTask(task) {
    this.tasks.push(task); // Add the new task to the tasks array
    this.saveTasksToLocalStorage(); // Save the updated tasks array to local storage
    this.render(); // Re-render the component to reflect the new task
  }

  // Method to remove a task from the tasks array by its ID
  removeTask(taskId) {
    // Filter out the task with the specified ID from the tasks array
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    // Save the updated tasks array to local storage
    this.saveTasksToLocalStorage();
    // Re-render the component to reflect the removed task
    this.render();
  }

  // Method to toggle the completion status of a task
  toggleTaskCompletion(task) {
    // Find the index of the task with the specified ID in the tasks array
    const index = this.tasks.findIndex((t) => t.id === task.id);

    // If the task was found (index is not -1)
    if (index !== -1) {
      this.tasks[index] = task; // Update the task in the tasks array
      this.saveTasksToLocalStorage(); // Save the updated tasks array to local storage
      this.render(); // Re-render the component to reflect the updated task
    }
  }
  toggleImportant(task) {
    // Find the index of the task with the specified ID in the tasks array
    const index = this.tasks.findIndex((t) => t.id === task.id);

    // If the task was found (index is not -1)
    if (index !== -1) {
      this.tasks[index] = task; // Update the task in the tasks array
      this.saveTasksToLocalStorage(); // Save the updated tasks array to local storage
      this.render(); // Re-render the component to reflect the updated task
    }
  }
  // Add this method to TodoList class
  getCompletedTasksCount() {
    return this.tasks.filter((task) => task.completed).length;
  }
  getUncompletedCompletedTasksCount() {
    return this.tasks.filter((task) => !task.completed).length;
  }

  // Method to retrieve tasks from local storage
  getTasksFromLocalStorage() {
    // Get the tasks stored in local storage under the key "todo-tasks"
    const tasks = localStorage.getItem("todo-tasks");

    // If tasks were found, parse them as JSON; otherwise, return an empty array
    return tasks ? JSON.parse(tasks) : [];
  }

  // Method to save the current tasks array to local storage
  saveTasksToLocalStorage() {
    // Convert the tasks array to a JSON string and store it in local storage
    localStorage.setItem("todo-tasks", JSON.stringify(this.tasks));
  }
}

// Define the todo-list custom element, associating it with the TodoList class
customElements.define("todo-list", TodoList);
