export const login = (userId, userName) => {
    return {
        type: 'LOGGED_IN',
        userId: userId,
        userName: userName,
    };
}

export const logout = () => {
    return {
        type: 'LOGGED_OUT'
    };
}