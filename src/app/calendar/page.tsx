import Link from "next/link";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

async function getCalendarEvents() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const events = await prisma.event.findMany({
      where: {
        startTime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
    
    return events;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }
}

export default async function CalendarPage() {
  const events = await getCalendarEvents();
  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();
  
  // Group events by date
  const eventsByDate: Record<string, any[]> = {};
  events.forEach(event => {
    const dateKey = new Date(event.startTime).toISOString().split('T')[0];
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });
  
  // Generate calendar days for current month
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  
  const calendarDays = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({
      day: i,
      events: eventsByDate[dateKey] || [],
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Church Calendar</h1>
        <div className="flex space-x-2">
          <div className="space-y-2">
            <Label htmlFor="calendarMonth">Month</Label>
            <Select defaultValue={`${now.getMonth()}-${now.getFullYear()}`}>
              <SelectTrigger id="calendarMonth" className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={`${now.getMonth()}-${now.getFullYear()}`}>
                  {currentMonth} {currentYear}
                </SelectItem>
                {/* Add more months as needed */}
              </SelectContent>
            </Select>
          </div>
          <Link href="/events/new">
            <Button>Add Event</Button>
          </Link>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{currentMonth} {currentYear}</CardTitle>
          <CardDescription>Calendar view of all church events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {/* Calendar header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center font-medium">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((dayData, index) => (
              <div 
                key={index} 
                className={`min-h-[100px] p-2 border rounded-md ${dayData ? 'bg-card' : 'bg-muted/30'}`}
              >
                {dayData && (
                  <>
                    <div className="text-right font-medium">{dayData.day}</div>
                    <div className="mt-1 space-y-1">
                      {dayData.events.map((event: any) => (
                        <Link 
                          key={event.id} 
                          href={`/events/${event.id}`}
                          className="block p-1 text-xs bg-primary/10 text-primary rounded truncate hover:bg-primary/20"
                        >
                          {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.title}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Events scheduled for this month</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.startTime).toLocaleDateString()} • {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm">{event.location || 'Location TBD'}</p>
                  </div>
                  <Link href={`/events/${event.id}`}>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No events scheduled for this month.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
