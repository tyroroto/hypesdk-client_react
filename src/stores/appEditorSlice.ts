import {StateCreator} from "zustand";
import {StoreState} from "./rootStore";
import {EditorBoxPosition, EditorModeType, FormActionEnum, FormActionType} from "../hype/classes/constant";
import {IAppData} from "../hype/classes/layout.interface";


export interface AppEditorSlice {
    appData: IAppData | null,
    currentSelectedBoxId: any;
    currentSelectedBox?: LayoutItemInterface | null;
    currentMode: EditorModeType;
    layoutItemList: Array<LayoutItemInterface>;
    currentLayout: LayoutDataInterface | null;
    showBoxConfig: boolean;
    boxConfigFormAction: FormActionType;
    closeBoxConfig: () => void;
    layoutScript: { [key: string]: string }

    moveCurrentBoxTo(id: string, position: EditorBoxPosition): void;

    selectBoxToMove(id: string | null): void;

    openBoxConfig(id: string, formAction?: 'new' | string): void;

    createBox(parent: 'root' | string, boxData: Partial<LayoutItemInterface>): void;

    updateBox(id: string, boxData: Partial<LayoutItemInterface>): void;

    removeBox(id: string): void;

    setLayoutItemList(layoutItems: Array<any>): void;

    setCurrentLayout(layoutData: any): void;

    setAppData(newApp: any): void;

    changeEditorMode(mode: string): void;

    updateCurrentLayoutScript(key: string, script: string): void;
}


export const createAppEditorSlice: StateCreator<StoreState, [], [], AppEditorSlice> = (set, get) => ({
    appData: null,
    showBoxConfig: false,
    boxConfigFormAction: FormActionEnum.EDIT,
    currentSelectedBoxId: null,
    currentSelectedBox: null,

    layoutItemList: [],
    layoutScript: {},
    currentLayout: null,
    currentMode: 'editor',
    changeEditorMode: (mode: EditorModeType) => {
        set(state => {
            state.appEditor.currentSelectedBox = null;
            state.appEditor.currentSelectedBoxId = null;
            state.appEditor.currentMode = mode;
            return state;
        })
    },
    setAppData: (newAppData: any) => {
        set(state => {
            state.appEditor.appData = newAppData;
            return state;
        })
    },
    moveCurrentBoxTo: (id: string, position: EditorBoxPosition) => {
        const target = id
        const appEditor = get().appEditor;
        const targetIndex = appEditor.layoutItemList.findIndex(d => d.id === target)
        set((state) => {
            // return state;
            if(appEditor.currentSelectedBox == null){
                return state
            }
            const child = findChildren(appEditor.layoutItemList, appEditor.currentSelectedBox, target);
            if (child != null) {
                alert(' Cannot move to this box children. ');
                return state;
            }

            // remove selected box from latest children
            for (const boxIndex in appEditor.layoutItemList) {
                if (appEditor.layoutItemList[boxIndex].children.indexOf(appEditor.currentSelectedBoxId) > -1) {
                    state.appEditor.layoutItemList[boxIndex].children = state.appEditor.layoutItemList[boxIndex].children.filter(item => item !== appEditor.currentSelectedBoxId)
                }
            }
            if (position === 'first' || position === 'last') {
                // append source to new target Child
                state.appEditor.layoutItemList[targetIndex].children = [...state.appEditor.layoutItemList[targetIndex].children, appEditor.currentSelectedBoxId]
            } else {
                let filteredState = appEditor.layoutItemList.filter(item => item.id !== appEditor.currentSelectedBoxId)
                console.log(target)
                const renewTargetIndex = filteredState.findIndex(item => item.id === target)
                if (appEditor.currentSelectedBox?.type === 'container') {
                    console.log(filteredState)
                    console.log(renewTargetIndex + position === 'before' ? 0 : 1)
                    console.log(filteredState.slice(renewTargetIndex + (position === 'before' ? 0 : 1)))

                    filteredState = [
                        ...filteredState.slice(0, renewTargetIndex + (position === 'before' ? 0 : 1)),
                        appEditor.currentSelectedBox,
                        ...filteredState.slice(renewTargetIndex + (position === 'before' ? 0 : 1))
                    ]
                    state.appEditor.layoutItemList = [...filteredState]

                } else {
                    let parentIndex: null | number = null;
                    for (const boxIndex in appEditor.layoutItemList) {
                        if (appEditor.layoutItemList[boxIndex].children.indexOf(target) > -1) {
                            parentIndex = parseInt(boxIndex);
                            break;
                        }
                    }
                    if (parentIndex != null) {
                        const targetIndexInChildren = state.appEditor.layoutItemList[parentIndex].children.indexOf(target);
                        console.log('position', position)
                        console.log('position', state.appEditor.layoutItemList[parentIndex].children.slice(0, targetIndexInChildren + (position === 'before' ? 0 : 1)))
                        console.log('position', state.appEditor.layoutItemList[parentIndex].children.slice(targetIndexInChildren + (position === 'before' ? 0 : 1)))
                        state.appEditor.layoutItemList[parentIndex] = {
                            ...state.appEditor.layoutItemList[parentIndex],
                            children: [
                                ...state.appEditor.layoutItemList[parentIndex].children.slice(0, targetIndexInChildren + (position === 'before' ? 0 : 1)),
                                state.appEditor.currentSelectedBoxId,
                                ...state.appEditor.layoutItemList[parentIndex].children.slice(targetIndexInChildren + (position === 'before' ? 0 : 1))
                            ]
                        }
                    }
                }
            }

            state.appEditor.currentSelectedBoxId = null
            state.appEditor.currentSelectedBox = null;
            return state;
        })
    },
    selectBoxToMove: (id: string) => {
        set((state) => {
            state.appEditor.currentSelectedBoxId = id;
            if (id != null && state.appEditor.currentSelectedBox != null) {
                state.appEditor.currentSelectedBox = state.appEditor.layoutItemList.find(d => d.id === id)
            }
            return state;
        })
    },
    openBoxConfig: (id: string, formAction: FormActionType) => {
        set((state) => {
            state.appEditor.showBoxConfig = true;
            state.appEditor.boxConfigFormAction = formAction ?? 'edit'
            state.appEditor.currentSelectedBoxId = id
            state.appEditor.currentSelectedBox = state.appEditor.layoutItemList.find(d => d.id === id)
            return state;
        })
    },

    closeBoxConfig: () => {
        set((state) => {
            state.appEditor.showBoxConfig = false;
            return state;
        })
    },
    updateBox: (id: string, boxData: Partial<LayoutItemInterface>) => {
        set((state) => {
            const index = state.appEditor.layoutItemList.findIndex(d => d.id === id)
            if (state.appEditor.layoutItemList[index].children != null) {
                state.appEditor.layoutItemList[index] = {
                    ...state.appEditor.layoutItemList[index],
                    ...boxData
                };
            }
            return state;
        })
    },
    removeBox: (id: string) => {
        set((state) => {
            const appEditor = state.appEditor;
            const removeRecursive = (rmId: string) => {
                const removeBox = state.appEditor.layoutItemList.find(item => item.id == rmId)
                if (removeBox != null) {
                    for (const crmId of removeBox.children) {
                        removeRecursive(crmId);
                    }

                    // remove from other box children
                    for (const boxIndex in appEditor.layoutItemList) {
                        if (appEditor.layoutItemList[boxIndex].children.indexOf(appEditor.currentSelectedBoxId) > -1) {
                            state.appEditor.layoutItemList[boxIndex].children = state.appEditor.layoutItemList[boxIndex].children.filter(item => item !== appEditor.currentSelectedBoxId)
                        }
                    }

                    // remove from list
                    const removeIndex = state.appEditor.layoutItemList.findIndex(item => item.id == rmId)
                    if (removeIndex > -1) {
                        state.appEditor.layoutItemList.splice(removeIndex, 1);
                    }
                }
            }
            removeRecursive(id);
            state.appEditor.showBoxConfig = false;
            state.appEditor.currentSelectedBoxId = null
            state.appEditor.currentSelectedBox = null;
            return state;
        })
    },
    createBox: (parent: string, boxData: LayoutItemInterface) => {
        if (parent === 'root') {
            const id = `${boxData.type}_${new Date().getTime()}`;
            const box = {
                id,
                type: boxData.type,
                config: boxData.config,
                children: [],
            };
            set((state) => {
                state.appEditor.layoutItemList.push(box)
                return state;
            })
        } else {
            const id = `${boxData.type}_${new Date().getTime()}`;
            const box: any = {
                id,
                type: boxData.type,
                config: boxData.config,
                children: [],
            };
            if (boxData.component != null) {
                box.component = boxData.component;
            }
            set((state) => {
                const index = state.appEditor.layoutItemList.findIndex(d => d.id === parent)
                if (state.appEditor.layoutItemList[index].children == null) {
                    state.appEditor.layoutItemList[index].children = [];
                }
                if (state.appEditor.layoutItemList[index].children != null) {
                    state.appEditor.layoutItemList.push(box);
                    state.appEditor.layoutItemList[index].children.push(box.id);
                }
                state.appEditor.boxConfigFormAction = 'edit'
                state.appEditor.currentSelectedBoxId = box.id
                state.appEditor.currentSelectedBox = state.appEditor.layoutItemList.find(d => d.id === box.id)
                return state;
            })
        }
    },
    setLayoutItemList: (layoutItems: Array<LayoutItemInterface>) => {
        set((state) => {
            state.appEditor.layoutItemList = layoutItems;
            return state;
        })
    },
    setCurrentLayout: (layoutData: LayoutDataInterface) => {
        set((state) => {
            state.appEditor.currentLayout = layoutData;
            try {
                state.appEditor.layoutScript = layoutData.script;
            } catch (e) {
                state.appEditor.layoutScript = {};
                console.error('fail parse layoutScript');
            }
            return state;
        })
    },
    updateCurrentLayoutScript: (key: string, script: string) => {
        set((state) => {
            state.appEditor.layoutScript[key] = script
            return state;
        })
    }
});


export interface LayoutItemInterface {
    id: string;
    type: 'input' | 'decorator' | 'utility' | string;
    children: Array<string>;
    config?: any;
    component?: any;
}

export interface LayoutDataInterface {
    id: number;
    formId: number;
    iconBlobId: number;
    script: { [key: string]: string };
    approval: Array<any>;
    enableDraftMode: number;
    requireCheckMode: string;
    state: 'DRAFT' | 'ACTIVE' | string;
    layout: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    createdBy: number;
    updatedBy: number | null;
    deletedBy: number | null;
}


const findChildren = (layoutData: Array<LayoutItemInterface>, rootBox: LayoutItemInterface, targetId: string) => {
    console.log('layoutData', layoutData)
    console.log('layoutData', rootBox)
    console.log('layoutData', targetId)

    const findChild = (layoutItem: LayoutItemInterface): string | undefined => {
        console.log('boxData', layoutItem)
        let found = layoutItem.children.find(cid => cid === targetId);
        if (found == null) {
            for (const c of layoutItem.children) {
                const childBoxData = layoutData.find(ld => ld.id === c);
                if (childBoxData != null) {
                    found = findChild(childBoxData)
                }
                if (found != null) break;
            }
        }
        return found;
    }
    return findChild(rootBox);
}