// src/features/auth/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signIn } from '@/lib/auth';
import { setUser } from '../../../../store';
import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';
import { MfaForm } from '../components/MfaForm';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
    const [step, setStep] = useState<'login' | 'mfa'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const result = await signIn.email({
                email,
                password,
            });

            if (result.error) {
                toast.error(result.error.message || 'Login failed');
                return;
            }

            // Update Redux store with user
            dispatch(setUser(result.data?.user));

            // Check if MFA is required
            if (result.data?.requiresMfa) {
                setStep('mfa');
            } else {
                toast.success('Successfully logged in!');
                navigate('/dashboard');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (code: string) => {
        try {
            setIsLoading(true);
            // Implement MFA verification with Better Auth
            // This will depend on your MFA setup
            toast.success('Verification successful!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            {step === 'login' ? (
                <LoginForm onLogin={handleLogin} isLoading={isLoading} />
            ) : (
                <MfaForm
                    onVerify={handleVerify}
                    onBack={() => setStep('login')}
                    isLoading={isLoading}
                />
            )}
        </AuthLayout>
    );
};

export default LoginPage;
