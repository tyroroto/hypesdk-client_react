import {StateCreator} from "zustand";
import {StoreState} from "./rootStore";
import axiosInstance from "../libs/axios";

const initialAppInformation = () => {
    const item = window.localStorage.getItem('app-info')
    //** Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : null
}

export interface AppSlice {
    apiUrl: string | null;

    appInfo: { appName: string,email: string, loginTitle: string, loginSubTitle: string, loginImage: string } | null;

    getAppInfo(url: string): Promise<any>;

    setApiUrl(newUrl: string): void;

    clearRemoteUrl(): void;

}

export const apiUrlLocalStorageKey = 'hype-remote-api-url';
const initApiURL = (): string | null => {
    const localAPIUrl = localStorage.getItem(apiUrlLocalStorageKey);
    if(localAPIUrl != null){
        return localAPIUrl;
    }
    return import.meta.env.VITE_API_SCHEME + '://' +    import.meta.env.VITE_API_URL

}

export const createAppSlice: StateCreator<StoreState, [], [], AppSlice> = (set, get) => ({
    appInfo: initialAppInformation(),
    apiUrl: initApiURL(),
    getAppInfo: async (url: string) => {
        const response = await axiosInstance.get(`${url}/app-info`)
        set((state) => {
            state.app.appInfo = response.data;
            window.localStorage.setItem('app-info', JSON.stringify(response.data))
            return state;
        })
        return response.data;
    },
    setApiUrl: (newApiUrl: string) => {
        axiosInstance.defaults.baseURL = newApiUrl
        localStorage.setItem(apiUrlLocalStorageKey, newApiUrl)
        set((state) => {
            state.app.apiUrl = newApiUrl;
            return state;
        });
    },
    clearRemoteUrl: () => {
        set((state) => {
            state.app.apiUrl = null;
            return state;
        });
    },

})
