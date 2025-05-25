import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewAnnouncementPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Announcement</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Announcement Information</CardTitle>
          <CardDescription>
            Enter the details of the new church announcement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Announcement Title</Label>
            <Input id="title" placeholder="Special Service Announcement" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" placeholder="Details of the announcement..." className="min-h-[150px]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="isPublished">Published Status</Label>
            <Select defaultValue="true">
              <SelectTrigger id="isPublished">
                <SelectValue placeholder="Is this announcement published?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/announcements">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button>Create Announcement</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
