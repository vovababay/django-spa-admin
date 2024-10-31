// src/api.js
import axios from 'axios';
import { message } from 'antd';

// Создаем экземпляр axios с базовой настройкой
const api = axios.create({
    baseURL: '/django_spa/api', // Базовый URL для всех запросов
    withCredentials: true,      // Позволяет сохранять куки для сессий
});

// Получаем CSRF-токен из cookie
const getCsrfToken = () => {
    const name = 'csrftoken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
};

// Интерцептор для обработки запроса
api.interceptors.request.use((config) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken; // Добавляем CSRF-токен в заголовки
    }
    return config;
});

// Интерцептор для обработки ответа
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            message.error('Сессия истекла. Пожалуйста, войдите снова.');
            error.is403 = true;
            // Обработайте редирект или другие действия здесь
        }
        return Promise.reject(error);
    }
);

// Обертка для GET-запросов
export const getRequest = async (url, config = {}) => {
    try {
        const response = await api.get(url, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Обертка для POST-запросов
export const postRequest = async (url, data, config = {}) => {
    try {
        const response = await api.post(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
