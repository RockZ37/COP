import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewGroupPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Group</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Group Information</CardTitle>
          <CardDescription>
            Enter the details of the new church group, ministry, or department.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input id="name" placeholder="Youth Ministry" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Details about the group..." />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Group Type</Label>
            <Select defaultValue="ministry">
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ministry">Ministry</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="committee">Committee</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/groups">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button>Create Group</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
