import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentTask: null,
    loading: false,
    error: false,
};

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        creatTaskStart: (state) => {
            state.loading = true;
        },
        creatTaskSuccess: (state, action) => {
            state.currentTask = action.payload;
            state.loading = false;
            state.error = false;
        },
        creatTaskFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateTaskStart: (state) => {
            state.loading = true;
        },
        updateTaskSuccess: (state, action) => {
            state.currentTask = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateTaskFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteTaskStart: (state) => {
            state.loading = true;
        },
        deleteTaskSuccess: (state) => {
            state.currentTask = null;
            state.loading = false;
            state.error = false;
        },
        deleteTaskFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});


export const {
    creatTaskFailure,
    creatTaskStart,
    creatTaskSuccess,
    updateTaskFailure,
    updateTaskStart,
    updateTaskSuccess,
    deleteTaskFailure,
    deleteTaskStart,
    deleteTaskSuccess
} = taskSlice.actions

export default taskSlice.reducer;