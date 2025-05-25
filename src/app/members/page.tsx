import Link from "next/link";

export default function MembersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Church Members</h1>
        <Link 
          href="/members/new" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Add New Member
        </Link>
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-xl font-semibold">Members Directory</h2>
          <p className="text-muted-foreground">Manage and view all church members</p>
        </div>
        
        <div className="p-4">
          <div className="bg-muted p-8 text-center rounded-md">
            <p className="text-muted-foreground mb-4">No members found. Add your first member to get started.</p>
            <Link 
              href="/members/new" 
              className="text-primary hover:underline"
            >
              Add New Member
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
