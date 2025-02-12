import axios from "axios";

export const url = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
})

export const auth = axios.create({
    baseURL: 'http://localhost:8080/api/v1/auth',
})