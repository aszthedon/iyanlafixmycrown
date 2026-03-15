import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book Now" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/policies", label: "Policies" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/aftercare", label: "Aftercare" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="text-brand-charcoal">Iyanla</span>{" "}
          <span className="text-brand-purple">Fix My Crown</span>
        </Link>

        <nav className="hidden gap-5 text-sm md:flex">
          {nav.map((i) => (
            <Link key={i.href} href={i.href} className="text-brand-gray hover:text-brand-charcoal">
              {i.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/book"
          className="btn-shimmer rounded-xl bg-brand-purple px-4 py-2 text-sm font-semibold text-white shadow-soft hover:opacity-95"
        >
          Fix My Crown
        </Link>
      </div>
    </header>
  );
}
