
export const isEmptyOrNull = (value) =>{
    if(value === "" || value === null || value === "null" || value === undefined || value === "undefined"){
        return true;
    }
    return false;
};

export const setUser = (user) =>{
    localStorage.setItem("user", user);
};

export const getUser = () =>{
    const user = localStorage.getItem("user");
    if(!isEmptyOrNull(user)){
        return JSON.parse(user);
    }
    return null;
};

export const setIsLogin = (value) =>{
    localStorage.setItem("is_login", value);
};

export const getIsLogin = () =>{
    const isLogin = localStorage.getItem("is_login");
    if(isLogin == "1"){
        return true;
    }
    return false;
};

export const setAccessToken = (access_token) =>{
    localStorage.setItem("access_token", access_token);
};

export const getToken = () =>{
    localStorage.getItem("access_token");
};

export const logout = () =>{
    setUser("");
    setIsLogin("0");
    setAccessToken("");
    window.location.href = "/login";
};