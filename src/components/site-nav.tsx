import Link from "next/link";
import { navFor, type Role } from "@/lib/roles";

// Placeholder: the role will come from the Supabase session in S1.
export function SiteNav({ role = "viewer" }: { role?: Role }) {
  return (
    <nav aria-label="Main" className="flex items-center gap-4 text-sm">
      {navFor(role).map((i) => (
        <Link key={i.href} href={i.href} className="underline-offset-4 hover:underline focus-visible:underline">
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
