"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { recordAttendance } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  name: string;
  email: string;
  isSelected?: boolean;
}

export default function NewAttendancePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    serviceType: "sunday",
  });
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members?active=true');
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data.map((member: Member) => ({ ...member, isSelected: false })));
      } catch (error) {
        console.error("Error fetching members:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load members. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberToggle = (id: string) => {
    setMembers(prev =>
      prev.map(member =>
        member.id === id ? { ...member, isSelected: !member.isSelected } : member
      )
    );

    // Update selectAll state based on whether all members are now selected
    const updatedMembers = members.map(member =>
      member.id === id ? { ...member, isSelected: !member.isSelected } : member
    );
    setSelectAll(updatedMembers.every(member => member.isSelected));
  };

  const handleSelectAllToggle = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setMembers(prev =>
      prev.map(member => ({ ...member, isSelected: newSelectAll }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedMemberIds = members
      .filter(member => member.isSelected)
      .map(member => member.id);

    if (selectedMemberIds.length === 0) {
      toast({
        variant: "destructive",
        title: "No members selected",
        description: "Please select at least one member to record attendance.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append('date', formData.date);
      formDataObj.append('serviceType', formData.serviceType);
      selectedMemberIds.forEach(id => {
        formDataObj.append('memberIds', id);
      });

      const result = await recordAttendance(formDataObj);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          variant: "success",
          title: "Success",
          description: `Attendance recorded for ${result.count} members.`,
        });
        router.push("/attendance");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Record Attendance</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Service Attendance</CardTitle>
            <CardDescription>
              Record attendance for a church service or event.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Service Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select
                  defaultValue={formData.serviceType}
                  onValueChange={(value) => handleSelectChange("serviceType", value)}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday Service</SelectItem>
                    <SelectItem value="midweek">Midweek Service</SelectItem>
                    <SelectItem value="prayer">Prayer Meeting</SelectItem>
                    <SelectItem value="bible_study">Bible Study</SelectItem>
                    <SelectItem value="youth">Youth Service</SelectItem>
                    <SelectItem value="special">Special Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Members Present</h3>
              <p className="text-sm text-muted-foreground">Select all members who attended this service.</p>

              <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-4">Loading members...</div>
                ) : (
                  <div className="space-y-4">
                    {members.length > 0 ? (
                      members.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`member-${member.id}`}
                            checked={member.isSelected}
                            onCheckedChange={() => handleMemberToggle(member.id)}
                          />
                          <Label htmlFor={`member-${member.id}`} className="flex-1 cursor-pointer">
                            {member.name}
                            <span className="text-sm text-muted-foreground ml-2">
                              {member.email}
                            </span>
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No active members found.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="selectAll"
                  checked={selectAll}
                  onCheckedChange={handleSelectAllToggle}
                  disabled={members.length === 0}
                />
                <Label htmlFor="selectAll" className="cursor-pointer">Select All Members</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/attendance">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Attendance"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
