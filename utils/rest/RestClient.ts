import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosRequestHeaders,
} from "axios";
import ResponseStatus from "../../types/ResponseStatus";

async function get(
    host: string,
    path: string,
    auth: Record<string, string>,
    params: any = {}
): Promise<any> {
    const client = initializeAxiosClient(host, auth);

    let queryString = generateQueryString(params);
    if (queryString.length > 0) {
        path = path + "?" + queryString;
    }
    try {
        var response = await client.get(path);

        if (response.status == ResponseStatus.OK) {
            return response.data;
        } else {
            throw new Error(response.data);
        }
    } catch (error) {
        console.log(error);
    }
}

async function post(
    host: string,
    path: string,
    auth: Record<string, string>,
    body: any = {}
): Promise<any> {
    const client = initializeAxiosClient(host, auth);

    try {
        var response = await client.post(path, body);

        if (
            response.status == ResponseStatus.OK ||
            response.status == ResponseStatus.CREATED
        ) {
            return response.data;
        } else {
            throw new Error(response.data);
        }
    } catch (error) {
        console.log(error);
    }
}

async function put(
    host: string,
    path: string,
    auth: Record<string, string>,
    body: any = {}
): Promise<any> {
    const client = initializeAxiosClient(host, auth);

    try {
        var response = await client.put(path, body);

        if (
            response.status == ResponseStatus.OK ||
            response.status == ResponseStatus.NO_CONTENT
        ) {
            return response.data;
        } else {
            throw new Error(response.data);
        }
    } catch (error) {
        console.log(error);
    }
}

async function del(
    host: string,
    path: string,
    auth: Record<string, string>
): Promise<any> {
    const client = initializeAxiosClient(host, auth);

    try {
        var response = await client.delete(path);

        if (
            response.status == ResponseStatus.OK ||
            response.status == ResponseStatus.NO_CONTENT
        ) {
            return response.data;
        } else {
            throw new Error(response.data);
        }
    } catch (error) {
        console.log(error);
    }
}

async function patch(
    host: string,
    path: string,
    auth: Record<string, string>,
    body: any = {}
): Promise<any> {
    const client = initializeAxiosClient(host, auth);

    try {
        var response = await client.patch(path, body);

        if (
            response.status == ResponseStatus.OK ||
            response.status == ResponseStatus.NO_CONTENT
        ) {
            return response.data;
        } else {
            throw new Error(response.data);
        }
    } catch (error) {
        console.log(error);
    }
}

function initializeAxiosClient(
    host: string,
    auth: Record<string, string>
): AxiosInstance {
    var axiosDefaultOptions: AxiosRequestConfig = {
        baseURL: host,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };
    if (
        axiosDefaultOptions.headers != null &&
        axiosDefaultOptions.headers != undefined
    )
        axiosDefaultOptions.headers[auth.key] = auth.value;

    return axios.create(axiosDefaultOptions);
}

function generateQueryString(params: any): string {
    let queryString = "";
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            queryString += `${key}=${params[key]}&`;
        }
    }
    return queryString;
}

export { get, post, put, patch, del };
