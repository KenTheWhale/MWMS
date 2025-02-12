export const addAccount = (account) => {
    return{
        type: 'ADD_ACCOUNT',
        payload: account
    }
}

export const updateAccount = (account) => {
    return{
        type: 'UPDATE_ACCOUNT',
        payload: account
    }
}

export const deleteAccount = (account) => {
    return{
        type: 'DELETE_ACCOUNT',
        payload: account
    }
}