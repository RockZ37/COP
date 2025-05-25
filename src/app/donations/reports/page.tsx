import Link from "next/link";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

async function getFinancialData() {
  try {
    // Get current year and month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Calculate start dates for different periods
    const startOfYear = new Date(currentYear, 0, 1);
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
    
    // Get total donations for different periods
    const yearToDateTotal = await prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startOfYear,
        },
      },
    });
    
    const currentMonthTotal = await prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startOfMonth,
        },
      },
    });
    
    const lastMonthTotal = await prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startOfLastMonth,
          lt: startOfMonth,
        },
      },
    });
    
    // Get donations by type for current year
    const donationsByType = await prisma.donation.groupBy({
      by: ['type'],
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startOfYear,
        },
      },
    });
    
    // Get monthly totals for current year
    const monthlyTotals = await prisma.$queryRaw`
      SELECT 
        CAST(strftime('%m', date) AS INTEGER) as month, 
        SUM(amount) as total
      FROM Donation
      WHERE date >= ${startOfYear.toISOString()}
      GROUP BY month
      ORDER BY month
    `;
    
    // Get recent donations
    const recentDonations = await prisma.donation.findMany({
      take: 10,
      orderBy: {
        date: 'desc',
      },
      include: {
        member: {
          select: {
            name: true,
          },
        },
      },
    });
    
    return {
      yearToDateTotal: yearToDateTotal._sum.amount || 0,
      currentMonthTotal: currentMonthTotal._sum.amount || 0,
      lastMonthTotal: lastMonthTotal._sum.amount || 0,
      donationsByType,
      monthlyTotals,
      recentDonations,
    };
  } catch (error) {
    console.error("Error fetching financial data:", error);
    return {
      yearToDateTotal: 0,
      currentMonthTotal: 0,
      lastMonthTotal: 0,
      donationsByType: [],
      monthlyTotals: [],
      recentDonations: [],
    };
  }
}

export default async function FinancialReportsPage() {
  const financialData = await getFinancialData();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  // Calculate month-over-month change
  const monthlyChange = financialData.lastMonthTotal > 0
    ? ((financialData.currentMonthTotal - financialData.lastMonthTotal) / financialData.lastMonthTotal) * 100
    : 0;
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <div className="flex space-x-2">
          <div className="space-y-2">
            <Label htmlFor="reportPeriod">Report Period</Label>
            <Select defaultValue="year">
              <SelectTrigger id="reportPeriod" className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Year to Date ({currentYear})</SelectItem>
                <SelectItem value="month">Current Month ({currentMonth})</SelectItem>
                <SelectItem value="quarter">Current Quarter</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link href="/donations/reports/export">
            <Button variant="outline">Export Report</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Year to Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${financialData.yearToDateTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total donations in {currentYear}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${financialData.currentMonthTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total donations in {currentMonth}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Month-over-Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Change from previous month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Donations by Type</CardTitle>
            <CardDescription>Breakdown of donations by category</CardDescription>
          </CardHeader>
          <CardContent>
            {financialData.donationsByType.length > 0 ? (
              <div className="space-y-4">
                {financialData.donationsByType.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium capitalize">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item._sum.amount?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No donation data available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends ({currentYear})</CardTitle>
            <CardDescription>Donation totals by month</CardDescription>
          </CardHeader>
          <CardContent>
            {financialData.monthlyTotals.length > 0 ? (
              <div className="space-y-4">
                {financialData.monthlyTotals.map((item: any) => (
                  <div key={item.month} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{monthNames[item.month - 1]}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${parseFloat(item.total).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No monthly data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Latest donation records</CardDescription>
        </CardHeader>
        <CardContent>
          {financialData.recentDonations.length > 0 ? (
            <div className="space-y-4">
              {financialData.recentDonations.map((donation) => (
                <div key={donation.id} className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <p className="font-medium">${donation.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {donation.type} • {donation.member ? donation.member.name : 'Anonymous'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(donation.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent donations found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
