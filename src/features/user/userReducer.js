import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { toast } from "react-toastify";

import config from "@/config/config";

//Initial global user state
const INITIAL_STATE = {
    user: null,
    loggedIn: false,
    loading: false,
    error: null
}

export const addUserAsync = createAsyncThunk("auth/addUser", async (payload, { rejectWithValue }) => {
    try {
        const { name, email, password } = payload;
        const newUser = { name, email, password };
        const response = await axios.post(`${config.serverBaseUrl}/api/user/signup`, newUser);
        toast.success("Signup Successful");
        return response.data;
    } catch (error) {
        toast.error(error.response.data);
        return rejectWithValue(error.message);
    }

})

export const handleSigninAsync = createAsyncThunk("auth/signIn", async (payload, { rejectWithValue }) => {
    try {
        const { email, password } = payload;
        const user = { email, password };
        const response = await axios.post(`${config.serverBaseUrl}/api/user/signin`, user);
        toast.success("Signin Successful");
        const token = response.data;
        localStorage.setItem('jwt', JSON.stringify(token));

        // Fetch user details after signing in
        const userData = await axios.get(`${config.serverBaseUrl}/api/user/me`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return { token, userData: userData.data.res };
    } catch (error) {
        if (!error.response.data.success) {
            toast.error(error.response.data.res);
        } else {
            toast.error("Something went wrong, try again later");
        }
        return rejectWithValue(error.message);
    }
});

export const fetchUserDetailsAsync = createAsyncThunk('user/fetchDetails', async (_, { rejectWithValue }) => {
    try {
        const token = JSON.parse(localStorage.getItem('jwt'));
        const response = await axios.get(`${config.serverBaseUrl}/api/user/me`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        return response.data.res;
    } catch (error) {

        return rejectWithValue(error.message);
    }
});


export const updateUserDetailAsync = createAsyncThunk('user/update', async (payload, { rejectWithValue }) => {
    try {
        const token = JSON.parse(localStorage.getItem('jwt'));
        const { name, email, file } = payload;
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (file) {
            formData.append('imageUrl', file);
        }
        const response = axios.put(`${config.serverBaseUrl}/api/user/`, formData,
            {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;

    } catch (error) {
        toast.error("Something went wrong,try again later");
        return rejectWithValue(error.message);
    }
})



const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loggedIn = true;
        },
        signOut: (state) => {
            state.user = null;
            state.loggedIn = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('jwt');

        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(addUserAsync.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(addUserAsync.fulfilled,(state)=>{
                state.loading = false;
                state.error = null;
            })
            .addCase(addUserAsync.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload;
            })

            // Handle Sign-In
            .addCase(handleSigninAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleSigninAsync.fulfilled, (state, action) => {
                state.user = action.payload.userData;
                state.loggedIn = true;
                state.loading = false;
            })
            .addCase(handleSigninAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle Update User
            .addCase(updateUserDetailAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserDetailAsync.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                toast.success("Profile updated successfully");
            })
            .addCase(updateUserDetailAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserDetailsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetailsAsync.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loggedIn = true;
                state.loading = false;
            })
            .addCase(fetchUserDetailsAsync.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });

    }



});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

export const authSelector = (state) => state.authReducer;