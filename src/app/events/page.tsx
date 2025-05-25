import Link from "next/link";

export default function EventsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Church Events</h1>
        <Link 
          href="/events/new" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Create New Event
        </Link>
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-xl font-semibold">Events Calendar</h2>
          <p className="text-muted-foreground">Manage and view all church events</p>
        </div>
        
        <div className="p-4">
          <div className="bg-muted p-8 text-center rounded-md">
            <p className="text-muted-foreground mb-4">No events found. Create your first event to get started.</p>
            <Link 
              href="/events/new" 
              className="text-primary hover:underline"
            >
              Create New Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
