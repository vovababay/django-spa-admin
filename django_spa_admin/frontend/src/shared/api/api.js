import axios from 'axios';
import { message } from 'antd';
import { handle403Error } from './authService';
import {baseURL} from "@/shared/config";

// Создаем экземпляр axios с базовой настройкой
const api = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Позволяет передавать куки для сессий
});

// Получаем CSRF-токен из cookie
const getCsrfToken = () => {
    const name = 'csrftoken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (const cookie of cookies) {
        const c = cookie.trim();
        if (c.startsWith(name)) {
            return c.substring(name.length);
        }
    }
    return '';
};

// Интерцептор для добавления CSRF-токена
api.interceptors.request.use((config) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            handle403Error();
        } else {
            const errorMessage = error.response?.data?.detail || 'Произошла ошибка';
            message.error(errorMessage);
        }
        return Promise.reject(error);
    }
);

/**
 * Универсальная функция для запросов
 * @param {string} method - HTTP метод (GET, POST, PATCH, DELETE, PUT)
 * @param {string} url - URL
 * @param {Object} data - Тело запроса (для POST, PATCH, PUT)
 * @param {Object} config - Дополнительные настройки
 * @returns {Promise<Object>} - Ответ от сервера
 */
export const request = async (method, url, data = null, config = {}) => {
    try {
        const response = await api.request({ method, url, data, ...config });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Отдельные обертки для каждого метода
export const GET = (url, config = {}) => request('get', url, null, config);
export const POST = (url, data, config = {}) => request('post', url, data, config);
export const PATCH = (url, data, config = {}) => request('patch', url, data, config);
export const PUT = (url, data, config = {}) => request('put', url, data, config);
export const DELETE = (url, config = {}) => request('delete', url, null, config);

export default api;