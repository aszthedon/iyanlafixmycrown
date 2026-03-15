export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2 text-sm text-brand-gray">
          <div className="font-semibold text-brand-charcoal">Iyanla Fix My Crown</div>
          <div>Flint, MI • Serving Flint, Bay City, Saginaw</div>
          <div className="text-xs">© {new Date().getFullYear()} • All rights reserved</div>
        </div>
      </div>
    </footer>
  );
}
