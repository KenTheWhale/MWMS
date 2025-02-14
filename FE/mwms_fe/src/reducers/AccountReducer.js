const initialState = {
    account:{
        username: "",
        password: ""
    }
}

export const accountReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'ADD_ACCOUNT':
            return {
                ...state,
                account: action.payload
            }
        case 'REMOVE_ACCOUNT':
            return {
                ...state,
                account: state.account.filter(account => account.username !== action.payload.username)
            }
        case 'UPDATE_ACCOUNT':
            return {
                ...state,
                account: {
                    ...state.account,
                    ...action.payload
                }
            }
        default:
            return state
    }
}
