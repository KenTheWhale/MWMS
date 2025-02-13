import { AUTH_TYPES } from "../actions/AuthAction";

const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
};


export const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case AUTH_TYPES.LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case AUTH_TYPES.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
                error: null
            };
        case AUTH_TYPES.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                error: action.payload
            };
        case AUTH_TYPES.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                error: null
            };
        default:
            return state;
    }
};