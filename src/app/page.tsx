import Link from "next/link";
import prisma from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getRecentAnnouncements() {
  try {
    return await prisma.announcement.findMany({
      where: {
        isPublished: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
      orderBy: {
        startDate: 'desc',
      },
      take: 3,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

async function getUpcomingEvents() {
  try {
    return await prisma.event.findMany({
      where: {
        startTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 3,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export default async function Home() {
  const announcements = await getRecentAnnouncements();
  const events = await getUpcomingEvents();

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-muted rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Church Of Pentecoast Grace Assembly</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A simple and effective management system
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Members</h2>
          <p className="text-card-foreground mb-4">
            Manage church members, track attendance, and keep contact information up to date.
          </p>
          <Link
            href="/members"
            className="text-primary hover:underline"
          >
            View Members →
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Events</h2>
          <p className="text-card-foreground mb-4">
            Schedule services, meetings, and special events. Track attendance and manage event details.
          </p>
          <Link
            href="/events"
            className="text-primary hover:underline"
          >
            View Events →
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Groups</h2>
          <p className="text-card-foreground mb-4">
            Organize ministries, departments, and committees. Assign members to different groups.
          </p>
          <Link
            href="/groups"
            className="text-primary hover:underline"
          >
            View Groups →
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Recent Announcements</h2>
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{announcement.title}</CardTitle>
                  <CardDescription>
                    Posted: {new Date(announcement.startDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
            <div className="text-center mt-4">
              <Link href="/announcements" className="text-primary hover:underline">
                View All Announcements →
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-card p-6 rounded-lg shadow">
            <p className="text-muted-foreground italic">
              No announcements yet. Check back soon!
            </p>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    {new Date(event.startTime).toLocaleString()} • {event.location || 'Location TBD'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{event.description || 'No description available.'}</p>
                </CardContent>
              </Card>
            ))}
            <div className="text-center mt-4">
              <Link href="/events" className="text-primary hover:underline">
                View All Events →
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-card p-6 rounded-lg shadow">
            <p className="text-muted-foreground italic">
              No upcoming events. Check back soon!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
