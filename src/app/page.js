"use client";

import { useState, useEffect } from 'react';
import './globals.css';
import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Load todos from local storage when the component mounts
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Update local storage whenever the todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;
    setTodos([...todos, newTodo]);
    setNewTodo('');
  };

  const handleDeleteTodo = (index) => {
    console.log(`Deleting item at index: ${index}`);
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  useCopilotAction({
    name: "addTodoItem",
    description: "Add a new todo item to the list",
    parameters: [
      {
        name: "todoText",
        type: "string",
        description: "The text of the todo item to add",
        required: true,
      },
    ],
    handler: async ({ todoText }) => {
      setTodos([...todos, todoText]);
    },
  });

  useCopilotAction({
    name: "deleteTodoItem",
    description: "Delete a todo item from the list",
    parameters: [
      {
        name: "index",
        type: "number",
        description: "The index or number of the todo item to delete",
        required: true,
      },
    ],
    handler: async ({ index }) => {
      console.log(`Deleting item at index: ${index}`);
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      setTodos(newTodos);
    },
  });

  useCopilotAction({
    name: "listTodoItems",
    description: "List all current todo items with their indices",
    handler: async () => {
      return todos.map((todo, index) => `${index + 1}: ${todo}`).join("\n"); // Starting from 1
    },
  });

  return (
    <div className="container">
      <h1>Todo List</h1>
      <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a new task" />
      <button onClick={handleAddTodo}>Add</button>
      {todos.length === 0 ? (
        <p>No todos right now</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo, index) => (
            <li key={index+1}>
              {index + 1}) {todo} 
              <button onClick={() => handleDeleteTodo(index)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <CopilotPopup
        instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
        labels={{
          title: "AI Assistant",
          initial: "Need any help? You can add single/multiple todos by the help of this AI tool.",
        }}
      />
    </div>
  );
}
