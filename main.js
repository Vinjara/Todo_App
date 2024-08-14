import "./components/TodoList.js";

document.addEventListener("DOMContentLoaded", () => {
  const todoList = document.querySelector("todo-list");
  const addTaskBtn = document.getElementById("add-task-btn");
  const fetchTasksBtn = document.getElementById("fetch-tasks-btn");
  const deleteAllBtn = document.getElementById("delete-all-btn");
  const deleteManualBtn = document.getElementById("delete-manual-btn");
  const deleteApiBtn = document.getElementById("delete-api-btn");
  const deleteCompletedBtn = document.getElementById("delete-completed-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const currentDate = new Date().toJSON().slice(0, 10);
  const [year, month, day] = currentDate.split("-");
  const formattedDate = `${day}/${month}/${year}`;

  addTaskBtn.addEventListener("click", () => {
    const newTaskInput = document.getElementById("new-task");
    if (newTaskInput.value.trim() !== "") {
      const newTask = {
        id: Date.now(),
        date: formattedDate,
        text: newTaskInput.value.trim(),
        completed: false,
        fromApi: false,
      };
      todoList.addTask(newTask);
      newTaskInput.value = "";
      newTaskInput.focus();
    }
  });

  let totalFetchedTasks = 0;

  fetchTasksBtn.addEventListener("click", async () => {
    const taskCountInput = document.getElementById("api-task-count");
    const taskCount = parseInt(taskCountInput.value);

    if (!isNaN(taskCount) && taskCount > 0) {
      try {
        const response = await fetch(
          `https://dummyjson.com/todos?limit=${taskCount}&skip=${totalFetchedTasks}`
        );
        const data = await response.json();

        data.todos.forEach((apiTask) => {
          // Check if the task already exists
          if (!todoList.tasks.some((task) => task.id === apiTask.id)) {
            const newTask = {
              id: apiTask.id,
              text: apiTask.todo,
              date: formattedDate,
              completed: false,
              fromApi: true,
            };
            todoList.addTask(newTask);
          }
        });

        totalFetchedTasks += taskCount; // Update the total fetched tasks count
        alert("Tasks added successfully!");
      } catch (error) {
        alert("Error fetching tasks from API");
      }
    }
  });

  deleteAllBtn.addEventListener("click", () => {
    // Clear tasks from both the DOM and local storage
    todoList.tasks = [];
    todoList.saveTasksToLocalStorage(); // Clear local storage
    todoList.render(); // Re-render to update the DOM
  });

  deleteManualBtn.addEventListener("click", () => {
    // Filter out and keep only API tasks in the array
    todoList.tasks = todoList.tasks.filter((task) => task.fromApi);
    todoList.saveTasksToLocalStorage(); // Save the remaining tasks to local storage
    todoList.render(); // Re-render to update the DOM
  });

  deleteApiBtn.addEventListener("click", () => {
    // Filter out and keep only manual tasks in the array
    todoList.tasks = todoList.tasks.filter((task) => !task.fromApi);
    todoList.saveTasksToLocalStorage(); // Save the remaining tasks to local storage
    todoList.render(); // Re-render to update the DOM
  });
  deleteCompletedBtn.addEventListener("click", () => {
    todoList.tasks = todoList.tasks.filter((task) => !task.completed);
    todoList.saveTasksToLocalStorage(); // Save the remaining tasks to local storage
    todoList.render(); // Re-render to update the DOM
  });

  logoutBtn.addEventListener("click", function () {
    window.location.href = "login.html"; // Redirect to the main app
    localStorage.clear();
  });
});
