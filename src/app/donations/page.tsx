import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DonationsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Donations & Tithes</h1>
        <div className="flex space-x-2">
          <Link href="/donations/reports">
            <Button variant="outline">Financial Reports</Button>
          </Link>
          <Link href="/donations/new">
            <Button>Record New Donation</Button>
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-xl font-semibold">Donations History</h2>
          <p className="text-muted-foreground">Track and manage all church donations and tithes</p>
        </div>

        <div className="p-4">
          <div className="bg-muted p-8 text-center rounded-md">
            <p className="text-muted-foreground mb-4">No donations found. Record your first donation to get started.</p>
            <Link
              href="/donations/new"
              className="text-primary hover:underline"
            >
              Record New Donation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
