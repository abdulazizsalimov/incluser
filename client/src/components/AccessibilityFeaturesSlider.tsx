import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    illustration: (
      <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
        <rect x="20" y="30" width="60" height="40" rx="4" fill="currentColor" opacity="0.2"/>
        <text x="50" y="42" fontSize="8" textAnchor="middle" fill="currentColor">Aa</text>
        <text x="50" y="54" fontSize="12" textAnchor="middle" fill="currentColor">Aa</text>
        <text x="50" y="68" fontSize="16" textAnchor="middle" fill="currentColor">Aa</text>
        <path d="M15 45 L25 40 L25 50 Z" fill="currentColor"/>
        <path d="M85 45 L75 40 L75 50 Z" fill="currentColor"/>
      </svg>
    ),
    title: "Настройка шрифтов",
    description: "Затрудняетесь читать мелкий текст? Увеличьте размер шрифта до 150% и настройте междустрочные интервалы для максимального комфорта чтения."
  },
  {
    id: 2,
    illustration: (
      <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="30" fill="currentColor" opacity="0.2"/>
        <path d="M35 40 L35 60 L45 55 L55 65 L55 35 L45 45 Z" fill="currentColor"/>
        <path d="M58 35 C65 40 70 45 70 50 C70 55 65 60 58 65" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M72 25 C82 35 90 42 90 50 C90 58 82 65 72 75" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    title: "Озвучивание текста",
    description: "Предпочитаете воспринимать информацию на слух? Выделите любой текст на сайте, и система прочитает его вслух с возможностью настройки скорости."
  },
  {
    id: 3,
    illustration: (
      <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="40" r="15" fill="currentColor" opacity="0.2"/>
        <circle cx="50" cy="40" r="8" fill="currentColor"/>
        <circle cx="50" cy="40" r="3" fill="white"/>
        <path d="M30 65 Q50 55 70 65" stroke="currentColor" strokeWidth="3" fill="none"/>
        <rect x="25" y="75" width="10" height="10" fill="currentColor"/>
        <rect x="40" y="75" width="10" height="10" fill="currentColor" opacity="0.5"/>
        <rect x="55" y="75" width="10" height="10" fill="currentColor" opacity="0.3"/>
        <rect x="70" y="75" width="10" height="10" fill="currentColor" opacity="0.1"/>
      </svg>
    ),
    title: "Визуальные улучшения",
    description: "Испытываете проблемы с восприятием цветов? Включите черно-белый режим или активируйте увеличение текста при наведении с зажатой клавишей Shift."
  },
  {
    id: 4,
    illustration: (
      <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
        <circle cx="35" cy="50" r="25" fill="#FCD34D"/>
        <circle cx="65" cy="50" r="25" fill="#1F2937"/>
        <path d="M50 25 L60 40 L40 40 Z" fill="currentColor"/>
        <circle cx="30" cy="45" r="3" fill="#1F2937"/>
        <path d="M20 55 Q35 65 50 55" stroke="#1F2937" strokeWidth="2" fill="none"/>
        <circle cx="70" cy="45" r="3" fill="white"/>
        <path d="M80 55 Q65 65 50 55" stroke="white" strokeWidth="2" fill="none"/>
      </svg>
    ),
    title: "Темы оформления",
    description: "Работаете в темное время суток или чувствительны к яркому свету? Переключитесь на темную тему с космическими градиентами для комфортного чтения."
  },
  {
    id: 5,
    illustration: (
      <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
        <rect x="20" y="30" width="60" height="40" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M30 45 L40 35 L40 40 L60 40 L60 35 L70 45 L60 55 L60 50 L40 50 L40 55 Z" fill="currentColor" opacity="0.3"/>
        <line x1="35" y1="60" x2="45" y2="70" stroke="red" strokeWidth="3"/>
        <line x1="45" y1="60" x2="35" y2="70" stroke="red" strokeWidth="3"/>
        <text x="50" y="80" fontSize="8" textAnchor="middle" fill="currentColor">Без анимаций</text>
      </svg>
    ),
    title: "Управление движением",
    description: "Анимации вызывают дискомфорт или головокружение? Отключите все переходы и анимации для создания статичного и предсказуемого интерфейса."
  },
  {
    id: 6,
    illustration: (
      <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
        <rect x="15" y="40" width="70" height="30" rx="4" fill="currentColor" opacity="0.2"/>
        <rect x="20" y="45" width="8" height="8" rx="2" fill="currentColor"/>
        <rect x="32" y="45" width="8" height="8" rx="2" fill="currentColor"/>
        <rect x="44" y="45" width="20" height="8" rx="2" fill="currentColor"/>
        <rect x="68" y="45" width="8" height="8" rx="2" fill="currentColor"/>
        <rect x="20" y="57" width="8" height="8" rx="2" fill="currentColor"/>
        <rect x="32" y="57" width="8" height="8" rx="2" fill="currentColor"/>
        <rect x="44" y="57" width="32" height="8" rx="2" fill="currentColor"/>
        <path d="M50 25 L45 30 L50 35 L55 30 Z" fill="currentColor"/>
        <text x="50" y="20" fontSize="6" textAnchor="middle" fill="currentColor">Tab</text>
      </svg>
    ),
    title: "Навигация с клавиатуры",
    description: "Не используете мышь? Перемещайтесь по сайту с помощью клавиши Tab, используйте Skip Links для быстрого доступа к контенту."
  }
];

export default function AccessibilityFeaturesSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentSlide + 1) % slides.length;
      setNextSlide(next);
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentSlide(next);
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleSlideChange = (index: number) => {
    if (index !== currentSlide && !isTransitioning) {
      setNextSlide(index);
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

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

        {/* Slide Content - Fixed Height Container */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 h-[500px] relative overflow-hidden">
          {/* Current Slide */}
          <div 
            className={`absolute inset-0 p-8 md:p-12 transition-transform duration-300 ease-in-out ${
              isTransitioning ? 'transform -translate-x-full' : 'transform translate-x-0'
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              {/* Slide Illustration */}
              <div className="mb-8">
                {slides[currentSlide].illustration}
              </div>

              {/* Slide Title */}
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                {slides[currentSlide].title}
              </h3>

              {/* Slide Description */}
              <div className="flex-1 flex items-center">
                <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-2xl mx-auto mb-8">
                  {slides[currentSlide].description}
                </p>
              </div>

              {/* Try Button */}
              <div className="mt-auto">
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
          </div>

          {/* Next Slide (coming from right) */}
          {isTransitioning && (
            <div 
              className="absolute inset-0 p-8 md:p-12 animate-slide-in-right"
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                {/* Next Slide Illustration */}
                <div className="mb-8">
                  {slides[nextSlide].illustration}
                </div>

                {/* Next Slide Title */}
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  {slides[nextSlide].title}
                </h3>

                {/* Next Slide Description */}
                <div className="flex-1 flex items-center">
                  <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-2xl mx-auto mb-8">
                    {slides[nextSlide].description}
                  </p>
                </div>

                {/* Try Button */}
                <div className="mt-auto">
                  <button 
                    onClick={handleTryClick}
                    className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
                    aria-describedby="try-accessibility-desc-next"
                  >
                    Попробовать
                  </button>
                  <p id="try-accessibility-desc-next" className="text-sm opacity-75 mt-3">
                    Откроет панель специальных возможностей для настройки сайта
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
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