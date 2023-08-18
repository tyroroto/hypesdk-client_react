import axiosInstance from "./axios";

const sortRootNode = (layoutData: Array<any>) => {
    const rootList = [];
    for (const ld of layoutData) {
        let foundInChild = false;
        for (const nld of layoutData) {
            if (nld.children.find((c: string) => c == ld.id) != null) {
                foundInChild = true;
                break;
            }
        }
        if (!foundInChild) {
            rootList.push(ld.id);
        }
    }
    return rootList
}

export const getAppDataActive = async (slug: string): Promise<any> => {
    const response = await axiosInstance.get(`/application/${slug}`)
    const result = {...response.data};
    // console.log(result)
    const currentLayout = response.data.layouts[0];
    const layoutData = JSON.parse(currentLayout.layout);
    result.layoutDataList = JSON.parse(currentLayout.layout)
    result.layoutRoot = [...sortRootNode(layoutData)]
    result.scripts = currentLayout.scripts;
    console.log('result', result)
    return result
}