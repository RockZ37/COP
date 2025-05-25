import Link from "next/link";
import prisma from "@/lib/db";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { DonationsChart } from "@/components/dashboard/donations-chart";
import { MembershipChart } from "@/components/dashboard/membership-chart";

async function getDashboardStats() {
  try {
    const memberCount = await prisma.member.count();
    const eventCount = await prisma.event.count();
    const groupCount = await prisma.group.count();
    const donationSum = await prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
    });

    const recentMembers = await prisma.member.findMany({
      orderBy: {
        joinDate: 'desc',
      },
      take: 5,
    });

    const upcomingEvents = await prisma.event.findMany({
      where: {
        startTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 5,
    });

    // Get monthly attendance data for the past year
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const monthlyAttendance = await prisma.$queryRaw`
      SELECT
        strftime('%Y-%m', date) as month,
        COUNT(DISTINCT memberId) as count
      FROM Attendance
      WHERE date >= ${oneYearAgo.toISOString()}
      GROUP BY month
      ORDER BY month
    `;

    // Get monthly donations data for the past year
    const monthlyDonations = await prisma.$queryRaw`
      SELECT
        strftime('%Y-%m', date) as month,
        SUM(amount) as total,
        type
      FROM Donation
      WHERE date >= ${oneYearAgo.toISOString()}
      GROUP BY month, type
      ORDER BY month
    `;

    // Get monthly membership growth for the past year
    const monthlyMembership = await prisma.$queryRaw`
      SELECT
        strftime('%Y-%m', joinDate) as month,
        COUNT(*) as count
      FROM Member
      WHERE joinDate >= ${oneYearAgo.toISOString()}
      GROUP BY month
      ORDER BY month
    `;

    return {
      memberCount,
      eventCount,
      groupCount,
      donationSum: donationSum._sum.amount || 0,
      recentMembers,
      upcomingEvents,
      monthlyAttendance,
      monthlyDonations,
      monthlyMembership,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      memberCount: 0,
      eventCount: 0,
      groupCount: 0,
      donationSum: 0,
      recentMembers: [],
      upcomingEvents: [],
      monthlyAttendance: [],
      monthlyDonations: [],
      monthlyMembership: [],
    };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  // Prepare attendance chart data
  const attendanceLabels = (stats.monthlyAttendance as any[]).map(item => item.month);
  const attendanceData = (stats.monthlyAttendance as any[]).map(item => item.count);

  const attendanceChartData = {
    labels: attendanceLabels,
    datasets: [
      {
        label: 'Attendance',
        data: attendanceData,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Prepare donations chart data
  const donationMonths = Array.from(
    new Set((stats.monthlyDonations as any[]).map(item => item.month))
  ).sort();

  const donationTypes = Array.from(
    new Set((stats.monthlyDonations as any[]).map(item => item.type))
  );

  const donationDatasets = donationTypes.map((type, index) => {
    const typeData = donationMonths.map(month => {
      const entry = (stats.monthlyDonations as any[]).find(
        item => item.month === month && item.type === type
      );
      return entry ? parseFloat(entry.total) : 0;
    });

    const colors = [
      'rgba(59, 130, 246, 0.7)', // blue
      'rgba(16, 185, 129, 0.7)', // green
      'rgba(249, 115, 22, 0.7)', // orange
      'rgba(139, 92, 246, 0.7)', // purple
      'rgba(236, 72, 153, 0.7)', // pink
    ];

    return {
      label: type as string,
      data: typeData,
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length].replace('0.7', '1'),
      borderWidth: 1,
    };
  });

  const donationsChartData = {
    labels: donationMonths,
    datasets: donationDatasets
  };

  // Prepare membership chart data
  const membershipLabels = (stats.monthlyMembership as any[]).map(item => item.month);
  const membershipData = (stats.monthlyMembership as any[]).map(item => item.count);

  // Calculate cumulative growth
  const cumulativeMembershipData = [];
  let total = 0;
  for (const count of membershipData) {
    total += count;
    cumulativeMembershipData.push(total);
  }

  const membershipChartData = {
    labels: membershipLabels,
    datasets: [
      {
        label: 'New Members',
        data: membershipData,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Cumulative Growth',
        data: cumulativeMembershipData,
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 2,
        fill: true,
      }
    ]
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/members/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Add Member</Button>
          </Link>
          <Link href="/events/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Create Event</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.memberCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.eventCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.groupCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.donationSum.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AttendanceChart data={attendanceChartData} />
        <DonationsChart data={donationsChartData} />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <MembershipChart data={membershipChartData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
            <CardDescription>Newest members who have joined</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentMembers.length > 0 ? (
              <div className="space-y-4">
                {stats.recentMembers.map((member) => (
                  <div key={member.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No members yet.</p>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/members" className="text-primary hover:underline">
              View all members →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events scheduled in the near future</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingEvents.map((event) => (
                  <div key={event.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.location || 'Location TBD'}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.startTime).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No upcoming events.</p>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/events" className="text-primary hover:underline">
              View all events →
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
