import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: localStorage.getItem("userId") || null,
    userName: localStorage.getItem("userName") || null,
    interviewId: localStorage.getItem("interviewId") || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
    isResumeUploaded: localStorage.getItem("isResumeUploaded") === "true",
    isChatStarted: localStorage.getItem("isChatStarted") === "true"
}

export const generalInfoSlice = createSlice({
    name: 'generalInfo',
    initialState,
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload;
            localStorage.setItem("userId", action.payload ?? "");
        },
        setInterviewId: (state, action) => {
            state.interviewId = action.payload;
            localStorage.setItem("interviewId", action.payload ?? "");
        },
        setAuth: (state, action) => {
            const { userId, token, userName } = action.payload;
            state.userId = userId;
            state.token = token;
            state.userName = userName ?? null;
            state.isAuthenticated = true;
            localStorage.setItem("userId", userId);
            localStorage.setItem("token", token);
            if (userName) {
                localStorage.setItem("userName", userName);
            } else {
                localStorage.removeItem("userName");
            }
            localStorage.setItem("isAuthenticated", "true");
        },
        logout: (state) => {
            state.userId = null;
            state.userName = null;
            state.interviewId = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isResumeUploaded = false;
            state.isChatStarted = false;
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("interviewId");
            localStorage.removeItem("token");
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("isResumeUploaded");
            localStorage.removeItem("isChatStarted");
        },
        setIsResumeUploaded: (state, action) => {
            state.isResumeUploaded = action.payload;
            localStorage.setItem("isResumeUploaded", action.payload.toString());
        },
        setIsChatStarted: (state, action) => {
            state.isChatStarted = action.payload;
            localStorage.setItem("isChatStarted", action.payload.toString());
        },
    }
})

export const { setUserId, setInterviewId, setAuth, logout, setIsResumeUploaded, setIsChatStarted } = generalInfoSlice.actions

export default generalInfoSlice.reducer
