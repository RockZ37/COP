import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EditMemberPageProps {
  params: {
    id: string;
  };
}

async function getMember(id: string) {
  try {
    const member = await prisma.member.findUnique({
      where: { id },
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

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const member = await getMember(params.id);

  if (!member) {
    notFound();
  }

  // Format date for input field
  const formattedDob = member.dateOfBirth 
    ? new Date(member.dateOfBirth).toISOString().split('T')[0]
    : '';
  
  const formattedJoinDate = new Date(member.joinDate).toISOString().split('T')[0];

  return (
    <div>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Member: {member.name}</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
          <CardDescription>
            Update the details of this church member.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={member.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={member.email} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue={member.phone || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" defaultValue={formattedDob} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" defaultValue={member.address || ''} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input id="joinDate" type="date" defaultValue={formattedJoinDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue={member.role}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="pastor">Pastor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="isActive">Status</Label>
            <Select defaultValue={member.isActive ? "true" : "false"}>
              <SelectTrigger id="isActive">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/members/${member.id}`}>
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
