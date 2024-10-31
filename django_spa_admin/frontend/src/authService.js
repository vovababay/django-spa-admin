// src/authService.js
import { message } from 'antd';

export const handle403Error = (navigate) => {
    message.error('Сессия истекла. Пожалуйста, войдите снова.');
    navigate('/django_spa/admin/login/', { replace: true });
};
