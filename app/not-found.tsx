import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-max py-20 text-center space-y-4">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="px-4 py-2 rounded-md bg-blue-600 text-white inline-block">Go home</Link>
    </main>
  );
}


