import Link from "next/link";

export default function GroupsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Church Groups</h1>
        <Link 
          href="/groups/new" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Create New Group
        </Link>
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-xl font-semibold">Groups Directory</h2>
          <p className="text-muted-foreground">Manage and view all church groups, ministries, and departments</p>
        </div>
        
        <div className="p-4">
          <div className="bg-muted p-8 text-center rounded-md">
            <p className="text-muted-foreground mb-4">No groups found. Create your first group to get started.</p>
            <Link 
              href="/groups/new" 
              className="text-primary hover:underline"
            >
              Create New Group
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
