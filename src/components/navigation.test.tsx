import { render, screen, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { Navigation } from './navigation';

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders correctly when user is not authenticated', () => {
    // Mock unauthenticated session
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Navigation />);

    // Check if the logo is rendered
    expect(screen.getByText('Church Management System')).toBeInTheDocument();

    // Check if public links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Announcements')).toBeInTheDocument();

    // Check if Sign In button is rendered
    expect(screen.getByText('Sign In')).toBeInTheDocument();

    // Check if authenticated-only links are not rendered
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Donations')).not.toBeInTheDocument();
    expect(screen.queryByText('Attendance')).not.toBeInTheDocument();
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
  });

  test('renders correctly when user is authenticated', () => {
    // Mock authenticated session
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          role: 'member',
        },
        expires: '2023-01-01',
      },
      status: 'authenticated',
    });

    render(<Navigation />);

    // Check if authenticated-only links are rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Donations')).toBeInTheDocument();
    expect(screen.getByText('Attendance')).toBeInTheDocument();

    // Check if Sign Out button is rendered
    expect(screen.getByText('Sign Out')).toBeInTheDocument();

    // Check if admin-only links are not rendered for non-admin users
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
  });

  test('renders admin links when user is an admin', () => {
    // Mock authenticated admin session
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        },
        expires: '2023-01-01',
      },
      status: 'authenticated',
    });

    render(<Navigation />);

    // Check if admin-only links are rendered
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  test('mobile menu toggle works correctly', () => {
    // Mock unauthenticated session
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Navigation />);

    // Mobile menu should be hidden initially
    expect(screen.queryByText('Home', { selector: '.md\\:hidden a' })).not.toBeInTheDocument();

    // Find and click the mobile menu button
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);

    // Mobile menu should now be visible
    expect(screen.getByText('Home', { selector: '.md\\:hidden a' })).toBeInTheDocument();

    // Click a link in the mobile menu
    const homeLink = screen.getByText('Home', { selector: '.md\\:hidden a' });
    fireEvent.click(homeLink);

    // Mobile menu should be hidden again
    expect(screen.queryByText('Home', { selector: '.md\\:hidden a' })).not.toBeInTheDocument();
  });
});
