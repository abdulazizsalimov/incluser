import { Link } from "wouter";
import { SiFacebook, SiTelegram, SiVk } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navItems = [
    { href: "/", label: "Главная" },
    { href: "/articles", label: "Статьи" },
    { href: "/about", label: "Об авторе" },
    { href: "/contact", label: "Контакты" },
  ];

  const resourceItems = [
    { href: "/wcag-guides", label: "Руководства WCAG" },
    { href: "/testing-tools", label: "Инструменты тестирования" },
    { href: "#best-practices", label: "Лучшие практики" },
    { href: "#education", label: "Обучение и вебинары" },
    { href: "#screen-readers", label: "Программы экранного доступа" },
    { href: "#mobile-apps", label: "Мобильные приложения" },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 text-white py-12 border-t-2 border-slate-600 dark:border-slate-700 shadow-lg" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            {/* Accessibility Statement */}
            <div className="mb-4">
              <p className="text-slate-300 mb-3">
                Мы стараемся сделать сайт максимально удобным для пользователей экранных дикторов, устройств с клавиатурной навигацией и мобильных пользователей. Если вы столкнулись с проблемой — сообщите нам.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Сообщить о проблеме
              </Link>
            </div>
            
            <h3 className="text-2xl font-bold text-gradient mb-4">
              Incluser
            </h3>
            <p className="text-slate-300 mb-4">
              Блог о цифровой доступности и инклюзивном дизайне. 
              Делаем интернет доступнее для всех.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61577263382434"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                aria-label="Перейти на Facebook страницу Incluser"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/incluseruz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                aria-label="Перейти в Telegram канал Incluser"
              >
                <SiTelegram className="h-5 w-5" />
              </a>
              <span
                className="text-slate-600 cursor-not-allowed opacity-50"
                aria-label="VK страница скоро будет доступна"
                title="VK страница скоро будет доступна"
              >
                <SiVk className="h-5 w-5" />
              </span>
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
            <h4 className="text-lg font-semibold mb-4 text-white">Полезные ресурсы</h4>
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
