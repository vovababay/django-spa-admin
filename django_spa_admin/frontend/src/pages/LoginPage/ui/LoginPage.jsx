import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {ROUTES} from "@/shared/config";
import {loginUser} from "@/pages/LoginPage/models/loginUser";

const { Title } = Typography;

export const LoginPage = () => {
    const [redirectToAdmin, setRedirectToAdmin] = useState(false);

    if (redirectToAdmin) {
        return <Navigate to={ROUTES.MAIN_PAGE} replace />;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div style={{ width: 300, textAlign: 'center' }}>
                <Title level={3}>Войти в административную панель</Title>
                <Form
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={(values) => loginUser(values, setRedirectToAdmin)}
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

