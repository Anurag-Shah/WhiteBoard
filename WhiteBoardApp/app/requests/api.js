import urls from "./urls";
import storage from "../config/storage";
import { get } from "react-native/Libraries/Utilities/PixelRatio";


export const getToken = async () => {
    try {
        let data = await storage.load({
            key: 'login-session',
            // autoSync (default: true) means if data is not found or has expired,
            // then invoke the corresponding sync method
            autoSync: true,
            syncInBackground: true,
        });
        let token = "Token " + data.token;
        return token;
    } catch (error) {
        console.log(error);
        return '';
    }
};

export const loginApi = async (username, pwd) => {
    let token = getToken();
    try {
        const response = await fetch(urls.login, {
            method: 'POST',
            headers: {
                token: '',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({
                username: username,
                password: pwd,
            })
        });
        console.log(response);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const logoutApi = async () => {
    let token = await getToken();
    try {
        const response = await fetch(urls.logout, {
            method: 'GET',
            headers: {
                token: '',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });
        console.log(response);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const resetPwdApi = async (email) => {
    let token = await getToken();
    try {
        const response = await fetch(urls.resetPwd, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json/',
                // 'Authorization': token,
            },
            body: JSON.stringify({
                email: email,
            })
        });
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
};


const isResponseOk = (response) => {
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        throw Error(response.statusText);
    }
}
