export function Footer() {
  return (
    <footer className="bg-muted py-6 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-muted-foreground">
          &copy; {new Date().getFullYear()} Church Of Pentecoast Grace Assembly. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
