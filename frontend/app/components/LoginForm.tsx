import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useAppDispatch, useAppSelector, RootState } from '../hooks/hooks';
import {login} from '../store/slices/authSlice';
import type { LoginCredentials } from '@/app/types';
import { z } from 'zod';

const LoginFormSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Minimum 8 characters').regex(
    /^(?=(?:.*\d){6,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
    'Password must have 6 digits, one lowercase, one uppercase, and one special character'
  ),
});

const handleGoogle = () => window.location.href = `http://localhost:5000/api/auth/google`;
const handleFacebook = () => window.location.href = `http://localhost:5000/api/auth/facebook`;

type FieldErrors = Partial<Record<keyof LoginCredentials, string>>;

const LoginForm: React.FC = () => {
  const [form, setForm] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { message, isError } = useAppSelector((state: RootState) => state.auth);

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const result = LoginFormSchema.safeParse(form);
    if (!result.success) {
      const errors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginCredentials;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    dispatch(login(form));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <div className="w-1/2 p-8 lg:p-12 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          {isError && <div className="bg-red-100 p-2 font-weight mb-4">{message}</div>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.email ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Enter your email"
              onChange={handleChange}
              value={form.email}
            />
            {fieldErrors.email && <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`w-full px-4 py-3 pr-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.password ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Enter your password"
                onChange={handleChange}
                value={form.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {fieldErrors.password && <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="text-orange-500 hover:text-orange-600">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 shrink-0">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleGoogle()}
            >
              <FaGoogle className="w-4 h-4 text-red-500" />
              Google
            </button>
            <button
              type="button"
              onClick={() => handleFacebook()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166fe5] transition-colors cursor-pointer"
            >
              <FaFacebook className="w-4 h-4" />
              Facebook
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-orange-500 hover:text-orange-600 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;