import { Link } from "wouter";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navItems = [
    { href: "/", label: "Главная" },
    { href: "/articles", label: "Статьи" },
    { href: "/about", label: "Об авторе" },
    { href: "/contact", label: "Контакты" },
  ];

  const resourceItems = [
    { href: "#wcag", label: "Руководства WCAG" },
    { href: "#testing", label: "Инструменты тестирования" },
    { href: "#links", label: "Полезные ссылки" },
    { href: "#rss", label: "RSS подписка" },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-800 to-slate-900 dark:from-slate-600 dark:to-slate-700 text-white py-12 border-t-2 border-slate-600 dark:border-slate-500 shadow-lg" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-gradient mb-4">
              Incluser
            </h3>
            <p className="text-slate-300 mb-4">
              Блог о цифровой доступности и инклюзивном дизайне. 
              Делаем интернет доступнее для всех.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Навигация</h4>
            <nav aria-label="Навигация в подвале">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Ресурсы</h4>
            <ul className="space-y-2">
              {resourceItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © {currentYear} Incluser. Все права защищены.{" "}
            <a
              href="#"
              className="text-cyan-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
            >
              Политика конфиденциальности
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
