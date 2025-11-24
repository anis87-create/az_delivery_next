'use client';
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../hooks';

const LoginForm = () => {

  const [form, setForm] = useState({
      email:'',
      password:'',
  });   

  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSubmit = (e:any) => {
    e.preventDefault();
    router.push('/');
  }
  const handleChange = (e:any) => {
    const {name, value} = e.target;
    setForm({
      ...form,
      [name]: value
    })
  }
  return (
    <div className="w-1/2 p-8 lg:p-12 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>

              <form className="space-y-6" onSubmit={onSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your email"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your password"
                    onChange={handleChange}
                  />
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
  )
}

export default LoginForm
