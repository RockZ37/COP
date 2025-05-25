import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewDonationPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Record New Donation</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Donation Information</CardTitle>
          <CardDescription>
            Enter the details of the new donation or tithe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input id="amount" type="number" step="0.01" min="0" className="pl-6" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Donation Type</Label>
            <Select defaultValue="tithe">
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tithe">Tithe</SelectItem>
                <SelectItem value="offering">Offering</SelectItem>
                <SelectItem value="special">Special Offering</SelectItem>
                <SelectItem value="building">Building Fund</SelectItem>
                <SelectItem value="missions">Missions</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="member">Member (Optional)</Label>
            <Select>
              <SelectTrigger id="member">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anonymous">Anonymous</SelectItem>
                {/* This would be populated from the database */}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Additional information about the donation..." />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/donations">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button>Record Donation</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
