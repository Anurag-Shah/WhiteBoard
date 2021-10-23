import urls from "./urls";

export const loginApi = async (username, pwd) => {
    try {
        const response = await fetch(urls.login, {
            method: 'POST',
            headers: {
                token: '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: pwd,
            })
        });
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
};

export const resetPwdApi = async (email) => {
    try {
        const response = await fetch(urls.resetPwd, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: ''
            },
            body: JSON.stringify({
                email: email,
            })
        });
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
};