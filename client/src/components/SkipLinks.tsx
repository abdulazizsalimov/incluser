export default function SkipLinks() {
  return (
    <div className="fixed top-4 left-4 z-[9999]">
      <a
        href="#main-content"
        className="absolute -translate-y-full opacity-0 focus:translate-y-0 focus:opacity-100 bg-primary text-primary-foreground px-4 py-2 rounded focus:outline-none focus:ring-4 focus:ring-accent transition-all duration-150 shadow-lg"
      >
        Перейти к основному содержимому
      </a>
    </div>
  );
}
