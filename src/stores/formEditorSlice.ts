import {StateCreator} from "zustand";
import {StoreState} from "./rootStore";
import {FormActionEnum, FormActionType} from "../hype/classes/constant";
import {FormLayoutDataInterface, LayoutItemInterface} from "../hype/classes/layout.interface";


export interface FormEditorSlice {
    formData: any,
    currentSelectedBoxId: any;
    currentSelectedBox: any;
    currentSelectedField: any;
    currentMode: 'editor' | 'move-box' | string;
    layoutItemList: Array<LayoutItemInterface>;
    currentLayout: FormLayoutDataInterface | null;
    showBoxConfig: boolean;
    showFieldConfig: boolean;
    boxConfigFormAction: FormActionType;
    fieldConfigFormAction: FormActionType;
    closeBoxConfig: () => void;
    closeFieldConfig: () => void;
    layoutScript: { [key: string]: string }

    moveCurrentBoxTo(id: string, position: 'before' | 'after' | 'last' | string): void;

    selectBoxToMove(id: string | null): void;

    openBoxConfig(id: string, formAction?: 'new' | string): void;

    openFieldConfig(id: string, formAction?: 'new' | 'edit'): void;

    createBox(parent: 'root' | string, boxData: { type: string, config: any, component?: any }): void;

    updateBox(id: string, boxData: { config: any }): void;

    removeBox(id: string): void;

    setLayoutItemList(layoutItems: Array<any>): void;

    setCurrentLayout(layoutData: any): void;

    setFormData(newForm: any): void;

    changeEditorMode(mode: string): void;

    updateCurrentLayoutScript(key: string, script: string): void;
}


export const createFormEditorSlice: StateCreator<StoreState, [], [], FormEditorSlice> = (set, get) => ({
    formData: null,
    showBoxConfig: false,
    boxConfigFormAction: 'edit',
    currentSelectedBoxId: null,
    currentSelectedBox: null,

    showFieldConfig: false,
    fieldConfigFormAction: 'edit',
    currentSelectedField: null,

    layoutItemList: [],
    layoutScript: {},
    currentLayout: null,
    currentMode: 'editor',
    changeEditorMode: (mode) => {
        set(state => {
            state.formEditor.currentSelectedBox = null;
            state.formEditor.currentSelectedBoxId = null;
            state.formEditor.currentMode = mode;
            return state;
        })
    },
    setFormData: (newFormData: any) => {
        set(state => {
            state.formEditor.formData = newFormData;
            return state;
        })
    },
    moveCurrentBoxTo: (id, position) => {
        const target = id
        const formEditor = get().formEditor;
        const targetIndex = formEditor.layoutItemList.findIndex(d => d.id === target)
        set((state) => {
            // return state;
            const child = findChildren(formEditor.layoutItemList, formEditor.currentSelectedBox, target);
            if (child != null) {
                alert(' Cannot move to this box children. ');
                return state;
            }

            // remove selected box from latest children
            for (const boxIndex in formEditor.layoutItemList) {
                if (formEditor.layoutItemList[boxIndex].children.indexOf(formEditor.currentSelectedBoxId) > -1) {
                    state.formEditor.layoutItemList[boxIndex].children = state.formEditor.layoutItemList[boxIndex].children.filter(item => item !== formEditor.currentSelectedBoxId)
                }
            }
            if (position === 'first' || position === 'last') {
                // append source to new target Child
                state.formEditor.layoutItemList[targetIndex].children = [...state.formEditor.layoutItemList[targetIndex].children, formEditor.currentSelectedBoxId]
            } else {
                let filteredState = formEditor.layoutItemList.filter(item => item.id !== formEditor.currentSelectedBoxId)
                console.log(target)
                const renewTargetIndex = filteredState.findIndex(item => item.id === target)
                if (formEditor.currentSelectedBox.type === 'container') {
                    console.log(filteredState)
                    console.log(renewTargetIndex + position === 'before' ? 0 : 1)
                    console.log(filteredState.slice(renewTargetIndex + (position === 'before' ? 0 : 1)))

                    filteredState = [
                        ...filteredState.slice(0, renewTargetIndex + (position === 'before' ? 0 : 1)),
                        formEditor.currentSelectedBox,
                        ...filteredState.slice(renewTargetIndex + (position === 'before' ? 0 : 1))
                    ]
                    state.formEditor.layoutItemList = [...filteredState]

                } else {
                    let parentIndex: null | number = null;
                    for (const boxIndex in formEditor.layoutItemList) {
                        if (formEditor.layoutItemList[boxIndex].children.indexOf(target) > -1) {
                            parentIndex = parseInt(boxIndex);
                            break;
                        }
                    }
                    if (parentIndex != null) {
                        const targetIndexInChildren = state.formEditor.layoutItemList[parentIndex].children.indexOf(target);
                        console.log('position', position)
                        console.log('position', state.formEditor.layoutItemList[parentIndex].children.slice(0, targetIndexInChildren + (position === 'before' ? 0 : 1)))
                        console.log('position', state.formEditor.layoutItemList[parentIndex].children.slice(targetIndexInChildren + (position === 'before' ? 0 : 1)))
                        state.formEditor.layoutItemList[parentIndex] = {
                            ...state.formEditor.layoutItemList[parentIndex],
                            children: [
                                ...state.formEditor.layoutItemList[parentIndex].children.slice(0, targetIndexInChildren + (position === 'before' ? 0 : 1)),
                                state.formEditor.currentSelectedBoxId,
                                ...state.formEditor.layoutItemList[parentIndex].children.slice(targetIndexInChildren + (position === 'before' ? 0 : 1))
                            ]
                        }
                    }
                }
            }

            state.formEditor.currentSelectedBoxId = null
            state.formEditor.currentSelectedBox = null;
            return state;
        })
    },
    selectBoxToMove: (id) => {
        set((state) => {
            state.formEditor.currentSelectedBoxId = id;
            if (id != null) {
                state.formEditor.currentSelectedBox = state.formEditor.layoutItemList.find(d => d.id === id)
            }
            return state;
        })
    },
    openBoxConfig: (id, formAction: FormActionType) => {
        set((state) => {
            state.formEditor.showBoxConfig = true;
            state.formEditor.boxConfigFormAction = formAction ?? 'edit'
            state.formEditor.currentSelectedBoxId = id
            state.formEditor.currentSelectedBox = state.formEditor.layoutItemList.find(d => d.id === id)
            return state;
        })
    },
    openFieldConfig: (id, formAction) => {
        set((state) => {
            state.formEditor.showFieldConfig = true;
            state.formEditor.fieldConfigFormAction = formAction ?? 'edit'
            state.formEditor.currentSelectedField = state.formEditor.formData.fields.find((d: any) => d.id === id)
            return state;
        })
    },
    closeFieldConfig: () => {
        set((state) => {
            state.formEditor.showFieldConfig = false;
            return state;
        })
    },
    closeBoxConfig: () => {
        set((state) => {
            state.formEditor.showBoxConfig = false;
            return state;
        })
    },
    updateBox: (id, boxData) => {
        set((state) => {
            const index = state.formEditor.layoutItemList.findIndex(d => d.id === id)
            if (state.formEditor.layoutItemList[index].children != null) {
                state.formEditor.layoutItemList[index] = {
                    ...state.formEditor.layoutItemList[index],
                    ...boxData
                };
            }
            return state;
        })
    },
    removeBox: (id) => {
        set((state) => {
            const formEditor = state.formEditor;
           const removeRecursive = (rmId: string) => {
               const removeBox = state.formEditor.layoutItemList.find(item => item.id == rmId)
               if(removeBox != null){
                   for(const crmId of removeBox.children ){
                       removeRecursive(crmId);
                   }

                   // remove from other box children
                   for (const boxIndex in formEditor.layoutItemList) {
                       if (formEditor.layoutItemList[boxIndex].children.indexOf(formEditor.currentSelectedBoxId) > -1) {
                           state.formEditor.layoutItemList[boxIndex].children = state.formEditor.layoutItemList[boxIndex].children.filter(item => item !== formEditor.currentSelectedBoxId)
                       }
                   }

                   // remove from list
                   const removeIndex = state.formEditor.layoutItemList.findIndex(item => item.id == rmId)
                   if (removeIndex > -1) {
                       state.formEditor.layoutItemList.splice(removeIndex, 1);
                   }
               }
           }
            removeRecursive(id);
            state.formEditor.showBoxConfig = false;
            state.formEditor.currentSelectedBoxId = null
            state.formEditor.currentSelectedBox = null;
            return state;
        })
    },
    createBox: (parent, boxData) => {
        if (parent === 'root') {
            const id = `${boxData.type}_${new Date().getTime()}`;
            const box = {
                id,
                type: boxData.type,
                config: boxData.config,
                children: [],
            };
            set((state) => {
                state.formEditor.layoutItemList.push(box)
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
                const index = state.formEditor.layoutItemList.findIndex(d => d.id === parent)
                if (state.formEditor.layoutItemList[index].children == null) {
                    state.formEditor.layoutItemList[index].children = [];
                }
                if (state.formEditor.layoutItemList[index].children != null) {
                    state.formEditor.layoutItemList.push(box);
                    state.formEditor.layoutItemList[index].children.push(box.id);
                }
                state.formEditor.boxConfigFormAction = 'edit'
                state.formEditor.currentSelectedBoxId = box.id
                state.formEditor.currentSelectedBox = state.formEditor.layoutItemList.find(d => d.id === box.id)
                return state;
            })
        }
    },
    setLayoutItemList: (layoutItems) => {
        set((state) => {
            state.formEditor.layoutItemList = layoutItems;
            return state;
        })
    },
    setCurrentLayout: (layoutData: FormLayoutDataInterface) => {
        set((state) => {
            state.formEditor.currentLayout = layoutData;
            try {
                state.formEditor.layoutScript = layoutData.script;
            } catch (e) {
                state.formEditor.layoutScript = {};
                console.error('fail parse layoutScript');
            }
            return state;
        })
    },
    updateCurrentLayoutScript: (key: string, script: string) => {
        set((state) => {
            state.formEditor.layoutScript[key] = script
            return state;
        })
    }
});



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