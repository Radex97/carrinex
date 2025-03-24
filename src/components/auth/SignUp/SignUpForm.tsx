'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import PasswordInput from '@/components/shared/PasswordInput'

type SignUpFormSchema = {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type OnSignUpPayload = {
    values: SignUpFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
}

export type OnSignUp = (payload: OnSignUpPayload) => void

interface SignUpFormProps extends CommonProps {
    setMessage: (message: string) => void
    onSignUp?: OnSignUp
    disabled?: boolean
}

const validationSchema: ZodType<SignUpFormSchema> = z
    .object({
        email: z
            .string({ required_error: 'Bitte gib deine E-Mail-Adresse ein' })
            .email({ message: 'Bitte gib eine gültige E-Mail-Adresse ein' }),
        displayName: z
            .string({ required_error: 'Bitte gib deinen Namen ein' })
            .min(2, { message: 'Der Name muss mindestens 2 Zeichen lang sein' }),
        password: z
            .string({ required_error: 'Passwort erforderlich' })
            .min(6, { message: 'Das Passwort muss mindestens 6 Zeichen lang sein' }),
        confirmPassword: z
            .string({ required_error: 'Bitte bestätige dein Passwort' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwörter stimmen nicht überein',
        path: ['confirmPassword'],
    })

const SignUpForm = (props: SignUpFormProps) => {
    const { onSignUp, className, setMessage, disabled = false } = props

    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const handleSignUp = async (values: SignUpFormSchema) => {
        if (onSignUp) {
            onSignUp({ values, setSubmitting, setMessage })
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(handleSignUp)}>
                <FormItem
                    label="Name"
                    invalid={Boolean(errors.displayName)}
                    errorMessage={errors.displayName?.message}
                >
                    <Controller
                        name="displayName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Vollständiger Name"
                                autoComplete="name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="E-Mail"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder="E-Mail-Adresse"
                                autoComplete="email"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Passwort"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                placeholder="Passwort"
                                autoComplete="new-password"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Passwort bestätigen"
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message}
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                placeholder="Passwort bestätigen"
                                autoComplete="new-password"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                    disabled={disabled}
                >
                    {isSubmitting ? 'Konto wird erstellt...' : 'Registrieren'}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
