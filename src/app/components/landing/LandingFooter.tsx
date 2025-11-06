"use client";

export function LandingFooter() {
  return (
    <footer className="bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} StartLabX. All rights reserved.</p>
      </div>
    </footer>
  );
}
