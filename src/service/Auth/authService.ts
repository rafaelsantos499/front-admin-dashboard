
import { apiPublic, apiPrivate } from '../api';
import { LoginDto } from '../../types/dto/LoginDTO'
import { ResponseLogin } from '../../types/response/login';
import { User } from '../../types/User';

export const login = async (payload: LoginDto) : Promise<ResponseLogin> => {
    const { data } = await apiPublic.post<ResponseLogin>('auth/login', payload);
    return data;
}

export const me = async () : Promise<User> => {
    const { data } = await apiPrivate.get<User>('auth/me');
    return data;
}

export const signout = async () : Promise<{message: string}> => {
    const { data } = await apiPrivate.post<{message: string}>('auth/signout');
    return data;
}

