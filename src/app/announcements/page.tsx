import Link from "next/link";

export default function AnnouncementsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Church Announcements</h1>
        <Link 
          href="/announcements/new" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Create New Announcement
        </Link>
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-xl font-semibold">Announcements Board</h2>
          <p className="text-muted-foreground">Manage and view all church announcements</p>
        </div>
        
        <div className="p-4">
          <div className="bg-muted p-8 text-center rounded-md">
            <p className="text-muted-foreground mb-4">No announcements found. Create your first announcement to get started.</p>
            <Link 
              href="/announcements/new" 
              className="text-primary hover:underline"
            >
              Create New Announcement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
