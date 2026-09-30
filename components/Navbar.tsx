import { MockBadge } from "@/components/MockBadge";

const links = [
  { href: "#match", label: "Matches" },
  { href: "#overview", label: "Analytics" },
  { href: "#prediction", label: "Predictions" },
  { href: "#history", label: "History" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/8 bg-[#07090e]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#match" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-[11px] font-bold tracking-tight text-emerald-300 ring-1 ring-emerald-400/20">
            EML
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            EPL Match Lab
          </span>
        </a>

        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 py-1.5 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="hidden items-center gap-2 sm:inline-flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Data updated recently
          </span>
          <MockBadge />
        </div>
      </div>
    </header>
  );
}
