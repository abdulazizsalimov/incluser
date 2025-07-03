import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    illustration: (
      <svg className="w-24 h-24" viewBox="0 0 120 120" fill="none">
        <rect x="10" y="20" width="100" height="80" rx="8" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2"/>
        <text x="60" y="45" fontSize="12" textAnchor="middle" fill="currentColor" fontWeight="bold">Aa</text>
        <text x="60" y="65" fontSize="18" textAnchor="middle" fill="currentColor" fontWeight="bold">Aa</text>
        <text x="60" y="85" fontSize="24" textAnchor="middle" fill="currentColor" fontWeight="bold">Aa</text>
        <path d="M20 60 L30 55 L30 65 Z" fill="currentColor"/>
        <path d="M100 60 L90 55 L90 65 Z" fill="currentColor"/>
        <circle cx="60" cy="105" r="3" fill="currentColor"/>
        <path d="M50 105 L70 105" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    title: "Настройка шрифтов",
    description: "Затрудняетесь читать мелкий текст? Увеличьте размер шрифта до 150%."
  },
  {
    id: 2,
    illustration: (
      <svg className="w-24 h-24" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="45" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2"/>
        <path d="M40 50 L40 70 L50 65 L70 80 L70 40 L50 55 Z" fill="currentColor"/>
        <path d="M75 45 C85 50 95 55 95 60 C95 65 85 70 75 75" stroke="currentColor" strokeWidth="3" fill="none"/>
        <path d="M80 35 C95 45 105 52 105 60 C105 68 95 75 80 85" stroke="currentColor" strokeWidth="3" fill="none"/>
        <circle cx="35" cy="35" r="4" fill="currentColor"/>
        <circle cx="25" cy="45" r="3" fill="currentColor"/>
        <circle cx="30" cy="25" r="2" fill="currentColor"/>
      </svg>
    ),
    title: "Озвучивание текста",
    description: "Предпочитаете воспринимать информацию на слух? Выделите текст для озвучивания."
  },
  {
    id: 3,
    illustration: (
      <svg className="w-24 h-24" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="50" r="25" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2"/>
        <circle cx="60" cy="50" r="15" fill="currentColor"/>
        <circle cx="60" cy="50" r="6" fill="white"/>
        <path d="M30 85 Q60 70 90 85" stroke="currentColor" strokeWidth="4" fill="none"/>
        <rect x="20" y="95" width="15" height="15" fill="currentColor"/>
        <rect x="35" y="95" width="15" height="15" fill="currentColor" opacity="0.7"/>
        <rect x="50" y="95" width="15" height="15" fill="currentColor" opacity="0.4"/>
        <rect x="65" y="95" width="15" height="15" fill="currentColor" opacity="0.2"/>
        <rect x="80" y="95" width="15" height="15" fill="currentColor" opacity="0.1"/>
      </svg>
    ),
    title: "Визуальные улучшения",
    description: "Проблемы с восприятием цветов? Включите черно-белый режим или увеличение текста."
  },
  {
    id: 4,
    illustration: (
      <svg className="w-24 h-24" viewBox="0 0 120 120" fill="none">
        <circle cx="45" cy="60" r="35" fill="#FCD34D"/>
        <circle cx="75" cy="60" r="35" fill="#1F2937"/>
        <path d="M60 20 L75 40 L45 40 Z" fill="currentColor"/>
        <circle cx="35" cy="55" r="5" fill="#1F2937"/>
        <path d="M20 70 Q45 85 60 70" stroke="#1F2937" strokeWidth="3" fill="none"/>
        <circle cx="85" cy="55" r="5" fill="white"/>
        <path d="M100 70 Q75 85 60 70" stroke="white" strokeWidth="3" fill="none"/>
        <rect x="55" y="95" width="10" height="15" fill="currentColor"/>
      </svg>
    ),
    title: "Темы оформления",
    description: "Чувствительны к яркому свету? Переключитесь на темную тему."
  },
  {
    id: 5,
    illustration: (
      <svg className="w-24 h-24" viewBox="0 0 120 120" fill="none">
        <rect x="20" y="40" width="80" height="50" rx="8" stroke="currentColor" strokeWidth="3" fill="none"/>
        <path d="M40 60 L55 45 L55 52 L85 52 L85 45 L100 60 L85 75 L85 68 L55 68 L55 75 Z" fill="red" opacity="0.7"/>
        <line x1="30" y1="100" x2="50" y2="110" stroke="red" strokeWidth="4"/>
        <line x1="50" y1="100" x2="30" y2="110" stroke="red" strokeWidth="4"/>
        <text x="60" y="25" fontSize="12" textAnchor="middle" fill="currentColor" fontWeight="bold">STOP</text>
      </svg>
    ),
    title: "Управление движением",
    description: "Анимации вызывают дискомфорт? Отключите все переходы и анимации."
  },
  {
    id: 6,
    illustration: (
      <svg className="w-24 h-24" viewBox="0 0 120 120" fill="none">
        <rect x="10" y="50" width="100" height="40" rx="8" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
        <rect x="18" y="58" width="12" height="12" rx="3" fill="currentColor"/>
        <rect x="34" y="58" width="12" height="12" rx="3" fill="currentColor"/>
        <rect x="50" y="58" width="30" height="12" rx="3" fill="currentColor"/>
        <rect x="84" y="58" width="12" height="12" rx="3" fill="currentColor"/>
        <rect x="18" y="74" width="12" height="12" rx="3" fill="currentColor"/>
        <rect x="34" y="74" width="45" height="12" rx="3" fill="currentColor"/>
        <rect x="84" y="74" width="12" height="12" rx="3" fill="currentColor"/>
        <path d="M60 25 L50 35 L60 45 L70 35 Z" fill="currentColor"/>
        <text x="60" y="20" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="bold">TAB</text>
        <path d="M20 35 L30 25 L40 35" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M80 35 L90 25 L100 35" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    title: "Навигация с клавиатуры",
    description: "Не используете мышь? Перемещайтесь по сайту с помощью клавиши Tab."
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

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const handleTryClick = () => {
    const accessibilityButton = document.querySelector('[aria-label="Специальные возможности"]') as HTMLButtonElement;
    if (accessibilityButton) {
      accessibilityButton.click();
    }
  };

  return (
    <section className="relative text-white overflow-hidden lg:min-h-[600px]" aria-labelledby="accessibility-features">
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

      {/* Mobile Layout */}
      <div className="lg:hidden relative">
        <div className="px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 id="accessibility-features" className="text-2xl font-bold mb-3">
              Специальные возможности: забота о каждом пользователе
            </h2>
            <p className="text-lg opacity-90">
              Настройте сайт под свои потребности
            </p>
          </div>

          {/* Slide Container */}
          <div className="relative h-80 overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={slide.id} className="w-full flex-shrink-0 flex flex-col items-center justify-center text-center px-6">
                  <div className="mb-6">
                    {slide.illustration}
                  </div>
                  <h3 className="text-xl font-bold mb-4">
                    {slide.title}
                  </h3>
                  <p className="text-base opacity-90 leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block relative z-10 h-full">
        <div className="w-full h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 gap-12 items-center">
            {/* Left Side - Header */}
            <div>
              <h2 id="accessibility-features-desktop" className="text-4xl font-bold mb-4">
                Специальные возможности: забота о каждом пользователе
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Настройте сайт под свои потребности
              </p>
            </div>

            {/* Right Side - Sliding Content */}
            <div className="relative h-80 overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={slide.id} className="w-full flex-shrink-0 flex flex-col items-center justify-center text-center">
                    <div className="mb-6">
                      {slide.illustration}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      {slide.title}
                    </h3>
                    <p className="text-lg opacity-90 leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Try Button - Outside slider */}
      <div className="relative z-10 text-center pb-12">
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

        {/* Slide Indicators */}
        <div className="flex justify-center mt-6 gap-2">
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
        <div className="text-center mt-3">
          <span className="text-sm opacity-75">
            {currentSlide + 1} из {slides.length}
          </span>
        </div>
      </div>
    </section>
  );
}