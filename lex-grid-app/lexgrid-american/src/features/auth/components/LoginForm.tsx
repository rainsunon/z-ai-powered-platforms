// src/features/auth/components/LoginForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
    onLogin: (email: string, password: string) => Promise<void>;
    isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onLogin(email, password);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-10">
                <h2 className="text-3xl font-black mb-2 text-slate-900">Login to your account</h2>
                <p className="text-slate-400 text-sm font-medium">Enter your credentials to access the legal platform.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        Work Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@firm.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <Label htmlFor="password" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Password
                        </Label>
                        <a className="text-[10px] text-primary font-black uppercase hover:underline tracking-widest" href="#">
                            Forgot password?
                        </a>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Signing in...' : 'Continue'}
                </Button>
            </form>
            <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 font-bold">
                    Don't have an account?{' '}
                    <a className="text-primary font-black uppercase tracking-widest hover:underline" href="#">
                        Contact Administrator
                    </a>
                </p>
            </div>
        </div>
    );
};
