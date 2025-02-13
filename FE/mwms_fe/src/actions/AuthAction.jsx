export const AUTH_TYPES = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT'
};

// accountActions.js
import axiosClient from '../assets/api.jsx';

export const loginRequest = () => ({
    type: AUTH_TYPES.LOGIN_REQUEST
});

export const loginSuccess = (userData) => ({
    type: AUTH_TYPES.LOGIN_SUCCESS,
    payload: userData
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
        const response = await axiosClient.post('/auth/login', {
            username,
            password
        });
        
        localStorage.setItem('accessToken', response.data.token);
        dispatch(loginSuccess(response.data));
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
        dispatch(loginFailure(errorMessage));
        throw error;
    }
};