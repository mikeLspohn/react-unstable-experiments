import React, { useState, useReducer } from "react"

type todoActionType = "ADD_TODO" | "UPDATE_TODO" | "DELETE_TODO"

export interface Todo {
  id: number
  title: string
  message: string
  createdOn: string
}

interface todosReducerState {
  todos: Array<Todo>
}

interface actionWithParams<T> {
  type: todoActionType
  payload?: T
  id?: number
}

// Initial State and Action Creators
const initialState: todosReducerState = {
  todos: []
}

const addTodo = (payload: string): actionWithParams<string> => ({
  type: "ADD_TODO",
  payload
})

const updateTodo = (id: number, payload: string): actionWithParams<string> => ({
  type: "UPDATE_TODO",
  id,
  payload
})

const deleteTodo = (id: number): actionWithParams<string> => ({
  type: "DELETE_TODO",
  id
})

type objWithKey<T> = { [key: string]: T }
const updateIn = (key: string, obj: objWithKey<any>, value: object) => {
  return { ...obj, [key]: { ...obj[key], ...value } }
}

const user = {
  id: 1,
  employee: {
    firstName: "john",
    lastName: "jonson"
  }
}

// Todos Reducer
const todosReducer = (
  state = initialState,
  action: actionWithParams<string>
): todosReducerState => {
  const { todos } = state
  const currentIndex = todos.findIndex(todo => todo.id === action.id)
  console.log(updateIn("employee", user, { firstName: "joey" }))

  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...todos,
          {
            id: Math.random(),
            title: action.payload || "",
            createdOn: "now",
            message: ""
          }
        ]
      }

    case "UPDATE_TODO":
      if (typeof currentIndex !== "number") return state // error

      return {
        ...state,
        todos: [
          ...todos.slice(0, currentIndex),
          { ...todos[currentIndex], title: action.payload || "" },
          ...todos.slice(currentIndex + 1)
        ]
      }

    case "DELETE_TODO":
      return {
        ...state,
        todos: [
          ...todos.slice(0, currentIndex),
          ...todos.slice(currentIndex + 1)
        ]
      }

    default:
      throw Error("Unmatched action type passed to todosReducer")
  }
}

// Component
export default function TodoList() {
  const [todosState, dispatch] = useReducer(todosReducer, initialState)
  const [newTodoText, setNewTodo] = useState("")

  return (
    <div>
      <ul>
        {todosState.todos.map(todo => (
          <li>
            {/* UPDATE TODO ITEM */}
            <input
              onChange={e => dispatch(updateTodo(todo.id, e.target.value))}
            />

            {todo.title}

            {/* DELETE TODO ITEM */}
            <button onClick={() => dispatch(deleteTodo(todo.id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* ADD NEW TODO ITEM */}
      <input onChange={e => setNewTodo(e.target.value)} value={newTodoText} />

      <button
        onClick={() => {
          dispatch(addTodo(newTodoText))
          setNewTodo("")
        }}
      >
        Add new todo
      </button>
    </div>
  )
}
