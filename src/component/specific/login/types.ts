import type { ChangeEvent, FormEvent } from "react";

// inputs send their change event; the botanist checkbox sends its boolean in the same shape
export type FieldChange = (e: ChangeEvent<HTMLInputElement> | { target: { name: string; value: string | boolean } }) => void;

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    phone: string;
    password: string;
    password2: string;
    is_botanist: boolean;
}

interface AuthFormProps {
    onSubmit: (e: FormEvent) => void;
    onChange: FieldChange;
    isLoading: boolean;
    showPassword: boolean;
    onTogglePassword: () => void;
    error: string;
}

export interface LoginFormProps extends AuthFormProps {
    formData: LoginData;
}

export interface RegisterFormProps extends AuthFormProps {
    formData: RegisterData;
    fieldErrors: { password2?: string };
}

export interface FieldProps {
    name: string;
    label: string;
    value: string;
    onChange: FieldChange;
    autoComplete?: string;
    error?: string;
}
