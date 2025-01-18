// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { postRequest } from '../../api';

const { Title } = Typography;

export const LoginPage = () => {
    const [redirectToAdmin, SetRedirectToAdmin] = useState(false);
    const onFinish = async (values) => {
        try {
            const data = await postRequest('/login/', {
                username: values.username,
                password: values.password,
            });
            SetRedirectToAdmin(true);
            message.success('Успешный вход!');
        } catch (error) {
            if (error.status == 400){
                message.error(error.response.data.error)
            }
        }
    };
    if (redirectToAdmin) {
        return <Navigate to={"/django_spa/admin/"} replace />;
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div style={{ width: 300, textAlign: 'center' }}>
                <Title level={3}>Войти в административную панель</Title>
                <Form
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Введите ваше имя пользователя!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Введите ваш пароль!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Запомнить меня</Checkbox>
                    </Form.Item>

                    <Form.Item style={{ marginTop: 16 }}>
                        <Button type="primary" htmlType="submit" block>
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

