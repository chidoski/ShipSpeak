'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { PMRole } from '@/types/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const pmRoles: Array<{ value: PMRole; label: string; description: string }> = [
  { value: 'Product Owner', label: 'Product Owner', description: 'Backlog management & feature definition' },
  { value: 'PM', label: 'Product Manager', description: 'Cross-functional leadership & strategy' },
  { value: 'Senior PM', label: 'Senior Product Manager', description: 'Complex products & team mentorship' },
  { value: 'Group PM', label: 'Group Product Manager', description: 'Multiple products & alignment' },
  { value: 'Director', label: 'Director of Product', description: 'Portfolio leadership & strategy' },
  { value: 'VP Product', label: 'VP of Product', description: 'Executive strategy & company direction' },
  { value: 'CPO', label: 'Chief Product Officer', description: 'Board-level vision & leadership' }
];

export default function SignupPage() {
  const { signup, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as PMRole | ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      errors.role = 'Please select your current role';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const response = await signup({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role as PMRole
    });
    
    if (response.success) {
      // AuthProvider handles redirect to onboarding
    }
    // Error handling is managed by AuthProvider
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getMotivationalMessage = (role: PMRole | ''): string => {
    if (!role) return '';
    
    const isExecutive = ['Director', 'VP Product', 'CPO'].includes(role);
    
    if (isExecutive) {
      return 'Perfect! We\'ll focus on executive presence, board presentations, and strategic communication.';
    }
    
    if (role === 'Product Owner') {
      return 'Great choice! We\'ll help you master PM skills and communication for career advancement.';
    }
    
    return 'Excellent! We\'ll develop your leadership communication and strategic influence skills.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ShipSpeak</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Start Your Journey</h2>
          <p className="text-gray-600 mt-2">
            Join thousands of PMs mastering executive communication
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Display auth errors */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {validationErrors.name && (
                <p className="text-red-600 text-xs">{validationErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Work Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="your.email@company.com"
              />
              {validationErrors.email && (
                <p className="text-red-600 text-xs">{validationErrors.email}</p>
              )}
            </div>

            {/* Current Role */}
            <div className="space-y-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Current Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.role ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select your current role</option>
                {pmRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
              {validationErrors.role && (
                <p className="text-red-600 text-xs">{validationErrors.role}</p>
              )}
              {formData.role && (
                <p className="text-blue-600 text-xs mt-1">
                  {getMotivationalMessage(formData.role)}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Create a strong password"
              />
              {validationErrors.password && (
                <p className="text-red-600 text-xs">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {validationErrors.confirmPassword && (
                <p className="text-red-600 text-xs">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account & Start Onboarding'
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        {/* Value Proposition */}
        <div className="text-center">
          <div className="bg-white/50 backdrop-blur rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900">📊 Meeting Analysis</div>
                <div className="text-gray-600">AI insights from real meetings</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">🎯 Practice Modules</div>
                <div className="text-gray-600">Personalized skill building</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">📈 Career Growth</div>
                <div className="text-gray-600">PM → Director → VP progression</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}