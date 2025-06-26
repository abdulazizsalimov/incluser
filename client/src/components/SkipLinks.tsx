export default function SkipLinks() {
  return (
    <div className="fixed top-2 left-2 z-50">
      <div className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="bg-primary text-primary-foreground px-4 py-2 rounded focus:outline-none focus:ring-4 focus:ring-accent"
        >
          Перейти к основному содержимому
        </a>
        <a
          href="#navigation"
          className="bg-primary text-primary-foreground px-4 py-2 rounded ml-2 focus:outline-none focus:ring-4 focus:ring-accent"
        >
          Перейти к навигации
        </a>
      </div>
    </div>
  );
}
