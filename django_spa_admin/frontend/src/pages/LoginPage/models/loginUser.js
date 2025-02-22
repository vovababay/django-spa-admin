import {message} from "antd";
import {login} from "@/pages/LoginPage/api/login";

export const loginUser = async (values, setRedirectToAdmin) => {
    login(values)
        .then((data) => {
            setRedirectToAdmin(true);
            message.success('Добро пожаловать в административную панель');
    }).catch((error) => {
        message.error(error.response.data.error)
    })
    };