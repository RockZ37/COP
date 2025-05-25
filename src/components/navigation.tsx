"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-primary text-primary-foreground py-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
        Church Of Pentecoast Grace Assembly
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          {/* Always visible links */}
          <Link href="/members" className="hover:underline">
            Members
          </Link>
          <Link href="/events" className="hover:underline">
            Events
          </Link>
          <Link href="/calendar" className="hover:underline">
            Calendar
          </Link>
          <Link href="/groups" className="hover:underline">
            Groups
          </Link>
          <Link href="/announcements" className="hover:underline">
            Announcements
          </Link>

          {/* Links visible to authenticated users */}
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/donations" className="hover:underline">
                Donations
              </Link>
              <Link href="/attendance" className="hover:underline">
                Attendance
              </Link>

              {/* Admin-only links */}
              {session?.user?.role === 'admin' && (
                <Link href="/notifications" className="hover:underline">
                  Notifications
                </Link>
              )}
            </>
          )}

          {/* Authentication buttons */}
          <div className="ml-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm hidden lg:inline">
                  {session?.user?.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-primary z-50 shadow-lg">
          <div className="container mx-auto py-4 flex flex-col space-y-3">
            <Link
              href="/"
              className="px-4 py-2 hover:bg-primary-foreground/10 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/members"
              className="px-4 py-2 hover:bg-primary-foreground/10 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Members
            </Link>

            <Link
              href="/events"
              className="px-4 py-2 hover:bg-primary-foreground/10 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>

            <Link
              href="/calendar"
              className="px-4 py-2 hover:bg-primary-foreground/10 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Calendar
            </Link>

            <Link
              href="/groups"
              className="px-4 py-2 hover:bg-primary-foreground/10 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Groups
            </Link>

            <Link
              href="/announcements"
              className="px-4 py-2 hover:bg-primary-foreground/10 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Announcements
            </Link>

            {/* Links visible to authenticated users */}
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 hover:bg-primary-foreground/10 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  href="/donations"
                  className="px-4 py-2 hover:bg-primary-foreground/10 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Donations
                </Link>

                <Link
                  href="/attendance"
                  className="px-4 py-2 hover:bg-primary-foreground/10 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Attendance
                </Link>

                {/* Admin-only links */}
                {session?.user?.role === 'admin' && (
                  <Link
                    href="/notifications"
                    className="px-4 py-2 hover:bg-primary-foreground/10 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Notifications
                  </Link>
                )}
              </>
            )}

            {/* Authentication buttons */}
            <div className="px-4 py-2">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <span className="text-sm">
                    Signed in as: {session?.user?.name}
                  </span>
                  <Button
                    variant="outline"
                    className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
