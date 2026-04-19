import React from 'react';
import { Input } from '@/components/ui/input';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/useAuthStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, { message: "Please enter a valid date" })
    .refine((date) => {
      const parsedDate = new Date(date);
      return parsedDate <= new Date();
    }, { message: "Date of birth cannot be in the future" }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate('/login');
  };

  const handleSocialLogin = (provider: string) => {
    login(`${provider.toLowerCase()}@example.com`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 font-body text-on-surface selection:bg-primary/20 selection:text-on-primary-container relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-secondary-container/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-surface-container-lowest rounded-[2.5rem] shadow-2xl shadow-primary/5 overflow-hidden border border-surface-variant/50 relative z-10">
        
        {/* Left Side: Branding/Image */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-surface-container-low relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-surface-container/90 mix-blend-multiply"></div>
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center text-on-primary shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-[28px]">spa</span>
            </div>
            <span className="font-headline font-bold text-3xl text-on-primary tracking-tight">Luminous</span>
          </div>

          <div className="relative z-10 mt-20">
            <h1 className="font-headline font-bold text-5xl text-on-primary leading-tight mb-6">
              Your vitality,<br />illuminated.
            </h1>
            <p className="font-body text-lg text-surface-container-highest max-w-md leading-relaxed">
              Experience healthcare that adapts to you. Seamlessly connect with specialists, track your wellness, and manage your health journey in one serene space.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 mt-12">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-10 h-10 rounded-full border-2 border-primary-container" />
              <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-10 h-10 rounded-full border-2 border-primary-container" />
              <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-10 h-10 rounded-full border-2 border-primary-container" />
            </div>
            <p className="font-body text-sm text-surface-container-highest font-medium">Join 10,000+ members</p>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-headline font-bold text-3xl text-on-surface mb-3">Create account</h2>
              <p className="font-body text-outline">Enter your details to begin your journey.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="font-headline font-semibold text-sm text-on-surface-variant block">Full Name</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    person
                  </span>
                  <Input 
                    type="text" 
                    {...register('name')}
                    placeholder="Elena Vance" 
                    className="w-full bg-surface border border-outline-variant/50 rounded-2xl py-4 h-auto pl-12 pr-4 font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
                {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-headline font-semibold text-sm text-on-surface-variant block">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    mail
                  </span>
                  <Input 
                    type="email" 
                    {...register('email')}
                    placeholder="elena@example.com" 
                    className="w-full bg-surface border border-outline-variant/50 rounded-2xl py-4 h-auto pl-12 pr-4 font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
                {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-headline font-semibold text-sm text-on-surface-variant block">Date of Birth</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    calendar_today
                  </span>
                  <Input 
                    type="date" 
                    {...register('dateOfBirth')}
                    className="w-full bg-surface border border-outline-variant/50 rounded-2xl py-4 h-auto pl-12 pr-4 font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
                {errors.dateOfBirth && <p className="text-error text-xs mt-1">{errors.dateOfBirth.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-headline font-semibold text-sm text-on-surface-variant block">Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <Input 
                    type="password" 
                    {...register('password')}
                    placeholder="••••••••" 
                    className="w-full bg-surface border border-outline-variant/50 rounded-2xl py-4 h-auto pl-12 pr-12 font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined">visibility_off</span>
                  </button>
                </div>
                {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl primary-gradient text-on-primary font-headline font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>
                    Sign Up
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-container-lowest text-outline font-body">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-outline-variant/50 hover:bg-surface-container-low transition-colors font-body font-medium text-on-surface"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Google
              </button>
              <button 
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-outline-variant/50 hover:bg-surface-container-low transition-colors font-body font-medium text-on-surface"
              >
                <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="Apple" className="w-5 h-5" />
                Apple
              </button>
            </div>

            <p className="mt-10 text-center font-body text-sm text-outline">
              Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
