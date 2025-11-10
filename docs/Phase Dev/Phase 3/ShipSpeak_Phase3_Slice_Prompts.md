# ShipSpeak Integration Slice Prompts - Phase 3
## Production Polish & Public Launch
**Version:** 1.0 | **Date:** November 4, 2025 | **Phase:** Phase 3 (Polish & Launch)
## Executive Summary
This document provides complete specifications for building ShipSpeak Phase 3—the final phase that transforms a production-ready platform into a publicly launched, revenue-generating product. Phase 3 focuses on monetization, user acquisition, and operational excellence.
**Development Approach:** Production hardening and business enablement
**Duration:** 2 weeks (10-12 hours across 4 slices)
**Outcome:** Publicly launched product with paying customers and sustainable operations
## Table of Contents
[Phase 3 Overview](#phase-3-overview)
[Week 1 - Monetization & Growth](#week-1---monetization--growth)
Slice 29: Payment Integration & Subscription Management (3-4h)
Slice 30: Enhanced Onboarding & Activation (2-3h)
[Week 2 - Operations & Launch](#week-2---operations--launch)
Slice 31: Analytics, Monitoring & Support Infrastructure (3-4h)
Slice 32: Public Launch Preparation & Marketing Integration (2-3h)
[Implementation Guidelines](#implementation-guidelines)
[Phase Completion Checklist](#phase-completion-checklist)
[Post-Launch Roadmap](#post-launch-roadmap)
## Phase 3 Overview
### Context: Where We Are
After Phase 2, ShipSpeak is fully functional with:
✅ Real authentication and database
✅ Meeting bots joining and analyzing meetings
✅ AI-powered coaching feedback
✅ Practice recording and transcription
✅ Progress tracking across sessions
✅ ~50 beta users providing feedback
### What Phase 3 Adds
Phase 3 transforms the platform from beta to business-ready:
💰 **Monetization:** Stripe payment processing with trial-to-paid conversion
🚀 **Growth:** Optimized onboarding that drives activation
📊 **Intelligence:** Analytics for product decisions and user success
🔧 **Operations:** Monitoring, alerting, and support infrastructure
🌐 **Marketing:** Public launch assets and user acquisition funnels
### Goals
**Primary Goal:** Enable public launch with sustainable revenue model
**Success Metrics:** 
100+ active users within 30 days
20%+ trial to paid conversion rate
<10% monthly churn
<5% error rate across all operations
60%+ 90-day retention
### What Gets Built
**Monetization Infrastructure:**
Stripe subscription management
Trial period handling (14-day free trial)
Multiple pricing tiers (Starter, Professional, Team)
Payment method management
Billing portal for customers
Invoice generation and email
**User Acquisition & Activation:**
Streamlined onboarding based on beta feedback
Email verification and welcome sequences
Activation triggers and milestone emails
Referral system foundation
Waitlist management (if soft launch)
**Operational Excellence:**
Comprehensive error tracking (Sentry)
Performance monitoring (Vercel Analytics)
User behavior analytics (PostHog or Mixpanel)
Support ticket system (Zendesk or Intercom)
Admin dashboard for user management
Automated health checks and alerting
**Launch Readiness:**
Marketing website integration
Public documentation and help center
Email notification templates
Privacy policy and terms of service
SEO optimization
Social proof and testimonials
### What's Not Built (Future Roadmap)
❌ Team accounts and multi-user workspaces
❌ Advanced analytics dashboard
❌ Mobile native apps
❌ Integrations with PM tools (Jira, Linear)
❌ Custom coaching programs
❌ Community features
## Week 1 - Monetization & Growth
### Slice 29: Payment Integration & Subscription Management
**Duration:** 3-4 hours | **Dependencies:** Phase 2 complete (Supabase auth working)
#### What to Deliver
Complete Stripe payment integration enabling trial-to-paid conversion with self-service subscription management.
#### Business Context
**Pricing Strategy:**
**Free Trial:** 14 days, all features unlocked
**Starter Plan:** $49/month - Individual PMs, unlimited meetings, practice sessions
**Professional Plan:** $99/month - Everything in Starter + priority support, advanced analytics
**Team Plan:** $299/month (up to 5 PMs) - Everything in Pro + team dashboard, admin controls
**Revenue Model:** Monthly recurring subscription with annual discount option (save 20%)
#### Key Components to Build
**Stripe Integration Setup:**
// lib/stripe/config.ts
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});
export const STRIPE_PLANS = {
  starter: {
    monthly: 'price_starter_monthly',
    annual: 'price_starter_annual',
  },
  professional: {
    monthly: 'price_pro_monthly',
    annual: 'price_pro_annual',
  },
  team: {
    monthly: 'price_team_monthly',
    annual: 'price_team_annual',
  },
} as const;
**Database Schema Extensions:**
-- Add to profiles table
ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'trial';
ALTER TABLE profiles ADD COLUMN subscription_tier TEXT DEFAULT 'starter';
ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN trial_ends_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN subscription_ends_at TIMESTAMPTZ;
-- Create subscriptions table for history
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL, -- active, canceled, past_due, trialing
  tier TEXT NOT NULL,
  billing_interval TEXT NOT NULL, -- monthly, annual
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create payment_events table for audit trail
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  amount INTEGER, -- in cents
  status TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_payment_events_user ON payment_events(user_id);
#### API Endpoints to Implement
**1. Checkout Session Creation**
// app/api/stripe/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/config';
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { tier, interval } = await request.json();
    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, name')
      .eq('id', user.id)
      .single();
    let customerId = profile.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.name,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PLANS[tier][interval],
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=canceled`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          tier,
          interval,
        },
        trial_period_days: 14, // Only for first subscription
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
**2. Stripe Webhook Handler**
// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  const supabase = createClient();
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        await handleSubscriptionCreated(supabase, subscription);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(supabase, subscription);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(supabase, invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(supabase, invoice);
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
async function handleSubscriptionCreated(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata.supabase_user_id;
  const tier = subscription.metadata.tier;
  const interval = subscription.metadata.interval;
  await supabase.from('profiles').update({
    subscription_status: subscription.status,
    subscription_tier: tier,
    stripe_subscription_id: subscription.id,
    subscription_ends_at: new Date(subscription.current_period_end * 1000),
  }).eq('id', userId);
  await supabase.from('subscriptions').insert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    status: subscription.status,
    tier,
    billing_interval: interval,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
  });
  // TODO: Send welcome email with subscription details
}
// Additional webhook handlers...
**3. Customer Portal Access**
// app/api/stripe/create-portal-session/route.ts
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();
  if (!profile.stripe_customer_id) {
    return NextResponse.json(
      { error: 'No subscription found' },
      { status: 404 }
    );
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });
  return NextResponse.json({ url: session.url });
}
#### UI Components to Build
**1. Pricing Page**
// app/pricing/page.tsx
export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600">
          14-day free trial • No credit card required • Cancel anytime
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Starter Plan */}
        <PricingCard
          name="Starter"
          price={49}
          interval="month"
          features={[
            'Unlimited meeting analysis',
            'Practice exercises with AI feedback',
            'Progress tracking',
            'Email support',
          ]}
          cta="Start Free Trial"
          tier="starter"
        />
        {/* Professional Plan - Most Popular */}
        <PricingCard
          name="Professional"
          price={99}
          interval="month"
          badge="Most Popular"
          features={[
            'Everything in Starter',
            'Priority support',
            'Advanced analytics',
            'Custom bot configurations',
            'Export transcripts & reports',
          ]}
          cta="Start Free Trial"
          tier="professional"
          highlighted
        />
        {/* Team Plan */}
        <PricingCard
          name="Team"
          price={299}
          interval="month"
          description="Up to 5 PMs"
          features={[
            'Everything in Professional',
            'Team dashboard',
            'Admin controls',
            'Shared learning library',
            'Team analytics',
            'Dedicated support',
          ]}
          cta="Start Free Trial"
          tier="team"
        />
      </div>
      <div className="mt-16 text-center">
        <p className="text-gray-600">
          All plans include 14-day free trial. Save 20% with annual billing.
        </p>
      </div>
    </div>
  );
}
**2. Subscription Management UI**
// app/settings/billing/page.tsx
export default function BillingSettings() {
  const { data: subscription, isLoading } = useSubscription();
  if (isLoading) return <LoadingState />;
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Billing & Subscription</h1>
      {/* Current Plan */}
      <Card className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">Current Plan</h3>
            <p className="text-gray-600">
              {subscription.tier} - Billed {subscription.interval}
            </p>
            {subscription.trial_ends_at && (
              <Badge variant="info" className="mt-2">
                Trial ends {formatDate(subscription.trial_ends_at)}
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${subscription.amount / 100}
            </div>
            <div className="text-sm text-gray-600">
              per {subscription.interval}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => openCustomerPortal()}>
            Manage Subscription
          </Button>
          {subscription.tier !== 'professional' && (
            <Button variant="outline" onClick={() => router.push('/pricing')}>
              Upgrade Plan
            </Button>
          )}
        </div>
      </Card>
      {/* Payment Method */}
      <Card className="mb-6">
        <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
        <div className="flex items-center gap-4">
          <CreditCardIcon className="w-8 h-8" />
          <div className="flex-1">
            <div className="font-medium">
              •••• •••• •••• {subscription.card_last4}
            </div>
            <div className="text-sm text-gray-600">
              Expires {subscription.card_exp_month}/{subscription.card_exp_year}
            </div>
          </div>
          <Button variant="outline" onClick={() => openCustomerPortal()}>
            Update
          </Button>
        </div>
      </Card>
      {/* Billing History */}
      <Card>
        <h3 className="font-semibold text-lg mb-4">Billing History</h3>
        <InvoiceList userId={user.id} />
      </Card>
    </div>
  );
}
**3. Trial Expiration Warning**
// components/billing/TrialWarning.tsx
export function TrialWarning({ trialEndsAt }: { trialEndsAt: Date }) {
  const daysRemaining = Math.ceil(
    (trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (daysRemaining > 7) return null;
  return (
    <Alert variant="warning" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Trial Ending Soon</AlertTitle>
      <AlertDescription>
        Your trial ends in {daysRemaining} days. 
        <Link href="/pricing" className="underline ml-1">
          Choose a plan to continue
        </Link>
      </AlertDescription>
    </Alert>
  );
}
#### Feature Gate Logic
// lib/feature-gates.ts
export function canAccessFeature(
  user: User,
  feature: 'advanced_analytics' | 'custom_bot' | 'team_dashboard'
): boolean {
  const tierFeatures = {
    starter: [],
    professional: ['advanced_analytics', 'custom_bot'],
    team: ['advanced_analytics', 'custom_bot', 'team_dashboard'],
  };
  // Check subscription status
  if (user.subscription_status === 'trial') {
    return true; // All features during trial
  }
  if (user.subscription_status !== 'active') {
    return false; // No access if subscription inactive
  }
  return tierFeatures[user.subscription_tier]?.includes(feature) ?? false;
}
// Usage in components
if (!canAccessFeature(user, 'advanced_analytics')) {
  return <UpgradePrompt feature="Advanced Analytics" />;
}
#### User Interactions & Flows
**New User Signup Flow:**
User signs up → Trial starts immediately (14 days)
Dashboard shows trial countdown
Full feature access during trial
Email reminders at: 7 days, 3 days, 1 day, trial end
If no payment added by trial end → Limited access modal
User adds payment → Full access restored
**Upgrade Flow:**
User clicks "Upgrade" from dashboard or settings
Redirect to pricing page
Select plan → Stripe checkout
After payment → Redirect to dashboard with success message
Email confirmation with invoice
**Cancellation Flow:**
User clicks "Manage Subscription" → Opens Stripe portal
User cancels subscription
Webhook updates status → Access continues until period end
Email confirmation of cancellation
Before period ends → Re-subscription prompt
After period ends → Limited access with upgrade prompts
#### What Users Validate
Is the pricing clear and compelling?
Do they understand the value of each tier?
Is the trial-to-paid transition smooth?
Can they easily manage their subscription?
Are upgrade prompts helpful or annoying?
Do feature gates make sense?
#### Acceptance Criteria
**Payment Processing:**
[ ] Stripe checkout creates subscription correctly
[ ] Trial period applies to first subscription
[ ] Payment method saved to customer
[ ] Successful payment redirects to dashboard
[ ] Failed payment shows error message
**Webhook Handling:**
[ ] Subscription created event updates database
[ ] Subscription updated event syncs changes
[ ] Subscription canceled event maintains access until period end
[ ] Payment succeeded event recorded
[ ] Payment failed event triggers recovery flow
**Subscription Management:**
[ ] Current plan displays correctly
[ ] Trial countdown shows accurate days remaining
[ ] Can upgrade from any plan
[ ] Customer portal opens correctly
[ ] Payment method updates sync to database
[ ] Billing history shows all invoices
**Feature Gating:**
[ ] Trial users have full access
[ ] Expired trial users see upgrade prompts
[ ] Active subscribers access tier-appropriate features
[ ] Past due subscriptions show limited access
[ ] Canceled subscriptions maintain access until period end
**User Experience:**
[ ] Pricing page loads quickly
[ ] Plan comparison is clear
[ ] Checkout process is smooth (< 1 minute)
[ ] Trial warnings appear at right times
[ ] Upgrade prompts are contextual
[ ] Cancellation is straightforward
**Testing:**
[ ] Test with Stripe test mode
[ ] Simulate successful payment
[ ] Simulate failed payment
[ ] Test subscription update
[ ] Test subscription cancellation
[ ] Verify webhook delivery and processing
[ ] Test trial expiration handling
### Slice 30: Enhanced Onboarding & Activation
**Duration:** 2-3 hours | **Dependencies:** Slice 29 (payment working), Phase 2 auth
#### What to Deliver
Optimized onboarding flow that drives user activation and trial-to-paid conversion based on beta user feedback.
#### Business Context
**Activation Definition:** User has completed first value action within 48 hours
Path A users: Bot has analyzed first meeting
Path B users: Completed 3 practice exercises
**Current Beta Findings (Hypothetical based on typical SaaS):**
60% of users complete onboarding
40% complete first value action
25% activate within 48 hours
**Goal:** Increase activation to 50%+ within 48 hours
#### Key Improvements from Beta Feedback
**Issue #1:** Two-path fork confusing - users unclear which to choose
**Solution:** Add clear comparison and recommendation logic
**Issue #2:** Bot setup too complex - calendar permissions unclear
**Solution:** Simplify with visual progress, add FAQ accordion
**Issue #3:** Users don't return after bot setup - no reminder
**Solution:** Email reminder when first meeting scheduled
**Issue #4:** Practice baseline exercises feel long (5 min)
**Solution:** Reduce to 2 exercises (3 min total)
**Issue #5:** No immediate value - waiting for first meeting/feedback
**Solution:** Show example analysis immediately after onboarding
#### Enhanced Onboarding Flow
**Step 1: Welcome & Value Prop (Revised)**
// app/onboarding/welcome/page.tsx
export default function WelcomePage() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to ShipSpeak! 👋
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        We help Product Managers develop executive communication skills 
        and product sense by analyzing your actual work.
      </p>
      {/* Value Props */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <ValueCard
          icon={<CalendarIcon />}
          title="Analyze Real Meetings"
          description="Get feedback on your actual board presentations, planning sessions, and stakeholder meetings"
        />
        <ValueCard
          icon={<MicrophoneIcon />}
          title="Practice & Improve"
          description="Build skills with targeted exercises and immediate AI feedback"
        />
        <ValueCard
          icon={<ChartIcon />}
          title="Track Progress"
          description="See measurable improvement toward your career goals"
        />
      </div>
      <Button size="lg" onClick={() => router.push('/onboarding/profile')}>
        Get Started
      </Button>
      <p className="mt-4 text-sm text-gray-500">
        Takes 2 minutes • 14-day free trial • No credit card required
      </p>
    </div>
  );
}
**Step 2: Profile Setup (Unchanged)**
Current role
Target role
Timeline
Company (optional)
**Step 3: Path Selection (Enhanced)**
// app/onboarding/path-selection/page.tsx
export default function PathSelection() {
  const [showComparison, setShowComparison] = useState(false);
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-3">
        Choose Your Starting Point
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Both options give you personalized coaching. You can add the other later.
      </p>
      {/* Quick Comparison Toggle */}
      <div className="text-center mb-8">
        <Button
          variant="ghost"
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide' : 'Show'} comparison
        </Button>
      </div>
      {showComparison && (
        <ComparisonTable className="mb-8" />
      )}
      {/* Two-Path Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Path A */}
        <PathCard
          icon={<CalendarIcon className="w-12 h-12" />}
          title="Analyze My Meetings"
          badge="Most Popular"
          timeToValue="First insights in 24 hours"
          description="Connect your calendar and we'll analyze your actual conversations to identify patterns and gaps."
          pros={[
            'More accurate to your real communication style',
            'Personalized to your actual work context',
            'See how you perform in high-stakes situations',
          ]}
          bestFor="PMs with upcoming board meetings or important presentations"
          cta="Set Up Meeting Analysis"
          onSelect={() => handlePathSelect('meetings')}
        />
        {/* Path B */}
        <PathCard
          icon={<MicrophoneIcon className="w-12 h-12" />}
          title="Start Practicing"
          timeToValue="Start learning in 2 minutes"
          description="Jump into practice exercises to establish your baseline and start building skills immediately."
          pros={[
            'Immediate feedback on your communication',
            'Build confidence before high-stakes meetings',
            'See baseline assessment in 3 minutes',
          ]}
          bestFor="PMs wanting to build skills before their next big meeting"
          cta="Start First Exercise"
          onSelect={() => handlePathSelect('practice')}
        />
      </div>
      {/* Help Decision */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-2">Not sure which to choose?</h4>
        <p className="text-gray-700 mb-4">
          {getRecommendation(userProfile)}
        </p>
        <button
          className="text-blue-600 underline"
          onClick={() => setShowQuiz(true)}
        >
          Take 30-second quiz
        </button>
      </div>
    </div>
  );
}
function getRecommendation(profile: UserProfile): string {
  if (profile.timeline === '6 months') {
    return "With your 6-month timeline, we recommend starting with Meeting Analysis to quickly identify your biggest gaps.";
  }
  if (profile.current_role === 'product_owner') {
    return "As a Product Owner advancing to PM, we recommend Practice First to build foundational skills.";
  }
  return "Most users find Meeting Analysis helpful because it's based on your real work.";
}
**Step 4A: Simplified Bot Setup (Path A)**
// app/onboarding/bot-setup/page.tsx
export default function BotSetupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  return (
    <div className="max-w-3xl mx-auto">
      <ProgressIndicator current={currentStep} total={3} />
      {currentStep === 1 && (
        <BotIdentityStep
          onNext={(identity) => {
            saveBotIdentity(identity);
            setCurrentStep(2);
          }}
        />
      )}
      {currentStep === 2 && (
        <CalendarConnectionStep
          onNext={(calendar) => {
            connectCalendar(calendar);
            setCurrentStep(3);
          }}
        />
      )}
      {currentStep === 3 && (
        <MeetingCriteriaStep
          onComplete={(criteria) => {
            saveMeetingCriteria(criteria);
            router.push('/onboarding/success');
          }}
        />
      )}
      {/* FAQ Accordion at bottom of each step */}
      <FAQAccordion
        items={getBotSetupFAQs(currentStep)}
        className="mt-12"
      />
    </div>
  );
}
// Simplified bot identity - removed custom names for v1
function BotIdentityStep({ onNext }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Choose Your Bot Identity
      </h2>
      <p className="text-gray-600 mb-8">
        How your bot appears to others in meetings. You can change this anytime.
      </p>
      <div className="space-y-4">
        {BOT_PRESETS.map((preset) => (
          <BotPresetCard
            key={preset.id}
            name={preset.name}
            description={preset.description}
            example={preset.example}
            recommended={preset.id === 'notetaker'}
            onSelect={() => onNext(preset)}
          />
        ))}
      </div>
    </div>
  );
}
const BOT_PRESETS = [
  {
    id: 'notetaker',
    name: 'Meeting Notetaker',
    description: 'Professional and neutral. Works in any meeting.',
    example: 'Appears as "Meeting Notetaker"',
  },
  {
    id: 'assistant',
    name: 'Executive Assistant',
    description: 'Suggests you have support. Good for board meetings.',
    example: 'Appears as "Executive Assistant"',
  },
  {
    id: 'recorder',
    name: 'Meeting Recorder',
    description: 'Direct and clear. Indicates recording purpose.',
    example: 'Appears as "Meeting Recorder"',
  },
];
**Step 4B: Streamlined Baseline Exercises (Path B)**
// app/onboarding/baseline/page.tsx
export default function BaselineExercises() {
  const [currentExercise, setCurrentExercise] = useState(1);
  const [responses, setResponses] = useState<Record<number, string>>({});
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Establish Your Baseline
        </h2>
        <p className="text-gray-600">
          Complete 2 quick exercises (3 minutes total). 
          We'll show where you are now and create your learning path.
        </p>
      </div>
      <ProgressIndicator current={currentExercise} total={2} />
      {currentExercise === 1 && (
        <BaselineExercise
          number={1}
          title="Product Prioritization"
          prompt="You have 3 features to build but capacity for only 1 this quarter. Explain your choice to your CEO in 60 seconds."
          timeLimit={60}
          onComplete={(response) => {
            setResponses({ ...responses, 1: response });
            setCurrentExercise(2);
          }}
        />
      )}
      {currentExercise === 2 && (
        <BaselineExercise
          number={2}
          title="Trade-off Communication"
          prompt="Engineering says your timeline is unrealistic. Explain your response in a planning meeting (60 seconds)."
          timeLimit={60}
          onComplete={(response) => {
            setResponses({ ...responses, 2: response });
            processBaseline(responses);
          }}
        />
      )}
    </div>
  );
}
**Step 5: Success & Next Steps (New)**
// app/onboarding/success/page.tsx
export default function OnboardingSuccess({ path }: { path: 'meetings' | 'practice' }) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-4">
        You're All Set! 🎉
      </h1>
      {path === 'meetings' ? (
        <>
          <p className="text-xl text-gray-600 mb-8">
            Your bot is ready to join meetings. Here's what happens next:
          </p>
          <div className="space-y-4 text-left mb-8">
            <Step
              number={1}
              title="We monitor your calendar"
              description="We check every 15 minutes for meetings matching your criteria"
            />
            <Step
              number={2}
              title="Bot joins automatically"
              description="5 minutes before meeting start, our bot joins silently"
            />
            <Step
              number={3}
              title="You get insights within 24 hours"
              description="After the meeting, we transcribe and analyze your communication"
            />
          </div>
          {/* Show example analysis */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">
              While you wait, see an example analysis:
            </h3>
            <Button onClick={() => router.push('/demo/meeting-analysis')}>
              View Example Board Meeting Analysis
            </Button>
          </div>
          <Button
            size="lg"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            We'll email you when your first meeting is analyzed
          </p>
        </>
      ) : (
        <>
          <p className="text-xl text-gray-600 mb-8">
            Your baseline is complete! Here's your starting point:
          </p>
          <BaselineResults results={baselineResults} />
          <div className="mt-8">
            <h3 className="font-semibold mb-4">
              Your personalized learning path is ready
            </h3>
            <Button
              size="lg"
              onClick={() => router.push('/learn')}
            >
              Start Learning
            </Button>
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Want even better personalization? 
              <button
                className="underline ml-1"
                onClick={() => router.push('/onboarding/bot-setup')}
              >
                Connect your calendar
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
#### Email Activation Sequences
**Welcome Email (Immediate)**
Subject: Welcome to ShipSpeak! 🚀
Hi [Name],
Welcome aboard! You're now part of a community of Product Managers developing 
their executive communication skills.
Your 14-day free trial gives you access to everything:
• Meeting analysis with AI-powered feedback
• Practice exercises with instant coaching
• Progress tracking toward your career goals
[Path A Users] Your bot is monitoring your calendar for meetings to analyze.
[Path B Users] Your baseline shows you're currently at [Score] - let's improve that!
What to do next:
→ [Path A] Check that your calendar permissions are working
→ [Path B] Complete your first learning module
→ Have questions? Reply to this email
Best,
The ShipSpeak Team
P.S. Check out this example analysis to see what you'll get: [Link]
**First Meeting Scheduled (Path A only)**
Subject: Your bot will join [Meeting Name] tomorrow
Hi [Name],
Great news! We found a meeting that matches your criteria:
📅 [Meeting Name]
🕐 [Date & Time]
👥 [Participants]
Our bot will join as "[Bot Identity]" and analyze your communication. 
You'll get feedback within a few hours after the meeting ends.
Need to adjust anything? Manage your bot settings here: [Link]
See you there!
ShipSpeak
**First Value Delivered (24h after first meeting/exercise)**
Subject: Your feedback is ready! 👀
Hi [Name],
Your [meeting/practice session] analysis is complete!
Here's what we found:
• Overall score: [X.X/10] (↑ [+0.5] from baseline)
• Strengths: [Top strength]
• Focus area: [Top improvement area]
We've also recommended 3 learning modules based on your gaps.
[View Full Feedback]
Great start! Your next goal: [Milestone]
Questions? We're here to help.
ShipSpeak
**Trial Milestone (Day 7)**
Subject: You're halfway through your trial!
Hi [Name],
You've been using ShipSpeak for a week. Here's your progress:
✓ [X] meetings analyzed
✓ [Y] practice sessions completed  
✓ [Z]% improvement in [top skill]
One week left in your trial. Make the most of it:
→ Analyze 2-3 more meetings
→ Complete the [Recommended Module]
→ Set up meeting criteria if you haven't
Keep going! You're on track to reach [Target Role] level.
[View Progress Dashboard]
ShipSpeak
**Trial Ending (Day 12)**
Subject: Trial ends in 2 days - choose your plan
Hi [Name],
Your free trial ends in 2 days. Here's what you've achieved:
📊 Overall score improved from [X] to [Y]
🎯 [Z]% closer to [Target Role] level
💡 [N] key insights from your meetings
To keep your progress going, choose a plan:
Starter ($49/mo) - Everything you've been using
Professional ($99/mo) - Priority support + advanced analytics  
Team ($299/mo) - Team features + admin controls
[Choose Your Plan]
Have questions about pricing? Reply and let's chat.
Don't let your momentum stop!
ShipSpeak
#### What Users Validate
Is the onboarding flow clear and motivating?
Do they understand which path to choose?
Does the bot setup feel simple or complicated?
Are baseline exercises quick enough?
Do they feel immediate value after onboarding?
Are email reminders helpful or annoying?
Does the trial-to-paid transition feel natural?
#### Acceptance Criteria
**Onboarding Flow:**
[ ] Welcome page explains value clearly
[ ] Profile setup saves correctly
[ ] Path comparison helps decision-making
[ ] Both paths complete successfully
[ ] Success page shows appropriate next steps
[ ] Example analysis provides immediate value
**Bot Setup (Path A):**
[ ] Bot identity selection works
[ ] Calendar OAuth completes smoothly
[ ] Meeting criteria saves correctly
[ ] FAQ accordion answers common questions
[ ] Progress indicator shows current step
[ ] Can go back to previous steps
**Baseline Exercises (Path B):**
[ ] Recording interface works on all browsers
[ ] Timer counts accurately
[ ] Both exercises complete in < 3 minutes
[ ] Baseline results display clearly
[ ] Personalized recommendations appear
**Email Sequences:**
[ ] Welcome email sends immediately
[ ] Meeting scheduled email sends (Path A)
[ ] First feedback email sends when ready
[ ] Trial milestone emails send on schedule
[ ] Trial ending email sends 2 days before
[ ] All emails have working links
[ ] Unsubscribe link works
**Analytics Tracking:**
[ ] Onboarding completion tracked
[ ] Path selection tracked
[ ] Time to first value tracked
[ ] Activation events tracked
[ ] Drop-off points identified
**Performance:**
[ ] Onboarding loads quickly (<2s per step)
[ ] No blocking operations
[ ] Optimistic UI updates
[ ] Error states handled gracefully
## Week 2 - Operations & Launch
### Slice 31: Analytics, Monitoring & Support Infrastructure
**Duration:** 3-4 hours | **Dependencies:** Phase 2 complete, Slice 29-30 deployed
#### What to Deliver
Comprehensive operational infrastructure for monitoring system health, understanding user behavior, and providing customer support.
#### Key Components
**1. Error Tracking (Sentry)**
**2. Performance Monitoring (Vercel Analytics)**  
**3. User Behavior Analytics (PostHog)**
**4. Support System (Intercom or Zendesk)**
**5. Admin Dashboard**
#### 1. Error Tracking with Sentry
**Installation & Configuration:**
npm install @sentry/nextjs --save
npx @sentry/wizard -i nextjs
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  // Don't send errors in development
  enabled: process.env.NODE_ENV === 'production',
  // Capture user context
  beforeSend(event, hint) {
    // Don't send if user has opted out
    if (localStorage.getItem('sentry_opt_out') === 'true') {
      return null;
    }
    return event;
  },
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/app\.shipspeak\.com/,
      ],
    }),
  ],
});
**Custom Error Boundaries:**
// components/ErrorBoundary.tsx
'use client';
import * as Sentry from '@sentry/nextjs';
import { Component, ReactNode } from 'react';
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: any) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                We've been notified and are looking into it.
              </p>
              <Button onClick={() => window.location.reload()}>
                Reload page
              </Button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
**Error Tracking for API Routes:**
// lib/api-error-handler.ts
import * as Sentry from '@sentry/nextjs';
export function withErrorTracking(handler: Function) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      // Capture exception with context
      Sentry.captureException(error, {
        tags: {
          handler: handler.name,
          method: req.method,
          url: req.url,
        },
        user: {
          id: req.headers.get('x-user-id') || undefined,
        },
      });
      // Return user-friendly error
      return new Response(
        JSON.stringify({
          error: 'An unexpected error occurred',
          requestId: generateRequestId(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}
#### 2. Performance Monitoring
**Vercel Analytics Setup:**
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
**Custom Performance Tracking:**
// lib/performance.ts
export function trackPerformance(metricName: string, value: number) {
  if (typeof window !== 'undefined' && window.performance) {
    window.performance.measure(metricName);
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: metricName,
        value: Math.round(value),
        event_category: 'Performance',
      });
    }
  }
}
// Usage
const startTime = performance.now();
// ... expensive operation
const endTime = performance.now();
trackPerformance('transcription_processing', endTime - startTime);
#### 3. User Behavior Analytics (PostHog)
**PostHog Setup:**
// lib/analytics/posthog.ts
import posthog from 'posthog-js';
export function initPostHog() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.opt_out_capturing();
      },
    });
  }
}
export function identifyUser(userId: string, properties?: Record<string, any>) {
  posthog.identify(userId, properties);
}
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  posthog.capture(eventName, properties);
}
**Key Events to Track:**
// lib/analytics/events.ts
export const ANALYTICS_EVENTS = {
  // Onboarding
  onboarding_started: 'Onboarding Started',
  onboarding_completed: 'Onboarding Completed',
  path_selected: 'Path Selected',
  bot_configured: 'Bot Configured',
  baseline_completed: 'Baseline Completed',
  // Meeting Analysis
  meeting_scheduled: 'Meeting Scheduled',
  bot_joined_meeting: 'Bot Joined Meeting',
  meeting_analyzed: 'Meeting Analyzed',
  feedback_viewed: 'Feedback Viewed',
  transcript_searched: 'Transcript Searched',
  // Learning
  module_started: 'Module Started',
  module_completed: 'Module Completed',
  exercise_started: 'Exercise Started',
  exercise_completed: 'Exercise Completed',
  practice_session_recorded: 'Practice Session Recorded',
  // Subscription
  pricing_page_viewed: 'Pricing Page Viewed',
  plan_selected: 'Plan Selected',
  checkout_started: 'Checkout Started',
  subscription_created: 'Subscription Created',
  trial_started: 'Trial Started',
  trial_converted: 'Trial Converted',
  subscription_canceled: 'Subscription Canceled',
  // Engagement
  daily_active_user: 'Daily Active User',
  feature_used: 'Feature Used',
  settings_changed: 'Settings Changed',
  support_contacted: 'Support Contacted',
} as const;
// Usage example
trackEvent(ANALYTICS_EVENTS.exercise_completed, {
  exercise_id: 'trade-off-communication-1',
  score: 8.5,
  attempt_number: 2,
  time_spent_seconds: 94,
});
**Funnel Analysis:**
// Track key conversion funnels
export function trackSignupFunnel(step: string, properties?: Record<string, any>) {
  posthog.capture('signup_funnel', {
    step,
    ...properties,
  });
}
// Steps:
// 1. signup_page_viewed
// 2. signup_form_submitted
// 3. email_verified
// 4. onboarding_started
// 5. onboarding_completed
// 6. first_value_action (meeting analyzed or exercise completed)
// 7. activated_user
#### 4. Support System Integration
**Intercom Setup:**
// lib/support/intercom.ts
export function initIntercom(user: User) {
  if (typeof window !== 'undefined') {
    window.Intercom('boot', {
      app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
      user_id: user.id,
      email: user.email,
      name: user.name,
      created_at: Math.floor(new Date(user.created_at).getTime() / 1000),
      // Custom attributes
      subscription_status: user.subscription_status,
      subscription_tier: user.subscription_tier,
      current_role: user.current_role,
      target_role: user.target_role,
      meetings_analyzed: user.meetings_analyzed_count,
      practices_completed: user.practices_completed_count,
    });
  }
}
export function showIntercom() {
  window.Intercom('show');
}
export function trackIntercomEvent(eventName: string, metadata?: Record<string, any>) {
  window.Intercom('trackEvent', eventName, metadata);
}
**Help Widget:**
// components/support/HelpWidget.tsx
'use client';
export function HelpWidget() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
            <HelpCircleIcon className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem onClick={() => router.push('/help')}>
            <BookOpenIcon className="mr-2 h-4 w-4" />
            Help Center
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => showIntercom()}>
            <MessageCircleIcon className="mr-2 h-4 w-4" />
            Chat with Support
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open('https://shipspeak.com/demo')}>
            <VideoIcon className="mr-2 h-4 w-4" />
            Watch Demo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => trackEvent('feedback_clicked')}>
            <StarIcon className="mr-2 h-4 w-4" />
            Send Feedback
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
#### 5. Admin Dashboard
**Protected Admin Route:**
// app/admin/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
export default async function AdminDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  if (!profile?.is_admin) {
    redirect('/dashboard');
  }
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={await getTotalUsers()}
          change="+12% from last week"
          trend="up"
        />
        <StatCard
          title="Active Subscriptions"
          value={await getActiveSubscriptions()}
          change="+8% from last week"
          trend="up"
        />
        <StatCard
          title="MRR"
          value={await getMRR()}
          change="+15% from last month"
          trend="up"
        />
        <StatCard
          title="Churn Rate"
          value={await getChurnRate()}
          change="-2% from last month"
          trend="down"
        />
      </div>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersTable />
        </TabsContent>
        <TabsContent value="subscriptions">
          <SubscriptionsTable />
        </TabsContent>
        <TabsContent value="errors">
          <ErrorsTable />
        </TabsContent>
        <TabsContent value="system">
          <SystemHealthDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
**System Health Monitoring:**
// components/admin/SystemHealthDashboard.tsx
export function SystemHealthDashboard() {
  const { data: health } = useSystemHealth();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ServiceStatus
              name="Database"
              status={health.database.status}
              latency={health.database.latency}
            />
            <ServiceStatus
              name="Authentication"
              status={health.auth.status}
              latency={health.auth.latency}
            />
            <ServiceStatus
              name="Recall.ai (Meeting Bots)"
              status={health.recall.status}
              activeJobs={health.recall.active_bots}
            />
            <ServiceStatus
              name="Deepgram (Transcription)"
              status={health.deepgram.status}
              queueLength={health.deepgram.queue_length}
            />
            <ServiceStatus
              name="OpenAI (Analysis)"
              status={health.openai.status}
              queueLength={health.openai.queue_length}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Error Rates (Last 24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorRateChart data={health.error_rates} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              title="Avg Response Time"
              value={`${health.performance.avg_response_time}ms`}
              target="< 500ms"
              status={health.performance.avg_response_time < 500 ? 'good' : 'warning'}
            />
            <MetricCard
              title="Database Queries"
              value={health.performance.db_queries_per_min}
              target="< 1000/min"
            />
            <MetricCard
              title="Transcript Queue"
              value={health.queues.transcription}
              target="< 10"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
#### Health Check Endpoints
// app/api/health/route.ts
export async function GET() {
  const checks = await Promise.all([
    checkDatabase(),
    checkAuth(),
    checkExternalServices(),
  ]);
  const allHealthy = checks.every(check => check.status === 'healthy');
  return NextResponse.json({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: checks.reduce((acc, check) => {
      acc[check.service] = {
        status: check.status,
        latency: check.latency,
        message: check.message,
      };
      return acc;
    }, {}),
  }, {
    status: allHealthy ? 200 : 503,
  });
}
async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const supabase = createClient();
    await supabase.from('profiles').select('id').limit(1).single();
    return {
      service: 'database',
      status: 'healthy',
      latency: Date.now() - start,
    };
  } catch (error) {
    return {
      service: 'database',
      status: 'unhealthy',
      latency: Date.now() - start,
      message: error.message,
    };
  }
}
#### Automated Alerting
// lib/monitoring/alerts.ts
export async function sendAlert(alert: Alert) {
  // Send to multiple channels
  await Promise.all([
    sendSlackAlert(alert),
    sendEmailAlert(alert),
    sendPagerDutyAlert(alert), // For critical issues
  ]);
}
export async function checkAndAlert() {
  const health = await getSystemHealth();
  // Alert on high error rate
  if (health.error_rates.last_hour > 50) {
    await sendAlert({
      severity: 'critical',
      title: 'High Error Rate Detected',
      description: `Error rate at ${health.error_rates.last_hour} errors/hour (threshold: 50)`,
      service: 'platform',
    });
  }
  // Alert on slow database
  if (health.database.latency > 1000) {
    await sendAlert({
      severity: 'warning',
      title: 'Database Latency High',
      description: `Database queries taking ${health.database.latency}ms (threshold: 1000ms)`,
      service: 'database',
    });
  }
  // Alert on large transcription queue
  if (health.queues.transcription > 20) {
    await sendAlert({
      severity: 'warning',
      title: 'Transcription Queue Backed Up',
      description: `${health.queues.transcription} transcriptions in queue (threshold: 20)`,
      service: 'deepgram',
    });
  }
}
#### What Users Experience
**When Things Go Wrong:**
Friendly error messages (not stack traces)
Option to retry failed operations
Automatic incident reports sent to team
Status page showing current issues
Support chat accessible from error screens
**When Things Go Right:**
Fast page loads (tracked)
Smooth interactions (monitored)
Help always available
Feedback encouraged
#### Acceptance Criteria
**Error Tracking:**
[ ] Sentry captures all unhandled errors
[ ] Error boundaries prevent white screens
[ ] API errors logged with context
[ ] User privacy respected (no sensitive data in errors)
[ ] Error rate alerts configured
**Performance Monitoring:**
[ ] Vercel Analytics installed
[ ] Speed Insights tracking Core Web Vitals
[ ] Custom performance metrics tracked
[ ] Slow queries identified
**Analytics:**
[ ] PostHog tracking key events
[ ] User identification working
[ ] Funnels configured for conversion tracking
[ ] Feature usage tracked
[ ] Cohort analysis possible
**Support:**
[ ] Intercom chat widget works
[ ] User context passed to Intercom
[ ] Help center accessible
[ ] Support requests tracked
[ ] Response time SLA defined
**Admin Dashboard:**
[ ] Only accessible to admins
[ ] Shows real-time system health
[ ] Users table with search/filter
[ ] Subscriptions table shows MRR
[ ] Error logs accessible
[ ] Can impersonate users (for support)
**Alerting:**
[ ] Health check endpoint responds correctly
[ ] Alerts sent for critical issues
[ ] Slack notifications working
[ ] On-call rotation defined
[ ] Runbook for common issues
### Slice 32: Public Launch Preparation & Marketing Integration
**Duration:** 2-3 hours | **Dependencies:** All previous slices complete
#### What to Deliver
Final production readiness: SEO optimization, marketing integration, launch assets, and documentation.
#### Launch Checklist Components
#### 1. SEO & Metadata
**Comprehensive Metadata:**
// app/layout.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: {
    template: '%s | ShipSpeak',
    default: 'ShipSpeak - AI-Powered PM Leadership Development',
  },
  description:
    'Develop executive communication skills and product sense by analyzing your actual meetings. AI-powered coaching for Product Managers.',
  keywords: [
    'product management',
    'PM coaching',
    'executive communication',
    'leadership development',
    'AI coaching',
    'meeting analysis',
  ],
  authors: [{ name: 'ShipSpeak' }],
  creator: 'ShipSpeak',
  publisher: 'ShipSpeak',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://app.shipspeak.com',
    siteName: 'ShipSpeak',
    title: 'ShipSpeak - AI-Powered PM Leadership Development',
    description:
      'Develop executive communication skills and product sense by analyzing your actual meetings.',
    images: [
      {
        url: 'https://app.shipspeak.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShipSpeak Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShipSpeak - AI-Powered PM Leadership Development',
    description:
      'Develop executive communication skills and product sense by analyzing your actual meetings.',
    images: ['https://app.shipspeak.com/twitter-image.png'],
    creator: '@shipspeak',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
**Dynamic Page Metadata:**
// app/pricing/page.tsx
export function generateMetadata(): Metadata {
  return {
    title: 'Pricing Plans',
    description:
      'Choose the perfect plan for your PM development journey. 14-day free trial, no credit card required.',
    openGraph: {
      title: 'ShipSpeak Pricing - Plans for Every PM',
      description: 'Starter $49/mo, Professional $99/mo, Team $299/mo',
      url: 'https://app.shipspeak.com/pricing',
    },
  };
}
**Structured Data (Schema.org):**
// components/seo/StructuredData.tsx
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ShipSpeak',
    url: 'https://shipspeak.com',
    logo: 'https://shipspeak.com/logo.png',
    description:
      'AI-powered Product Manager leadership development platform',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@shipspeak.com',
      contactType: 'Customer Support',
    },
    sameAs: [
      'https://twitter.com/shipspeak',
      'https://linkedin.com/company/shipspeak',
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
export function ProductSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'ShipSpeak PM Coaching Platform',
    description:
      'AI-powered meeting analysis and leadership development for Product Managers',
    brand: {
      '@type': 'Brand',
      name: 'ShipSpeak',
    },
    offers: [
      {
        '@type': 'Offer',
        price: '49.00',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '49.00',
          priceCurrency: 'USD',
          billingIncrement: 'P1M',
        },
        name: 'Starter Plan',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
#### 2. Legal & Compliance
**Privacy Policy Page:**
// app/privacy/page.tsx
export default function PrivacyPolicy() {
  return (
    <LegalPageLayout>
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <section>
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly (name, email, company),
          usage data (meetings analyzed, features used), and meeting data
          (transcripts, audio recordings).
        </p>
      </section>
      <section>
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>Provide and improve our services</li>
          <li>Generate AI-powered coaching feedback</li>
          <li>Send product updates and tips</li>
          <li>Ensure platform security</li>
        </ul>
      </section>
      <section>
        <h2>3. Data Security</h2>
        <p>
          We use industry-standard encryption (AES-256) for data at rest
          and TLS 1.3 for data in transit. Meeting recordings are encrypted
          and deleted after 90 days (configurable).
        </p>
      </section>
      <section>
        <h2>4. Your Rights</h2>
        <p>
          You have the right to access, correct, delete, or export your data.
          Contact privacy@shipspeak.com to exercise these rights.
        </p>
      </section>
      <section>
        <h2>5. Cookies</h2>
        <p>
          We use essential cookies for authentication and optional analytics
          cookies (PostHog, Google Analytics) that you can opt out of.
        </p>
      </section>
      {/* Additional sections... */}
    </LegalPageLayout>
  );
}
**Terms of Service Page:** (Similar structure)
**Cookie Consent Banner:**
// components/CookieConsent.tsx
'use client';
export function CookieConsent() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShown(true);
    }
  }, []);
  const acceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    // Enable analytics
    initPostHog();
    setShown(false);
  };
  const acceptEssential = () => {
    localStorage.setItem('cookie_consent', 'essential');
    setShown(false);
  };
  if (!shown) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          We use cookies to improve your experience. Essential cookies are
          required for the site to function. Analytics cookies help us
          improve the product.{' '}
          <Link href="/privacy" className="underline">
            Learn more
          </Link>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={acceptEssential}>
            Essential Only
          </Button>
          <Button size="sm" onClick={acceptAll}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
#### 3. Marketing Integration
**Landing Page Tracking:**
// Track traffic source and campaign
export function trackMarketingAttribution() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const attribution = {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    referrer: document.referrer,
    landing_page: window.location.pathname,
  };
  // Save to session storage
  sessionStorage.setItem('marketing_attribution', JSON.stringify(attribution));
  // Track in analytics
  trackEvent('page_view', attribution);
  // Save to database on signup
  return attribution;
}
**Email Capture Forms:**
// components/marketing/EmailSignupForm.tsx
export function EmailSignupForm({ source }: { source: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      // Save to email list (e.g., ConvertKit, Mailchimp)
      await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          attribution: getMarketingAttribution(),
        }),
      });
      setStatus('success');
      trackEvent('email_signup', { source });
    } catch (error) {
      setStatus('idle');
      toast.error('Something went wrong. Please try again.');
    }
  };
  if (status === 'success') {
    return (
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="font-medium">You're on the list!</p>
        <p className="text-sm text-gray-600">
          Check your email for early access details.
        </p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1"
      />
      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Joining...' : 'Get Early Access'}
      </Button>
    </form>
  );
}
**Referral System (Basic):**
// app/settings/referrals/page.tsx
export default function ReferralsPage() {
  const user = useUser();
  const referralCode = user.id.substring(0, 8); // Simple approach
  const referralUrl = `https://app.shipspeak.com/signup?ref=${referralCode}`;
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Refer Friends, Get Rewards</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={referralUrl} readOnly className="flex-1" />
            <Button onClick={() => copyToClipboard(referralUrl)}>
              Copy
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Share this link with PM friends. When they subscribe, you both get
            1 month free!
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <ReferralsList userId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
#### 4. Documentation & Help Center
**Public Help Center:**
// app/help/page.tsx
export default function HelpCenter() {
  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
        <SearchInput
          placeholder="Search for answers..."
          onSearch={handleSearch}
        />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <HelpCategory
          title="Getting Started"
          icon={<RocketIcon />}
          articles={[
            'How ShipSpeak works',
            'Setting up your bot',
            'Connecting your calendar',
            'Your first meeting analysis',
          ]}
        />
        <HelpCategory
          title="Features"
          icon={<FeaturesIcon />}
          articles={[
            'Meeting analysis explained',
            'Practice exercises',
            'Progress tracking',
            'Bot privacy settings',
          ]}
        />
        <HelpCategory
          title="Billing"
          icon={<CreditCardIcon />}
          articles={[
            'Pricing plans',
            'Manage subscription',
            'Cancel subscription',
            'Refund policy',
          ]}
        />
        <HelpCategory
          title="Troubleshooting"
          icon={<WrenchIcon />}
          articles={[
            'Bot not joining meetings',
            'Transcript accuracy issues',
            'Calendar sync problems',
            'Common error messages',
          ]}
        />
        <HelpCategory
          title="Privacy & Security"
          icon={<ShieldIcon />}
          articles={[
            'How we protect your data',
            'Meeting recording consent',
            'Delete your data',
            'GDPR compliance',
          ]}
        />
        <HelpCategory
          title="Product Updates"
          icon={<SparklesIcon />}
          articles={[
            'What\'s new',
            'Upcoming features',
            'Feature requests',
            'Release notes',
          ]}
        />
      </div>
      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-4">
          Still have questions?
        </p>
        <Button onClick={() => showIntercom()}>
          Chat with Support
        </Button>
      </div>
    </div>
  );
}
**Individual Help Article Template:**
// app/help/articles/[slug]/page.tsx
export default async function HelpArticle({ params }) {
  const article = await getHelpArticle(params.slug);
  return (
    <article className="max-w-3xl mx-auto py-12">
      <Link href="/help" className="text-blue-600 mb-4 inline-block">
        ← Back to Help Center
      </Link>
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <div className="flex gap-4 mb-8 text-sm text-gray-600">
        <span>Updated {formatDate(article.updated_at)}</span>
        <span>•</span>
        <span>{article.read_time} min read</span>
      </div>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      <div className="mt-12 border-t pt-8">
        <h3 className="font-semibold mb-4">Was this article helpful?</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => trackHelpful('yes')}>
            👍 Yes
          </Button>
          <Button variant="outline" onClick={() => trackHelpful('no')}>
            👎 No
          </Button>
        </div>
      </div>
    </article>
  );
}
#### 5. Launch Day Checklist
**Pre-Launch (T-7 days):**
[ ] All features tested end-to-end
[ ] Payment processing verified
[ ] Email sequences reviewed
[ ] Help center published
[ ] Privacy policy and TOS published
[ ] Marketing site updated
[ ] Beta users given heads up
[ ] Support team briefed
[ ] Monitoring dashboards configured
[ ] Backup and rollback plan ready
**Launch Day (T-0):**
[ ] Remove "beta" labels from UI
[ ] Enable public signups
[ ] Activate marketing campaigns
[ ] Post on Product Hunt (optional)
[ ] Share on social media
[ ] Send email to waitlist
[ ] Monitor error rates closely
[ ] Team on standby for support
**Post-Launch (T+1 day):**
[ ] Review signup metrics
[ ] Check error logs
[ ] Respond to user feedback
[ ] Adjust based on performance
[ ] Celebrate! 🎉
#### What Users Experience on Launch Day
**New Visitors:**
Clear value proposition on landing page
Social proof (testimonials, user count)
Easy signup process (< 2 minutes)
Immediate access to product
Helpful onboarding
**Existing Beta Users:**
Email announcing public launch
Thank you for beta participation
Invitation to refer friends
No disruption to service
Opportunity to upgrade plan
#### Acceptance Criteria
**SEO:**
[ ] All pages have proper metadata
[ ] OpenGraph tags configured
[ ] Twitter cards working
[ ] Structured data implemented
[ ] Sitemap generated and submitted
[ ] robots.txt configured
[ ] Google Search Console verified
**Legal:**
[ ] Privacy policy published
[ ] Terms of service published
[ ] Cookie consent banner works
[ ] GDPR compliance verified
[ ] Data deletion process documented
**Marketing:**
[ ] Attribution tracking works
[ ] Email signup forms functional
[ ] Referral system operational
[ ] Analytics tracking all key events
[ ] Conversion funnels defined
**Documentation:**
[ ] Help center accessible
[ ] At least 20 help articles published
[ ] Search functionality works
[ ] Video tutorials created
[ ] FAQ comprehensive
**Launch Readiness:**
[ ] All pre-launch tasks complete
[ ] Team trained on support
[ ] Monitoring in place
[ ] Incident response plan ready
[ ] Celebration planned! 🎉
## Implementation Guidelines
### Development Best Practices
**Code Quality:**
Follow TypeScript strict mode
Write meaningful variable names
Add comments for complex logic
Keep functions small and focused
Use consistent formatting (Prettier)
**Testing:**
Test payment flows thoroughly in Stripe test mode
Verify email delivery in development
Test error boundaries with deliberate errors
Check analytics events fire correctly
Validate admin dashboard permissions
**Performance:**
Lazy load non-critical components
Optimize images (use Next.js Image)
Minimize JavaScript bundle size
Cache expensive operations
Use database indexes
**Security:**
Never expose API keys to frontend
Validate all user inputs
Use row-level security in Supabase
Implement rate limiting
Sanitize user-generated content
### Phase 3 Completion Criteria
**Monetization:**
[ ] Users can subscribe successfully
[ ] Trial-to-paid conversion works
[ ] Billing portal accessible
[ ] Invoices generated correctly
[ ] Revenue tracking accurate
**Operations:**
[ ] Error tracking captures issues
[ ] Performance monitoring active
[ ] Analytics providing insights
[ ] Support system responsive
[ ] Admin dashboard useful
**Launch:**
[ ] SEO optimized
[ ] Legal compliance verified
[ ] Documentation complete
[ ] Marketing integrated
[ ] Team ready
**Metrics:**
[ ] 100+ users within 30 days
[ ] 20%+ trial conversion
[ ] <10% monthly churn
[ ] <5% error rate
[ ] >99% uptime
## Post-Launch Roadmap
### Month 1-2: Stabilize & Learn
Monitor key metrics daily
Respond to user feedback quickly
Fix bugs and performance issues
Iterate on onboarding based on data
Build user testimonials and case studies
### Month 3-4: Growth & Optimization
Launch referral program incentives
Optimize conversion funnels
Add most-requested features
Expand learning module library
Build integrations (Slack, etc.)
### Month 5-6: Scale & Expand
Team accounts and multi-user workspaces
Advanced analytics dashboard
Mobile app development
Partnerships with PM communities
Enterprise sales motion
### Long-term Vision
Community features (peer learning)
Custom coaching programs
API for third-party integrations
White-label for companies
Expand beyond PMs to other roles
## Success Metrics
### North Star Metric
**Active Engaged Users:** Users who analyze meetings OR complete practice exercises weekly
### Supporting Metrics
**Acquisition:** Signups per week, conversion rate, CAC
**Activation:** % completing onboarding, time to first value
**Revenue:** MRR, ARPU, LTV, trial-to-paid conversion
**Retention:** 30/60/90-day retention, churn rate
**Referral:** Referral rate, viral coefficient
### Goals (End of Month 1)
100+ total users
40 active engaged users
$2,000 MRR
25% trial-to-paid conversion
70% 30-day retention
## Conclusion
Phase 3 completes ShipSpeak's transformation from prototype to production platform. With robust monetization, comprehensive operations, and polish for public launch, the platform is ready to serve paying customers and grow sustainably.
The journey from concept to launch has followed a deliberate path:
**Phase 1:** Validated product concept with users
**Phase 2:** Built production infrastructure
**Phase 3:** Enabled business and prepared for scale
Now the real work begins: serving customers, gathering feedback, iterating rapidly, and building a product that genuinely helps Product Managers advance their careers.
Congratulations on shipping! 🚀
**Document Version:** 1.0
**Last Updated:** November 4, 2025
**Next Review:** After first month of public launch
