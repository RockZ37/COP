import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import NewMemberPage from './page';
import { createMember } from '@/lib/actions';

// Mock the necessary dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/lib/actions', () => ({
  createMember: jest.fn(),
}));

describe('NewMemberPage Component', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });

  test('renders the form correctly', () => {
    render(<NewMemberPage />);

    // Check if the title is rendered
    expect(screen.getByText('Add New Member')).toBeInTheDocument();

    // Check if form fields are rendered
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Join Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();

    // Check if buttons are rendered
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Add Member')).toBeInTheDocument();
  });

  test('handles form submission correctly on success', async () => {
    // Mock successful member creation
    (createMember as jest.Mock).mockResolvedValue({
      success: true,
      member: { id: '123', name: 'Test User', email: 'test@example.com' },
    });

    render(<NewMemberPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '123-456-7890' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Add Member'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Check if createMember was called
      expect(createMember).toHaveBeenCalled();
      
      // Check if success toast was shown
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'success',
          title: 'Success',
          description: 'Member created successfully!',
        })
      );
      
      // Check if router.push was called to redirect
      expect(mockPush).toHaveBeenCalledWith('/members');
    });
  });

  test('handles form submission correctly on error', async () => {
    // Mock failed member creation
    (createMember as jest.Mock).mockResolvedValue({
      error: 'Email already exists',
    });

    render(<NewMemberPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Add Member'));

    // Wait for the form submission to complete
    await waitFor(() => {
      // Check if createMember was called
      expect(createMember).toHaveBeenCalled();
      
      // Check if error toast was shown
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Error',
          description: 'Email already exists',
        })
      );
      
      // Check if router.push was not called
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
