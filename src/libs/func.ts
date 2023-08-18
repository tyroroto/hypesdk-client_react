import axiosInstance from "./axios";
import {env} from "../env";

export const execSQLScript = async (slug: Array<string> | string, params: any) => {
    const response = await axiosInstance.post(`${env.apiUrl}/script/exec-sql-script`, {slug, params})
    // console.log('data', response);
    return response.data;
};