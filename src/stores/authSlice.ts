import {StateCreator} from "zustand";
import {StoreState} from "./rootStore";
import axiosInstance from "../libs/axios";

export interface User {
    username: string,
    roles: Array<any>
}

export interface AuthSlice {
    accessToken: string;
    sliceInit: boolean
    user: User | null;
    setUser: (by: any) => void
    login: (username: string, password: string) => Promise<void>
    fetchProfile: () => Promise<void>
    logout: () => Promise<void>
    init: () => void
}

const loginEndpoint = '/auth/login';
const storageTokenKeyName = 'accessToken';
const storageRefreshTokenKeyName = 'refreshToken';
const storageUserDataKeyName = 'userData';
const initUserData = () => {
    try{
        return JSON.parse(localStorage.getItem(storageUserDataKeyName) ?? '')
    }catch (e){
        return null;
    }
}
export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> =
    (set) => (
        {
            accessToken: localStorage.getItem(storageTokenKeyName) ?? '',
            user: null,
            sliceInit: false,
            init:  () => {
                set(state => {
                    state.auth.user = initUserData()
                    state.auth.sliceInit = true
                    return state;
                })
            },
            login: async (username: string, password: string) => {
                const base64 = btoa(unescape(`${username}:${password}`))
                const response = await axiosInstance.post(loginEndpoint, {}, {
                    headers: {Authorization: `Basic ${base64}`}
                });
                set(state => {
                    state.auth.accessToken = response.data.access_token;
                    localStorage.setItem(storageTokenKeyName, response.data.access_token)
                    localStorage.setItem(storageRefreshTokenKeyName, response.data.refresh_token)
                    return state;
                })
            },
            fetchProfile: async () => {
                console.log('fetchProfile')
                const response = await axiosInstance.get('/auth/me');
                localStorage.setItem(storageUserDataKeyName, JSON.stringify(response.data))
                set(state => {
                    state.auth.user = response.data;
                    return state;
                })
            },
            logout: async () => {
                set(state => {
                    state.auth.accessToken = '';
                    state.auth.user = null;
                    localStorage.clear()
                    return state;
                })
            },
            setUser: (payload) => set((state) => {
                    state.auth.user = payload;
                    return state;
                }
            )
        }
    )