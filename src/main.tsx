import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.scss'
import {RouterProvider} from "react-router-dom";
import {router} from "./Router";
import {AbilityContext} from "./hype/contexts/CanContext";
import {defineAbility} from "@casl/ability";
import {
    QueryClient,
    QueryClientProvider
} from 'react-query'
import {Toaster} from "react-hot-toast";

const ability = defineAbility((can) => {
    can('read', 'Auth');
});
// Create a client
const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false, // default: true
            },
        }
    }
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AbilityContext.Provider value={ability}>
                <Toaster/>
                <RouterProvider router={router}/>
            </AbilityContext.Provider>
        </QueryClientProvider>
    </React.StrictMode>,
)
