import { User } from "../User"

export interface LoginDto {
    email: string
    password: string
}
export interface ResponseLogin {
    accessToken : string
    refreshToken: string
    user: User
}