
import { apiPublic, apiPrivate } from './api';
import { LoginDto } from '../types/dto/LoginDTO'
import { ResponseLogin } from '../types/response/login';

export const login = async (payload: LoginDto) : Promise<ResponseLogin> => {
    const { data } = await apiPublic.post('auth/login', payload);
    return data as ResponseLogin;
}

export const me = async () : Promise<any> => {
    const { data } = await apiPrivate.get('auth/me');
    return data;
}

