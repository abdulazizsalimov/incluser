import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5 4v3h5.5v12h3V7H19V4z"/>
      </svg>
    ),
    title: "Настройка шрифтов",
    description: "Затрудняетесь читать мелкий текст? Увеличьте размер шрифта до 150% и настройте междустрочные интервалы для максимального комфорта чтения."
  },
  {
    id: 2,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
    ),
    title: "Озвучивание текста",
    description: "Предпочитаете воспринимать информацию на слух? Выделите любой текст на сайте, и система прочитает его вслух с возможностью настройки скорости."
  },
  {
    id: 3,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
    ),
    title: "Визуальные улучшения",
    description: "Испытываете проблемы с восприятием цветов? Включите черно-белый режим или активируйте увеличение текста при наведении с зажатой клавишей Shift."
  },
  {
    id: 4,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.5 2C5.71 3.15 4.5 5.18 4.5 7.5c0 1.77.78 3.34 2 4.44V20h11v-8.06c1.22-1.1 2-2.67 2-4.44 0-2.32-1.21-4.35-3-5.5L12 9 7.5 2z"/>
      </svg>
    ),
    title: "Темы оформления",
    description: "Работаете в темное время суток или чувствительны к яркому свету? Переключитесь на темную тему с космическими градиентами для комфортного чтения."
  },
  {
    id: 5,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
      </svg>
    ),
    title: "Управление движением",
    description: "Анимации вызывают дискомфорт или головокружение? Отключите все переходы и анимации для создания статичного и предсказуемого интерфейса."
  },
  {
    id: 6,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>
      </svg>
    ),
    title: "Навигация с клавиатуры",
    description: "Не используете мышь? Перемещайтесь по сайту с помощью клавиши Tab, используйте Skip Links для быстрого доступа к контенту."
  }
];

export default function AccessibilityFeaturesSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTryClick = () => {
    const accessibilityButton = document.querySelector('[aria-label="Специальные возможности"]') as HTMLButtonElement;
    if (accessibilityButton) {
      accessibilityButton.click();
    }
  };

  return (
    <section className="relative text-white overflow-hidden py-16" aria-labelledby="accessibility-features">
      {/* Background with same gradient as hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900"></div>
      
      {/* Accessibility symbols pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 gap-8 transform rotate-12 scale-110">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center text-6xl text-white/20">
              {i % 4 === 0 && "♿"}
              {i % 4 === 1 && "👁"}
              {i % 4 === 2 && "🔊"}
              {i % 4 === 3 && "⌨"}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 id="accessibility-features" className="text-4xl font-bold mb-4">
            Специальные возможности: забота о каждом пользователе
          </h2>
          <p className="text-xl opacity-90">
            Настройте сайт под свои потребности
          </p>
        </div>

        {/* Slide Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 min-h-[300px] flex flex-col justify-between">
          <div className="text-center">
            {/* Slide Icon */}
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              {slides[currentSlide].icon}
            </div>

            {/* Slide Title */}
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              {slides[currentSlide].title}
            </h3>

            {/* Slide Description */}
            <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-2xl mx-auto mb-8">
              {slides[currentSlide].description}
            </p>

            {/* Try Button */}
            <button 
              onClick={handleTryClick}
              className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-describedby="try-accessibility-desc"
            >
              Попробовать
            </button>
            <p id="try-accessibility-desc" className="text-sm opacity-75 mt-3">
              Откроет панель специальных возможностей для настройки сайта
            </p>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Перейти к слайду ${index + 1}: ${slides[index].title}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-center mt-4">
          <span className="text-sm opacity-75">
            {currentSlide + 1} из {slides.length}
          </span>
        </div>
      </div>
    </section>
  );
}