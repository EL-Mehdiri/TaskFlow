import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentProject: null,
    loading: false,
    error: false,
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        creatProjectStart: (state) => {
            state.loading = true;
        },
        creatProjectSuccess: (state, action) => {
            state.currentProject = action.payload;
            state.loading = false;
            state.error = false;
        },
        creatProjectFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateProjectStart: (state) => {
            state.loading = true;
        },
        updateProjectSuccess: (state, action) => {
            state.currentProject = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateProjectFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteProjectStart: (state) => {
            state.loading = true;
        },
        deleteProjectSuccess: (state) => {
            state.currentProject = null;
            state.loading = false;
            state.error = false;
        },
        deleteProjectFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});


export const {
    creatProjectFailure,
    creatProjectStart,
    creatProjectSuccess,
    updateProjectFailure,
    updateProjectStart,
    updateProjectSuccess,
    deleteProjectFailure,
    deleteProjectStart,
    deleteProjectSuccess
} = projectSlice.actions

export default projectSlice.reducer;