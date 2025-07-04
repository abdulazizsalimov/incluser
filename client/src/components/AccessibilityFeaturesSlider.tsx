import { useState, useEffect, useRef } from "react";
import { Headphones } from "lucide-react";
import slyde1Image from "@assets/Slyde1_1751518088264.png";
import slyde2Image from "@assets/Slyde2_1751518092093.png";
import slyde3Image from "@assets/Slyde3_1751518094773.png";
import slyde4Image from "@assets/Slyde4_1751518100860.png";
import slyde5Image from "@assets/Slyde5_1751518104614.png";

const slides = [
  {
    id: 1,
    illustration: (
      <img 
        src={slyde1Image} 
        alt="Человек настраивает доступность на компьютере с иконками глаза, текста и уха"
        className="w-full h-full object-contain"
      />
    ),
    title: "Настройка шрифта",
    description: "Затрудняетесь читать мелкий текст? Увеличьте размер шрифта до 150%."
  },
  {
    id: 2,
    illustration: (
      <img 
        src={slyde2Image} 
        alt="Человек с наушниками слушает озвучивание текста с компьютера"
        className="w-full h-full object-contain"
      />
    ),
    title: "Озвучивание текста",
    description: "Предпочитаете воспринимать информацию на слух? Выделите текст для озвучивания."
  },
  {
    id: 3,
    illustration: (
      <img 
        src={slyde3Image} 
        alt="Человек настраивает визуальные параметры интерфейса с лупой и переключателями"
        className="w-full h-full object-contain"
      />
    ),
    title: "Восприятие цветов",
    description: "Проблемы с цветами? Включите черно-белый режим или темную тему."
  },
  {
    id: 4,
    illustration: (
      <img 
        src={slyde4Image} 
        alt="Человек настраивает темы оформления в браузере с переключателями"
        className="w-full h-full object-contain"
      />
    ),
    title: "Управление движением",
    description: "Анимации вызывают дискомфорт? Отключите все переходы и анимации."
  },
  {
    id: 5,
    illustration: (
      <img 
        src={slyde5Image} 
        alt="Человек работает с клавиатурой, используя клавишу Tab для навигации"
        className="w-full h-full object-contain"
      />
    ),
    title: "Клавиатурная навигация",
    description: "Удобнее работать с клавиатурой? Используйте Tab для навигации по сайту."
  }
];

export default function AccessibilityFeaturesSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5000);
  const [isScreenReaderFocused, setIsScreenReaderFocused] = useState(false);
  const [hasInitializedScreenReader, setHasInitializedScreenReader] = useState(false);
  const lastAnnouncedSlideRef = useRef<number>(-1);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeLeft(5000);
    }, 5000);

    const timeInterval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 100));
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, [isAutoPlaying]);

  // Announce slide content to screen reader when slide changes and button is focused
  useEffect(() => {
    if (isScreenReaderFocused && hasInitializedScreenReader) {
      // Only announce if the slide has actually changed
      if (lastAnnouncedSlideRef.current !== currentSlide) {
        const currentSlideData = slides[currentSlide];
        const announcement = `${currentSlideData.title}. ${currentSlideData.description}`;
        
        // Create a new element each time to force screen reader announcement
        const announceElement = document.createElement('div');
        announceElement.setAttribute('aria-live', 'polite');
        announceElement.setAttribute('aria-atomic', 'true');
        announceElement.className = 'sr-only';
        announceElement.textContent = announcement;
        
        // Add to body temporarily
        document.body.appendChild(announceElement);
        
        // Remove after announcement
        setTimeout(() => {
          if (document.body.contains(announceElement)) {
            document.body.removeChild(announceElement);
          }
        }, 1000);
        
        lastAnnouncedSlideRef.current = currentSlide;
      }
    }
  }, [currentSlide, isScreenReaderFocused, hasInitializedScreenReader]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    if (isAutoPlaying) {
      setTimeLeft(5000);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeLeft(5000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeLeft(5000);
  };

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
    <section className="relative text-white overflow-hidden" aria-labelledby="accessibility-features">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="text-center mb-4 relative">
          {/* Screen Reader Button - appears only on focus */}
          <button
            className="absolute top-0 left-0 opacity-0 focus:opacity-100 bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all focus:outline-none focus:ring-4 focus:ring-white/50"
            onFocus={() => {
              setIsScreenReaderFocused(true);
              // Set initialization flag after 5 seconds to allow instruction to be read first
              setTimeout(() => setHasInitializedScreenReader(true), 5000);
            }}
            onBlur={() => {
              setIsScreenReaderFocused(false);
              setHasInitializedScreenReader(false);
              lastAnnouncedSlideRef.current = -1; // Reset announced slide tracking
            }}
            aria-label="Баннер содержит динамически изменяющийся контент. Оставайтесь на этом элементе, чтобы прослушать его содержимое"
          >
            <Headphones className="h-4 w-4 text-white" />
          </button>
          
          <h2 id="accessibility-features" className="text-2xl md:text-3xl font-bold mb-2">
            Специальные возможности: забота о каждом пользователе
          </h2>
          <p className="text-base md:text-lg opacity-90">
            Настройте сайт под свои потребности
          </p>
          
          {/* Timer Clock in top right */}
          <div className="absolute top-0 right-0">
            <button
              onClick={toggleAutoPlay}
              className="relative bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label={isAutoPlaying ? "Остановить автопереключение" : "Запустить автопереключение"}
            >
              {/* Clock face */}
              <div className="w-8 h-8 rounded-full border-2 border-white relative">
                {/* Clock hand - rotates based on time left */}
                <div 
                  className="absolute top-1 left-1/2 w-0.5 h-3 bg-white origin-bottom -translate-x-1/2 transition-transform duration-100"
                  style={{ 
                    transform: `translateX(-50%) rotate(${isAutoPlaying ? (360 - (timeLeft / 5000) * 360) : 0}deg)`,
                    transformOrigin: 'bottom center'
                  }}
                />
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              </div>
              
              {/* Play/Pause overlay */}
              {!isAutoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Continuous Ribbon Slider */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 md:p-6 mb-4">
          <div className="relative h-[400px] overflow-hidden rounded-xl">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Предыдущий слайд"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Следующий слайд"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {/* Render all slides with transitions */}
            {slides.map((slide, index) => {
              const position = index === currentSlide ? 'center' : 
                             index === (currentSlide - 1 + slides.length) % slides.length ? 'prev' :
                             index === (currentSlide + 1) % slides.length ? 'next' : 'hidden';
              
              return (
                <div 
                  key={slide.id} 
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    position === 'center' ? 'z-30 opacity-100 scale-100 blur-0' :
                    position === 'prev' ? 'z-10 opacity-30 scale-75 blur-sm -translate-x-1/4' :
                    position === 'next' ? 'z-10 opacity-30 scale-75 blur-sm translate-x-1/4' :
                    'z-0 opacity-0 scale-50'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {slide.illustration}
                  </div>
                </div>
              );
            })}
            
            {/* Text overlay only for current slide */}
            <div className="absolute inset-0 z-40 transition-all duration-700 ease-in-out">
              <div className="h-full flex flex-col justify-end p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-lg transition-all duration-700">
                      {slides[currentSlide].title}
                    </h3>
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-lg transition-all duration-700">
                      {slides[currentSlide].description}
                    </p>
                  </div>
                  
                  {/* Static Button Area */}
                  <div className="flex-shrink-0">
                    <button 
                      onClick={handleTryClick}
                      className="border-2 border-white/80 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-blue-600 hover:border-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
                      aria-describedby="try-accessibility-desc"
                    >
                      Попробовать
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="text-center">
          {/* Hidden description for accessibility */}
          <p id="try-accessibility-desc" className="sr-only">
            Откроет панель специальных возможностей для настройки сайта
          </p>



          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mb-3">
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
          <div className="text-center">
            <span className="text-sm opacity-75">
              {currentSlide + 1} из {slides.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}