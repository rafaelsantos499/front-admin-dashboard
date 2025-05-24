import { User } from "../User"

export interface ResponseLogin {
    accessToken : string
    refreshToken: string
    user: User
}