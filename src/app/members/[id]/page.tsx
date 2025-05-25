import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MemberPageProps {
  params: {
    id: string;
  };
}

async function getMember(id: string) {
  try {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        attendances: {
          orderBy: {
            date: 'desc',
          },
          take: 10,
        },
        donations: {
          orderBy: {
            date: 'desc',
          },
          take: 10,
        },
        groups: {
          include: {
            group: true,
          },
        },
        events: {
          include: {
            event: true,
          },
          take: 10,
        },
      },
    });

    if (!member) {
      return null;
    }

    return member;
  } catch (error) {
    console.error("Error fetching member:", error);
    return null;
  }
}

export default async function MemberPage({ params }: MemberPageProps) {
  const member = await getMember(params.id);

  if (!member) {
    notFound();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{member.name}</h1>
        <div className="flex space-x-2">
          <Link href={`/members/${member.id}/edit`}>
            <Button variant="outline">Edit Profile</Button>
          </Link>
          <Link href={`/members/${member.id}/attendance/new`}>
            <Button>Record Attendance</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{member.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{member.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p>{member.address || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
              <p>{member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : "Not provided"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Member Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p>{new Date(member.joinDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p>{member.isActive ? "Active" : "Inactive"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="capitalize">{member.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Groups & Ministries</CardTitle>
            <CardDescription>Groups this member belongs to</CardDescription>
          </CardHeader>
          <CardContent>
            {member.groups.length > 0 ? (
              <ul className="space-y-2">
                {member.groups.map((membership) => (
                  <li key={membership.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{membership.group.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{membership.role}</p>
                    </div>
                    <Link href={`/groups/${membership.group.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Not a member of any groups yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Last 10 service attendances</CardDescription>
          </CardHeader>
          <CardContent>
            {member.attendances.length > 0 ? (
              <ul className="space-y-2">
                {member.attendances.map((attendance) => (
                  <li key={attendance.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{new Date(attendance.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground capitalize">{attendance.serviceType}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No attendance records yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Last 10 donations made</CardDescription>
          </CardHeader>
          <CardContent>
            {member.donations.length > 0 ? (
              <ul className="space-y-2">
                {member.donations.map((donation) => (
                  <li key={donation.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">${donation.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(donation.date).toLocaleDateString()} • {donation.type}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No donation records yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Participation</CardTitle>
            <CardDescription>Recent events attended</CardDescription>
          </CardHeader>
          <CardContent>
            {member.events.length > 0 ? (
              <ul className="space-y-2">
                {member.events.map((eventAttendee) => (
                  <li key={eventAttendee.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{eventAttendee.event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(eventAttendee.event.startTime).toLocaleDateString()} • {eventAttendee.status}
                      </p>
                    </div>
                    <Link href={`/events/${eventAttendee.event.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No event participation records yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
