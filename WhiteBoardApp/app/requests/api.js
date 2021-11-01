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
<<<<<<< HEAD
                // 'Authorization': token,
=======
                'Authorization': token,
>>>>>>> bb8501ab573384d707223a7b24203f2fee7bebaf
            },
            body: JSON.stringify({
                username: username,
                password: pwd,
            })
        });
        console.log(response);
        let data = await response.json();
        return data;
<<<<<<< HEAD
=======
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
>>>>>>> bb8501ab573384d707223a7b24203f2fee7bebaf
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

// No token needed to reset password since the user is not logged in
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

<<<<<<< HEAD
export const updateAccountApi = async (user, email) => {
    let token = await getToken();
    try {
        const response = await fetch(urls.updateAccount, {
            method: 'POST',
            headers: {
                token: '',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({
                uid: user.uid,
                username: username,
                email: email,
            })
        });
        console.log(response);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getAvatarApi = async (user, email) => {
    let token = await getToken();
    try {
        const response = await fetch(urls.avatar, {
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

export const setAvatarApi = async (formData) => {
    let token = await getToken();
    try {
        const response = await fetch(urls.avatar, {
            method: 'POST',
            headers: {
                token: '',
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': token,
            },
            redirect: 'follow',
            body: formData
        });
        console.log(response);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};


export const sendPictureApi = async (url, formData) => {
    let token = await getToken();
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': token,
            },
            redirect: 'follow'
        });
        return response;
    } catch (error) {
        console.log(error);
        console.log('Connection Error!');
        return undefined
    }
};

=======
>>>>>>> bb8501ab573384d707223a7b24203f2fee7bebaf

const isResponseOk = (response) => {
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        throw Error(response.statusText);
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> bb8501ab573384d707223a7b24203f2fee7bebaf
