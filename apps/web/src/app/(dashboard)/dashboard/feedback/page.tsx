'use client';

import React from 'react';
import { FeedbackOrchestrator } from '@/components/feedback-display/FeedbackOrchestrator';

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analysis</h1>
          <p className="text-gray-600 mt-1">
            Detailed analysis and insights from your practice sessions
          </p>
        </div>
      </div>
      
      <FeedbackOrchestrator 
        sessionId="latest"
        onActionSelected={(actionId) => {
          console.log('Selected action:', actionId);
          // TODO: Navigate to practice module or coaching session
        }}
      />
    </div>
  );
}