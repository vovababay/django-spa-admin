import {POST} from "@/shared/api";
import {message} from "antd";
import {API_ROUTES} from "@/shared/config";

export const login = async (values, setRedirectToAdmin) => {
        try {
            const data = await POST(API_ROUTES.LOGIN, {
                username: values.username,
                password: values.password,
            });
            setRedirectToAdmin(true);

        } catch (error) {
            if (error.status == 400){
                message.error(error.response.data.error)
            }
        }
    };