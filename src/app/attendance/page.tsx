import Link from "next/link";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getRecentAttendance() {
  try {
    const recentServices = await prisma.attendance.groupBy({
      by: ['date', 'serviceType'],
      _count: {
        memberId: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 10,
    });

    return recentServices;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }
}

export default async function AttendancePage() {
  const recentAttendance = await getRecentAttendance();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Attendance Tracking</h1>
        <div className="flex space-x-2">
          <Link href="/attendance/new">
            <Button>Record New Attendance</Button>
          </Link>
          <Link href="/attendance/report">
            <Button variant="outline">View Reports</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Services</CardTitle>
            <CardDescription>Attendance records for recent services</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAttendance.length > 0 ? (
              <div className="space-y-4">
                {recentAttendance.map((service, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <p className="font-medium capitalize">{service.serviceType} Service</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(service.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{service._count.memberId} Attendees</p>
                      <Link href={`/attendance/${service.date}/${service.serviceType}`}>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No attendance records found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common attendance tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/attendance/new" className="block">
              <Button className="w-full justify-start" variant="outline">
                Record Sunday Service
              </Button>
            </Link>
            <Link href="/attendance/new" className="block">
              <Button className="w-full justify-start" variant="outline">
                Record Midweek Service
              </Button>
            </Link>
            <Link href="/attendance/report" className="block">
              <Button className="w-full justify-start" variant="outline">
                Monthly Attendance Report
              </Button>
            </Link>
            <Link href="/attendance/trends" className="block">
              <Button className="w-full justify-start" variant="outline">
                View Attendance Trends
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>Summary of attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-muted rounded-md text-center">
              <p className="text-sm font-medium text-muted-foreground">This Week</p>
              <p className="text-3xl font-bold">-</p>
              <p className="text-sm text-muted-foreground">Average Attendees</p>
            </div>
            <div className="p-4 bg-muted rounded-md text-center">
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold">-</p>
              <p className="text-sm text-muted-foreground">Average Attendees</p>
            </div>
            <div className="p-4 bg-muted rounded-md text-center">
              <p className="text-sm font-medium text-muted-foreground">Year to Date</p>
              <p className="text-3xl font-bold">-</p>
              <p className="text-sm text-muted-foreground">Average Attendees</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
