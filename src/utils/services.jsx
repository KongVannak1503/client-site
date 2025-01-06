import Swal from 'sweetalert2';
export const isEmptyOrNull = (value) => {
    if (value === "" || value === null || value === "null" || value === undefined || value === "undefined") {
        return true;
    }
    return false;
};

export const setUser = (user) => {
    localStorage.setItem("user", user);
};

export const getUser = () => {
    const user = localStorage.getItem("user");
    if (!isEmptyOrNull(user)) {
        return JSON.parse(user);
    }
    return null;
};

export const setIsLogin = (value) => {
    localStorage.setItem("is_login", value);
};

export const getIsLogin = () => {
    const isLogin = localStorage.getItem("is_login");
    if (isLogin == "1") {
        return true;
    }
    return false;
};

export const setAccessToken = (access_token) => {
    localStorage.setItem("access_token", access_token);
};

export const getToken = () => {
    localStorage.getItem("access_token");
};

export const logout = () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out of your session.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!',
    }).then((result) => {
        if (result.isConfirmed) {
            setUser("");
            setIsLogin("0");
            setAccessToken("");
            Swal.fire(
                'Logged Out!',
                'You have been successfully logged out.',
                'success'
            ).then(() => {
                window.location.href = "/login";
            });
        }
    });
};