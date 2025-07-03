import { useState, useEffect } from "react";
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
    title: "Настройка доступности",
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
    title: "Визуальные улучшения",
    description: "Проблемы с восприятием цветов? Включите черно-белый режим или увеличение текста."
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
    title: "Темы оформления",
    description: "Чувствительны к яркому свету? Переключитесь на темную тему."
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
        <div className="text-center mb-4">
          <h2 id="accessibility-features" className="text-2xl md:text-3xl font-bold mb-2">
            Специальные возможности: забота о каждом пользователе
          </h2>
          <p className="text-base md:text-lg opacity-90">
            Настройте сайт под свои потребности
          </p>
        </div>

        {/* Continuous Ribbon Slider */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 md:p-6 mb-4">
          <div className="relative h-[400px] overflow-hidden rounded-xl">
            {/* Previous slide (left side) */}
            <div className="absolute left-0 top-0 w-3/5 h-full ribbon-slide ribbon-slide-prev">
              <div className="w-full h-full flex items-center justify-center">
                {slides[(currentSlide - 1 + slides.length) % slides.length].illustration}
              </div>
            </div>
            
            {/* Next slide (right side) */}
            <div className="absolute right-0 top-0 w-3/5 h-full ribbon-slide ribbon-slide-next">
              <div className="w-full h-full flex items-center justify-center">
                {slides[(currentSlide + 1) % slides.length].illustration}
              </div>
            </div>
            
            {/* Current slide (center) */}
            <div className="absolute inset-0 ribbon-slide ribbon-slide-center">
              <div className="w-full h-full flex items-center justify-center">
                {slides[currentSlide].illustration}
              </div>
              
              {/* Content overlay at bottom with button area */}
              <div className="absolute inset-0 z-30 flex flex-col justify-end p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-lg">
                      {slides[currentSlide].title}
                    </h3>
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-lg">
                      {slides[currentSlide].description}
                    </p>
                  </div>
                  
                  {/* Static Button Area */}
                  <div className="flex-shrink-0">
                    <button 
                      onClick={handleTryClick}
                      className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
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