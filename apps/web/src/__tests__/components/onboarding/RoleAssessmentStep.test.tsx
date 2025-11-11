import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoleAssessmentStep from '@/components/onboarding/RoleAssessmentStep';
import { RoleAssessment } from '@/types/auth';

describe('RoleAssessmentStep', () => {
  const mockOnComplete = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render role assessment form', () => {
    render(
      <RoleAssessmentStep onComplete={mockOnComplete} />
    );

    expect(screen.getByText('Career Assessment')).toBeInTheDocument();
    expect(screen.getByText('Tell us about your PM journey to personalize your development path')).toBeInTheDocument();
    expect(screen.getByText('Current Role')).toBeInTheDocument();
  });

  it('should display all PM role options', () => {
    render(
      <RoleAssessmentStep onComplete={mockOnComplete} />
    );

    expect(screen.getByText('Product Owner')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
    expect(screen.getByText('Senior Product Manager')).toBeInTheDocument();
    expect(screen.getByText('Group Product Manager')).toBeInTheDocument();
    expect(screen.getByText('Director of Product')).toBeInTheDocument();
    expect(screen.getByText('VP of Product')).toBeInTheDocument();
    expect(screen.getByText('Chief Product Officer')).toBeInTheDocument();
  });

  it('should show target role options after selecting current role', async () => {
    render(
      <RoleAssessmentStep onComplete={mockOnComplete} />
    );

    // Select current role
    const pmButton = screen.getByRole('button', { name: /Product Manager Cross-functional leadership and strategic execution/i });
    fireEvent.click(pmButton);

    await waitFor(() => {
      expect(screen.getByText('Target Role')).toBeInTheDocument();
    });
  });

  it('should show executive-specific timeline options for executive roles', async () => {
    render(
      <RoleAssessmentStep onComplete={mockOnComplete} />
    );

    // Select Director role
    const directorButton = screen.getByRole('button', { name: /Director of Product Portfolio leadership and organizational strategy/i });
    fireEvent.click(directorButton);

    // Fill in experience
    const experienceInput = screen.getByPlaceholderText('e.g., 18');
    const industryInput = screen.getByPlaceholderText('e.g., 5');
    fireEvent.change(experienceInput, { target: { value: '24' } });
    fireEvent.change(industryInput, { target: { value: '8' } });

    // Select target role
    await waitFor(() => {
      const targetRoleButton = screen.getByRole('button', { name: /Director of Product/i });
      fireEvent.click(targetRoleButton);
    });

    // Timeline should include executive options
    await waitFor(() => {
      expect(screen.getByText('Maintaining current level')).toBeInTheDocument();
    });
  });

  it('should show motivation options after timeline selection', async () => {
    render(
      <RoleAssessmentStep onComplete={mockOnComplete} />
    );

    // Fill form progressively
    const pmButton = screen.getByRole('button', { name: /Product Manager Cross-functional leadership and strategic execution/i });
    fireEvent.click(pmButton);

    const experienceInput = screen.getByPlaceholderText('e.g., 18');
    const industryInput = screen.getByPlaceholderText('e.g., 5');
    fireEvent.change(experienceInput, { target: { value: '12' } });
    fireEvent.change(industryInput, { target: { value: '3' } });

    await waitFor(() => {
      const targetRoleButton = screen.getByRole('button', { name: /Senior Product Manager/i });
      fireEvent.click(targetRoleButton);
    });

    await waitFor(() => {
      const timelineButton = screen.getByRole('button', { name: /1-2 years/i });
      fireEvent.click(timelineButton);
    });

    // Motivation options should appear
    await waitFor(() => {
      expect(screen.getByText('Primary Development Goals (select all that apply)')).toBeInTheDocument();
      expect(screen.getByText('Board presentation skills')).toBeInTheDocument();
      expect(screen.getByText('Executive presence')).toBeInTheDocument();
      expect(screen.getByText('Team leadership')).toBeInTheDocument();
      expect(screen.getByText('Strategic communication')).toBeInTheDocument();
    });
  });

  it('should allow multiple motivation selection', async () => {
    render(
      <RoleAssessmentStep onComplete={mockOnComplete} />
    );

    // Complete form to reach motivations
    const pmButton = screen.getByRole('button', { name: /Product Manager Cross-functional leadership and strategic execution/i });
    fireEvent.click(pmButton);

    const experienceInput = screen.getByPlaceholderText('e.g., 18');
    const industryInput = screen.getByPlaceholderText('e.g., 5');
    fireEvent.change(experienceInput, { target: { value: '12' } });
    fireEvent.change(industryInput, { target: { value: '3' } });

    await waitFor(() => {
      const targetRoleButton = screen.getByRole('button', { name: /Senior Product Manager/i });
      fireEvent.click(targetRoleButton);
    });

    await waitFor(() => {
      const timelineButton = screen.getByRole('button', { name: /1-2 years/i });
      fireEvent.click(timelineButton);
    });

    // Select multiple motivations
    await waitFor(async () => {
      const boardSkillsButton = screen.getByRole('button', { name: /Board presentation skills/i });
      const executivePresenceButton = screen.getByRole('button', { name: /Executive presence/i });
      
      fireEvent.click(boardSkillsButton);
      fireEvent.click(executivePresenceButton);
      
      // Both should be selected
      expect(boardSkillsButton).toHaveClass('border-orange-500');
      expect(executivePresenceButton).toHaveClass('border-orange-500');
    });
  });

  it('should enable continue button when all required fields are filled', async () => {
    render(
      <RoleAssessmentStep onComplete={mockOnComplete} />
    );

    // Initially disabled
    const continueButton = screen.getByRole('button', { name: /Continue to Industry Selection/i });
    expect(continueButton).toBeDisabled();

    // Fill all required fields
    const pmButton = screen.getByRole('button', { name: /Product Manager Cross-functional leadership and strategic execution/i });
    fireEvent.click(pmButton);

    const experienceInput = screen.getByPlaceholderText('e.g., 18');
    const industryInput = screen.getByPlaceholderText('e.g., 5');
    fireEvent.change(experienceInput, { target: { value: '12' } });
    fireEvent.change(industryInput, { target: { value: '3' } });

    await waitFor(() => {
      const targetRoleButton = screen.getByRole('button', { name: /Senior Product Manager/i });
      fireEvent.click(targetRoleButton);
    });

    await waitFor(() => {
      const timelineButton = screen.getByRole('button', { name: /1-2 years/i });
      fireEvent.click(timelineButton);
    });

    // Now button should be enabled
    await waitFor(() => {
      expect(continueButton).toBeEnabled();
    });
  });

  it('should call onComplete with correct assessment data', async () => {
    render(
      <RoleAssessmentStep onComplete={mockOnComplete} />
    );

    // Fill complete form
    const pmButton = screen.getByRole('button', { name: /Product Manager Cross-functional leadership and strategic execution/i });
    fireEvent.click(pmButton);

    const experienceInput = screen.getByPlaceholderText('e.g., 18');
    const industryInput = screen.getByPlaceholderText('e.g., 5');
    fireEvent.change(experienceInput, { target: { value: '18' } });
    fireEvent.change(industryInput, { target: { value: '4' } });

    await waitFor(() => {
      const targetRoleButton = screen.getByRole('button', { name: /Senior Product Manager/i });
      fireEvent.click(targetRoleButton);
    });

    await waitFor(() => {
      const timelineButton = screen.getByRole('button', { name: /1-2 years/i });
      fireEvent.click(timelineButton);
    });

    await waitFor(() => {
      const boardSkillsButton = screen.getByRole('button', { name: /Board presentation skills/i });
      fireEvent.click(boardSkillsButton);
    });

    await waitFor(() => {
      const continueButton = screen.getByRole('button', { name: /Continue to Industry Selection/i });
      fireEvent.click(continueButton);
    });

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith({
        currentRole: 'PM',
        experienceLevel: 18,
        industryExperience: 4,
        targetRole: 'Senior PM',
        timeline: '1-2 years',
        motivations: ['Board presentation skills']
      });
    });
  });

  it('should show back button when onBack is provided', () => {
    render(
      <RoleAssessmentStep onComplete={mockOnComplete} onBack={mockOnBack} />
    );

    const backButton = screen.getByRole('button', { name: /Back/i });
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('should pre-populate form with initial data', () => {
    const initialData: Partial<RoleAssessment> = {
      currentRole: 'Senior PM',
      experienceLevel: 24,
      industryExperience: 6,
      targetRole: 'Group PM',
      timeline: '1-2 years',
      motivations: ['Executive presence', 'Team leadership']
    };

    render(
      <RoleAssessmentStep 
        onComplete={mockOnComplete} 
        initialData={initialData}
      />
    );

    // Check that form is pre-populated
    expect(screen.getByDisplayValue('24')).toBeInTheDocument();
    expect(screen.getByDisplayValue('6')).toBeInTheDocument();
    
    // Check that selections are made
    const seniorPmButton = screen.getByRole('button', { name: /Senior Product Manager Complex product ownership and team mentorship/i });
    expect(seniorPmButton).toHaveClass('border-blue-500');
  });

  it('should validate experience inputs', async () => {
    render(
      <RoleAssessmentStep onComplete={mockOnComplete} />
    );

    // Select role first
    const pmButton = screen.getByRole('button', { name: /Product Manager Cross-functional leadership and strategic execution/i });
    fireEvent.click(pmButton);

    // Test invalid inputs
    const experienceInput = screen.getByPlaceholderText('e.g., 18');
    fireEvent.change(experienceInput, { target: { value: '-5' } });

    // Button should remain disabled with invalid input
    const continueButton = screen.getByRole('button', { name: /Continue to Industry Selection/i });
    expect(continueButton).toBeDisabled();
  });
});