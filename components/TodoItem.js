// Define the custom element class
class TodoItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._todo = {}; // Initialize a private property to hold todo item data
  }

  // Setter for the 'todo' property
  set todo(value) {
    this._todo = value; // Set the internal todo data
    this.render(); // Call the render method to update the element's appearance
  }

  // Getter for the 'todo' property
  get todo() {
    return this._todo; // Return the internal todo data
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .todo-list__item {
          display: flex; 
          align-items: center;
          padding: 10px 15px;
          border: ${this._todo.important ? "red 2px" : "black 1px"}  solid ; 
          border-radius: 25px; 
          background-color: ${this._todo.completed ? "grey" : "#e0ffe0"};
          font-style: ${this._todo.fromApi ? "italic" : "normal"};
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); 
          margin-bottom: 10px; 
          transition: background-color 0.3s ease; 
          cursor: pointer; 
        }

        .todo-list__item--completed {
          text-decoration: line-through; 
          color: white; 
        }

        .todo-list__checkbox {
          width: 20px;
          height: 20px;
          margin-right: 15px; 
          cursor: pointer;
          flex-shrink: 0; 
        }

        input[type="checkbox"] {
          appearance: none;
          background-color: #fff;
          border: 2px solid #4caf50;
          border-radius: 50%;
          width: 25px;
          height:25px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        input[type="checkbox"]:checked {
          background-color: #fbb13c;
          border-color: #fbb13c;
        }

        input[type="checkbox"]::before {
          content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'/%3E%3C/svg%3E");
          transform: scale(0);
          transition: transform 0.3s ease;
        }

        input[type="checkbox"]:checked::before {
          transform: scale(1);
        }

        .todo-list__content {
          display: flex;
          align-items: center;
          width: 100%; /* Full width to ensure clicking on the entire area */
        }

        .todo-list__text {
          flex-grow: 1; /* Allow the text to take up available space */
          padding: 0 15px;
          font-size: 1rem;
          color: ${this._todo.completed ? "white" : "black"};
        }

        .todo-item__date {
          margin-right: 20px; /* Space between date and remove button */
          font-size: 0.85rem;
          color: ${this._todo.completed ? "white" : "black"};          
        }

        .todo-list__remove-button {
          background-color: transparent;
          border: none;
          cursor: pointer;
          outline: none;
          padding: 5px;
          transition: transform 0.2s ease;
        }

        .todo-list__remove-button img {
          width: 20px;
          height: 20px;
        }

        .todo-list__remove-button:hover {
          transform: scale(1.1); 
        }
           .todo-list__important-button {
          background-color: transparent;
          border: none;
          cursor: pointer;
          outline: none;
          padding: 5px;
          transition: transform 0.2s ease;
        }

        .todo-list__important-button img {
          width: 20px;
          height: 20px;
        }

        .todo-list__important:hover {
          transform: scale(1.1); 
        }
        @media (max-width: 600px) {
        .todo-item__date {
          display: none;}
          }
      </style>
      <div class="todo-list__item ${
        this._todo.completed ? "todo-list__item--completed" : ""
      }">
        <div class="todo-list__content">
          <input type="checkbox" ${
            this._todo.completed ? "checked" : ""
          } class="todo-list__checkbox"> 
          <span class="todo-list__text">${this._todo.text}</span>
          <span class="todo-item__date">${this._todo.date}</span> 
        </div>
         <button class="todo-list__important-button">
          <img src="images/exclamation.svg" alt="Mark as important"> 
        </button>
        <button class="todo-list__remove-button">
          <img src="images/delete.svg" alt="Remove Task"> 
        </button>
      </div>
    `;

    // Add event listener to the content div for toggling completion status
    this.shadowRoot
      .querySelector(".todo-list__content")
      .addEventListener("click", () => this.toggleCompleted());

    // Add event listener to the remove button for removing the item
    this.shadowRoot
      .querySelector(".todo-list__remove-button")
      .addEventListener("click", () => this.removeTodo());

    this.shadowRoot
      .querySelector(".todo-list__important-button")
      .addEventListener("click", () => this.toggleImportant());
  }

  // Method to toggle the completion status of the todo item
  toggleCompleted() {
    this._todo.completed = !this._todo.completed; // Toggle the completed status
    this.render(); // Re-render the element to update its appearance
    // Dispatch a custom event to notify parent components of the change
    this.dispatchEvent(new CustomEvent("todo-toggled", { detail: this._todo }));
  }
  toggleImportant() {
    this._todo.important = !this._todo.important;
    this.render();
    this.dispatchEvent(
      new CustomEvent("important-toggled", { detail: this._todo })
    );
  }

  // Method to remove the todo item
  removeTodo() {
    // Dispatch a custom event to notify parent components of the removal
    this.dispatchEvent(
      new CustomEvent("todo-removed", { detail: this._todo.id })
    );
    this.remove(); // Remove the element from the DOM
  }
}

// Define the custom element in the browser
customElements.define("todo-item", TodoItem);
