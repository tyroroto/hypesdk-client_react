import create from "zustand";
import {immer} from 'zustand/middleware/immer'
import {AuthSlice, createAuthSlice} from "./authSlice";
import {AppSlice, createAppSlice} from "./appSlice";
import {createFormEditorSlice, FormEditorSlice} from "./formEditorSlice";
import {AppEditorSlice, createAppEditorSlice} from "./appEditorSlice";

export type StoreState = {
    app: AppSlice,
    auth: AuthSlice
    formEditor: FormEditorSlice
    appEditor: AppEditorSlice
};
export const useBoundStore = create<StoreState>()(
    immer((...a) =>
        (
            {
                app: createAppSlice(...a),
                auth: createAuthSlice(...a),
                formEditor: createFormEditorSlice(...a),
                appEditor: createAppEditorSlice(...a)
            }
        )
    )
)
