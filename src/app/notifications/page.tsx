import Link from "next/link";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

async function getNotificationData() {
  try {
    // Get upcoming events
    const upcomingEvents = await prisma.event.findMany({
      where: {
        startTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 10,
    });
    
    // Get recent members
    const recentMembers = await prisma.member.findMany({
      orderBy: {
        joinDate: 'desc',
      },
      take: 10,
    });
    
    // Get groups
    const groups = await prisma.group.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return {
      upcomingEvents,
      recentMembers,
      groups,
    };
  } catch (error) {
    console.error("Error fetching notification data:", error);
    return {
      upcomingEvents: [],
      recentMembers: [],
      groups: [],
    };
  }
}

export default async function NotificationsPage() {
  const { upcomingEvents, recentMembers, groups } = await getNotificationData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Email Notifications</h1>
        <div className="flex space-x-2">
          <Link href="/notifications/history">
            <Button variant="outline">View History</Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="event" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="event">Event Reminders</TabsTrigger>
          <TabsTrigger value="welcome">Welcome Emails</TabsTrigger>
          <TabsTrigger value="group">Group Announcements</TabsTrigger>
          <TabsTrigger value="custom">Custom Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="event" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Event Reminders</CardTitle>
              <CardDescription>
                Send reminder emails to members who have registered for upcoming events.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventSelect">Select Event</Label>
                <Select>
                  <SelectTrigger id="eventSelect">
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map(event => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title} - {new Date(event.startTime).toLocaleDateString()}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No upcoming events</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminderMessage">Additional Message (Optional)</Label>
                <Textarea 
                  id="reminderMessage" 
                  placeholder="Add any additional information for the reminder email..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Send Reminders</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="welcome" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Welcome Emails</CardTitle>
              <CardDescription>
                Send welcome emails to new church members.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memberSelect">Select Member</Label>
                <Select>
                  <SelectTrigger id="memberSelect">
                    <SelectValue placeholder="Choose a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {recentMembers.length > 0 ? (
                      recentMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {new Date(member.joinDate).toLocaleDateString()}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No members found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Send Welcome Email</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="group" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Group Announcements</CardTitle>
              <CardDescription>
                Send announcements to all members of a specific group or ministry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupSelect">Select Group</Label>
                <Select>
                  <SelectTrigger id="groupSelect">
                    <SelectValue placeholder="Choose a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.length > 0 ? (
                      groups.map(group => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No groups found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="announcementSubject">Subject</Label>
                <input 
                  id="announcementSubject" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter announcement subject"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="announcementMessage">Announcement Message</Label>
                <Textarea 
                  id="announcementMessage" 
                  placeholder="Enter the announcement message to send to all group members..."
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Send Announcement</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Custom Email</CardTitle>
              <CardDescription>
                Send a custom email to selected church members.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipientType">Recipients</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="recipientType">
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="active">Active Members Only</SelectItem>
                    <SelectItem value="leaders">Leaders & Staff</SelectItem>
                    <SelectItem value="custom">Custom Selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailSubject">Subject</Label>
                <input 
                  id="emailSubject" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter email subject"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailContent">Email Content</Label>
                <Textarea 
                  id="emailContent" 
                  placeholder="Compose your email message..."
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Send Email</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
