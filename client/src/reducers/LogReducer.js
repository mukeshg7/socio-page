const iniState = {
    isLoggedIn: false,
    userId: "",
    userName: "",
}

const logReducer = (state = iniState, action) => {
    switch(action.type) {
        
        case 'LOGGED_OUT': {
            return {
                ...state,
                isLoggedIn: false,
                userId: "",
                userName: "",
            }
        }
        case 'LOGGED_IN': {
            return {
                ...state,
                isLoggedIn: true,
                userId: action.userId,
                userName: action.userName,
            }
        }
        default: {
            return state
        }
    }
}

export default logReducer;