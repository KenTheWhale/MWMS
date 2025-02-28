import { jwtDecode } from "jwt-decode";
import {authClient} from "../config/api.jsx";

export const AUTH_TYPES = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT'
};


export const loginRequest = () => ({
    type: AUTH_TYPES.LOGIN_REQUEST
});

export const loginSuccess = (userData, role) => ({
    type: AUTH_TYPES.LOGIN_SUCCESS,
    payload: {userData, role}
});

export const loginFailure = (error) => ({
    type: AUTH_TYPES.LOGIN_FAILURE,
    payload: error
});

export const logout = () => ({
    type: AUTH_TYPES.LOGOUT
});

export const loginUser = (username, password) => async (dispatch) => {
    dispatch(loginRequest());
    try {
        const response = await authClient.post('/login', {
            username,
            password
        });
        
        localStorage.setItem('accessToken', response.data.token);
        const decode = jwtDecode(response.data.token);
        localStorage.setItem('role', decode.role);
        if (decode.type) {
            localStorage.setItem('type', decode.type);
        }
        localStorage.setItem('name', response.data.name)
        dispatch(loginSuccess(response.data, decode.role));
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
        dispatch(loginFailure(errorMessage));
        throw error;
    }
};