import axios from "axios";
import {env} from "../env";
import {apiUrlLocalStorageKey} from "../stores/appSlice";
import {PermissionGrantType} from "../hype/classes/constant";

const savedUrl = localStorage.getItem(apiUrlLocalStorageKey)
const initApiURL = (): string => {
    const localAPIUrl = localStorage.getItem(apiUrlLocalStorageKey);
    if (localAPIUrl != null) {
        return localAPIUrl;
    }
    return import.meta.env.VITE_API_SCHEME + '://' + import.meta.env.VITE_API_URL

}
const axiosInstance = axios.create({
    baseURL: initApiURL(),
    timeout: 30000,
});

const loginEndpoint = '/login'
// Add a request interceptor
const getToken = () => {
    return localStorage.getItem('accessToken')
}
console.log(`axiosInstance init ${env.apiUrl ?? savedUrl ?? ''}`)
axiosInstance.interceptors.request.use(function (config) {
    config.headers = {
        Authorization: 'Bearer ' + getToken(),
        ...config.headers
    };
    return config;
}, function (error) {

    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status == 401 && !error.request.responseURL.includes(loginEndpoint)) {
        localStorage.clear();
        window.location.href = '/login'
    }
    return Promise.reject(error);
});

export const fetchFormList = async (deleted = false) => {
    const queryObject: { deleted?: string } = {}
    if (deleted) {
        queryObject['deleted'] = '1'
    }
    const querystring = new URLSearchParams(queryObject).toString();
    const response = await axiosInstance.get(`/forms?${querystring}`)
    if (response.status == 200) {
        return {
            data: response.data.data,
            total: response.data.total
        }
    } else {
        throw new Error('response not 200')
    }
}

export const createScript = async (data: any) => {
    const response = await axiosInstance.post('/scripts', data)
    if (response.status == 201) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const fetchScript = async (id: number | string) => {
    const response = await axiosInstance.get(`/scripts/${id}`, {})
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const applyScriptPermission = async (scriptId: number | undefined, permissionArray: Array<{
    id: number,
    val: boolean
}>) => {
    await axiosInstance.patch(`/scripts/${scriptId}/permissions`, {permissions: [...permissionArray]});
}


export const publishScript = async (id: number | string) => {
    await axiosInstance.post(`/scripts/${id}/publish`)
}
export const updateScript = async (id: number | string, data: any) => {
    await axiosInstance.patch(`/scripts/${id}`, data)
}

export const fetchScriptList = async (params: any = {}) => {
    const response = await axiosInstance.post('/scripts/datalist', params)
    return {
        data: response.data.data,
        total: response.data.total
    }

}


export const findForm = async (id: number | null, slug: string | null) => {
    const response = await axiosInstance.get(`/forms/find`, {
        params: {
            slug,
            id
        }
    })
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}


export const fetchForm = async (id: number | undefined, query: any) => {
    const response = await axiosInstance.get(`/forms/${id}`, {
        params: query
    })
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}
export const fetchFormBySlug = async (slug: string | undefined, query: any) => {
    const response = await axiosInstance.get(`/forms/slug/${slug}`, {
        params: query
    })
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}


export const deleteForm = async (formId: number) => {
    await axiosInstance.delete(`/forms/${formId}`)
}

export const saveFormLayout = async (id: number | undefined, layout: any) => {
    const response = await axiosInstance.patch(`/form-layouts/${id}`, layout)
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const publishFormLayout = async (id: number | undefined) => {
    const response = await axiosInstance.post(`/form-layouts/${id}/publish`)
    if (response.status == 201) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const createFormRecord = async (formId: number, data: any, recordState: 'DRAFT' | 'ACTIVE', recordType: 'DEV' | 'PROD') => {
    const response = await axiosInstance.post(`/forms/${formId}/records`, {
        data,
        recordType,
        recordState
    })
    if (response.status == 201) {
        return response.data;
    } else {
        throw new Error('response not 201')
    }
}

export const updateFormRecord = async (formId: number, recordId: number, data: any, recordState: 'DRAFT' | 'ACTIVE') => {
    const response = await axiosInstance.patch(`/forms/${formId}/records/${recordId}`, {
        data,
        recordState
    })
    if (response.status == 204) {
        return response.data;
    } else {
        throw new Error('response not 204')
    }
}


export const fetchFormRecord = async (id: number, recordId?: number | undefined) => {
    const response = await axiosInstance.get(`/forms/${id}/records/${recordId}`)
    if (response.status == 200) {
        return response.data
    } else {
        throw new Error('response not 200')
    }
}


export const fetchFormRecords = async (id: number | undefined, query: any) => {
    const response = await axiosInstance.get(`/forms/${id}/records`, {
        params: query
    })
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const createUser = async (data: any) => {
    const response = await axiosInstance.post(`/admin/users/`, data)
    if (response.status == 201) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}


export const createPermission = async (data: any) => {
    const response = await axiosInstance.post(`/admin/permissions/`, data)
    if (response.status == 201) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const deletePermission = async (id: number) => {
    await axiosInstance.delete(`/admin/permissions/${id}`)
}

export const createRole = async (data: any) => {
    const response = await axiosInstance.post(`/admin/roles/`, data)
    if (response.status == 201) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const deleteRole = async (id: number) => {
    await axiosInstance.delete(`/admin/roles/${id}`)
}

export const createApp = async (data: any) => {
    const response = await axiosInstance.post(`/applications/`, data)
    if (response.status == 201) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const fetchApp = async (id: number | undefined) => {
    const response = await axiosInstance.get(`/applications/${id}`,)
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}
export const fetchDraftApp = async (id: number | undefined) => {
    const response = await axiosInstance.get(`/applications/${id}/draft`,)
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}


export const saveAppLayout = async (id: number | undefined, layout: any) => {
    const response = await axiosInstance.patch(`/applications/${id}/layout`, layout)
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const publishAppLayout = async (id: number | undefined) => {
    const response = await axiosInstance.post(`/applications/${id}/publish`)
    if (response.status == 201) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const createForm = async (data: any) => {
    try {
        const response = await axiosInstance.post(`/forms/`, data)
        return response.data;
    }catch (e) {
        if(axios.isAxiosError(e) && e.response?.data?.message) {
            throw new Error(e.response.data.message);
        }
    }
}

export const updateForm = async (id: number | undefined, data: any) => {
    const response = await axiosInstance.patch(`/forms/${id}`, data)
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const updateFormScript = async (id: number | undefined, data: any) => {
    const response = await axiosInstance.patch(`/forms/${id}/scripts`, data)
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}


export const createFormField = async (formId: number, data: any) => {
    const response = await axiosInstance.post(`/forms/${formId}/fields`, data)
    if (response.status == 201) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}

export const updateFormField = async (formId: number, id: number, data: any) => {
    const response = await axiosInstance.patch(`/forms/${formId}/fields/${id}`, data)
    if (response.status == 200) {
        return response.data;
    } else {
        throw new Error('response not 200')
    }
}


export const deleteFormField = async (formId: number, id: number) => {
    await axiosInstance.delete(`/forms/${formId}/fields/${id}`)
}

export const addFormRelation = async (formId: number, data: {
    slug: string;
    targetFormId: number;
    connectFromField: string;
    connectToField: string;
}) => {
    await axiosInstance.post(`/forms/${formId}/add-relation`, data);
}

export const removeFormField = async (formId: number, id: number) => {
    await axiosInstance.delete(`/forms/${formId}/fields/${id}`);
}


export const applyRolePermission = async (roleId: number | undefined, permissionIds: Array<{
    id: number,
    val: boolean
}>) => {
    await axiosInstance.patch(`/admin/roles/${roleId}/assign-permissions`, {permissions: [...permissionIds]});
}

export const applyFormPermission = async (formId: number | undefined,
                                          permissionArray: Array<{
                                              id: number, val: boolean,
                                              grant: PermissionGrantType
                                          }>) => {
    await axiosInstance.patch(`/forms/${formId}/permissions`, {
        permissions: [...permissionArray]
    });
}

export const applyUserRoles = async (userId: number | undefined, roleIds: Array<{ id: number, val: boolean }>) => {
    await axiosInstance.patch(`/admin/users/${userId}/assign-roles`, {roles: [...roleIds]});
}

export const fetchProfile = async () => {
    return await axiosInstance.get(`/auth/me`)
}

export default axiosInstance;