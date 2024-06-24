import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Type declaration

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  tasks: Task[];
}

const initialState: TodoState = {
  tasks: [],
};

// Redux slice to manage tasks
const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("tasks", JSON.stringify(action.payload));
      }
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("tasks", JSON.stringify(state.tasks));
      }
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        if (typeof window !== "undefined") {
          localStorage.setItem("tasks", JSON.stringify(state.tasks));
        }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("tasks", JSON.stringify(state.tasks));
      }
    },
    editTask: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const task = state.tasks.find(task => task.id === action.payload.id);
      if (task) {
        task.text = action.payload.text;
        if (typeof window !== "undefined") {
          localStorage.setItem("tasks", JSON.stringify(state.tasks));
        }
      }
    },
  },
});

export const { setTasks, addTask, toggleTaskCompletion, deleteTask, editTask } = todoSlice.actions;
export default todoSlice.reducer;

//  to fix the ssr localstorage error
export const loadTasksFromLocalStorage = () => (dispatch: (arg0: { payload: Task[]; type: "todo/setTasks"; }) => void) => {
  if (typeof window !== "undefined") {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      dispatch(setTasks(JSON.parse(storedTasks)));
    }
  }
};
