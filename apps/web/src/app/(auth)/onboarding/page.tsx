'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  const { user, refreshUser } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleOnboardingComplete = (updatedUser: any) => {
    refreshUser();
    // Navigation is handled by OnboardingWizard
  };

  return (
    <OnboardingWizard
      user={user}
      onComplete={handleOnboardingComplete}
    />
  );
}