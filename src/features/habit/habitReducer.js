import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { toast } from "react-toastify";
import config from "@/config/config";
const INITIAL_STATE = {
    habits: [],
    loading: false,
    error: null

}

export const changeStatusAsync = createAsyncThunk('change/status', async (payload, { rejectWithValue }) => {

    try {
        const { habitId, dateId, status } = payload;
        // Retrieve the habit document from Firestore
        const response = await axios.put(`${config.serverBaseUrl}/api/habit/${habitId}`, { dateId });
        const { habitId: _id, currentStreak, bestStreak, totalDays } = response.data.res;
        return { habitId, status, currentStreak, bestStreak, totalDays, dateId };
    } catch (error) {
        toast.error("Something went wrong,try again later");
        return rejectWithValue(error.message);
    }


});

export const updateFavoriteAsync = createAsyncThunk(
    'habit/updateFavorite',
    async ({ id, fav }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${config.serverBaseUrl}/api/habit/toggleFav/${id}`)
            
            return response.data.res;
        } catch (error) {
            toast.error("Something went wrong,try again later");
            return rejectWithValue(error.message);
        }
    }
);



export const addHabitAsync = createAsyncThunk('habit/add', async (payload, { rejectWithValue }) => {
    try {
        const token = JSON.parse(localStorage.getItem('jwt'));
        
        const response = await axios.post(`${config.serverBaseUrl}/api/habit/add`, payload,
            {
                headers: {
                    Authorization: `${token}`
                }
            }
        );
        toast.success("Habit added successfully");
        return response;

    } catch (error) {
        toast.error("Something went wrong,try again later");
        return rejectWithValue(error.message);
    }

})

export const fetchAndUpdateAllHabits = createAsyncThunk(
    'habit/fetchAndUpdateAll',
    async (_, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('jwt'));
            const response = await axios.get(`${config.serverBaseUrl}/api/habit`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            if (response.data) {
                return (response.data.res);

            }

        } catch (error) {
            toast.error("Something went wrong, try again later");
            return rejectWithValue(error.message);
        }
    }
);

export const updateHabitAsync = createAsyncThunk('habit/update', async (payload, { rejectWithValue }) => {
    try {
        const { title, schedule, _id } = payload;
        const response = await axios.put(`${config.serverBaseUrl}/api/habit/detail/${_id}`, { title, schedule });
        toast.success("Habit updated successfully");
        return response.data.res;

    } catch (error) {
        toast.error("Something went wrong,try again later");
        return rejectWithValue(error.message);
    }

})

export const deleteHabitAsync = createAsyncThunk('habit/delete', async (payload, { rejectWithValue }) => {
    try {
        await axios.delete(`${config.serverBaseUrl}/api/habit/${payload._id}`);
        toast.success("Habit deleted successfully");
        return payload._id;

        
    } catch (error) {
        toast.error("Something went wrong,try again later");
        return rejectWithValue(error.message);
    }

})

const habitSlice = createSlice({
    name: 'habit',
    initialState: INITIAL_STATE,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addHabitAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(addHabitAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.habits.push(action.payload);
            })
            .addCase(addHabitAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAndUpdateAllHabits.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAndUpdateAllHabits.fulfilled, (state, action) => {
                state.loading = false;
                state.habits = (action.payload);

            })
            .addCase(fetchAndUpdateAllHabits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(changeStatusAsync.fulfilled, (state, action) => {
                const { habitId, status, dateId, currentStreak, bestStreak, totalDays } = action.payload;
                const habitIndex = state.habits.findIndex((habit) => habit._id === habitId);

                if (habitIndex !== -1) {
                    const habit = state.habits[habitIndex];
                    const statusIndex = habit.statuses.findIndex((statusItem) => statusItem._id === dateId);

                    if (statusIndex !== -1) {
                        state.habits[habitIndex].statuses[statusIndex].status = status;
                        state.habits[habitIndex].currentStreak = currentStreak;
                        state.habits[habitIndex].bestStreak = bestStreak;
                        state.habits[habitIndex].totalDays = totalDays;
                    }
                }
            })
            .addCase(changeStatusAsync.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
            .addCase(updateFavoriteAsync.fulfilled, (state, action) => {
                
                const habitToUpdate = state.habits.find(habit => habit._id === action.payload._id);
                if (habitToUpdate) {
                    habitToUpdate.fav = action.payload.fav;
                }
            })
            .addCase(updateFavoriteAsync.rejected, (state, action) => {
                
                state.error = action.payload;
            })
            .addCase(updateFavoriteAsync.pending, (state) => {
                
                state.error = null;
            })
            .addCase(updateHabitAsync.fulfilled, (state, action) => {
                const updatedHabit = action.payload;
                const habitIndex = state.habits.findIndex(habit => habit._id === updatedHabit._id);
                if (habitIndex !== -1) {
                    state.habits[habitIndex] = updatedHabit;
                }
            })
            .addCase(updateHabitAsync.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteHabitAsync.pending,(state,action)=>{
                state.loading=true;
            })
            .addCase(deleteHabitAsync.fulfilled, (state, action) => {
                state.loading=false;
                const habitId = action.payload;
                state.habits = state.habits.filter(habit => habit._id !== habitId);
            })
            .addCase(deleteHabitAsync.rejected, (state, action) => {
                state.loading=false;
                state.error = action.payload;
            });
    }
})

export const habitReducer = habitSlice.reducer;
export const habitSelector = (state) => state.habitReducer;