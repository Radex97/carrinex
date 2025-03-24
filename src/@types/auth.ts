import { DefaultSession } from 'next-auth'

export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    token: string
    user: {
        userId: string
        userName: string
        authority: string[]
        avatar: string
        email: string
    }
}

export type SignUpResponse = {
    status: string
    message: string
}

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    newPassword: string
    confirmPassword: string
    token: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type User = {
    id: string
    userName: string
    email: string
    avatar?: string
    role?: 'admin' | 'user'
    companyType?: 'versender' | 'subunternehmer'
    companyId?: string
    isOnboarded?: boolean
    authority?: string[]
}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            authority: string[]
        } & DefaultSession['user']
    }

    interface User {
        authority?: string[]
    }

    interface JWT {
        authority?: string[]
    }
}
