import { storage } from "./storage";

export async function seedPages() {
  try {
    // Check if pages already exist to avoid duplicates
    const existingPages = await storage.getPages();
    const existingSlugs = existingPages.map(page => page.slug);

    const pagesToCreate = [
      {
        title: "Об авторе",
        slug: "about",
        content: `
        <div style="display: flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap;">
          <div style="flex: 0 0 300px;">
            <img src="/author-photo.png" alt="Абдулазиз Салимов" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
          </div>
          <div style="flex: 1; min-width: 300px;">
            <h2>Абдулазиз Салимов</h2>
            <p><strong>Эксперт по цифровой доступности</strong></p>
            <p>Меня зовут Абдулазиз Салимов. Я являюсь человеком с инвалидностью по зрению I группы и специалистом в области цифровой доступности.</p>
            
            <p>Работаю в Центре управления проектами цифрового правительства при Министерстве цифровых технологий Республики Узбекистан. Основное направление моей деятельности — аудит цифровых сервисов на доступность для людей с различными формами инвалидности.</p>
          </div>
        </div>
        
        <p>В рамках профессиональной деятельности работаю с Единым порталом интерактивных государственных услуг my.gov.uz: выявляю барьеры в использовании сервисов, консультирую команды разработчиков, участвую в разработке и внедрении решений, которые делают цифровую среду доступнее для всех пользователей.</p>
        
        <h3>Миссия</h3>
        <p>Я убежден, что технологии должны служить всем людям, независимо от их физических, сенсорных или когнитивных способностей. Цифровая доступность — это не просто соблюдение стандартов, это создание инклюзивного мира, где каждый может полноценно участвовать в цифровой жизни общества.</p>
        
        <h3>Экспертиза</h3>
        <ul>
          <li>Аудит веб-сайтов и мобильных приложений на соответствие стандартам WCAG 2.1</li>
          <li>Консультирование по вопросам инклюзивного дизайна</li>
          <li>Тестирование интерфейсов с использованием вспомогательных технологий</li>
          <li>Разработка рекомендаций по устранению барьеров доступности</li>
          <li>Обучение команд разработки принципам универсального дизайна</li>
        </ul>
        
        <h3>О блоге</h3>
        <p>Этот блог создан для того, чтобы делиться знаниями и опытом в области цифровой доступности. Здесь вы найдете практические руководства, обзоры инструментов, разборы реальных кейсов и рекомендации по созданию более инклюзивных цифровых продуктов.</p>
        
        <p>Моя цель — сделать информацию о веб-доступности понятной и применимой для всех: разработчиков, дизайнеров, продакт-менеджеров и всех, кто создает цифровые решения. Доступность — это не препятствие для креативности, а возможность создавать продукты, которыми могут пользоваться все люди, независимо от их способностей.</p>
        
        <h3>Контакты</h3>
        <ul>
          <li><strong>Email:</strong> salimov.abdulaziz.98@gmail.com</li>
          <li><strong>Телефон:</strong> +998 (99) 831-69-83</li>
          <li><strong>Местоположение:</strong> Ташкент, Узбекистан (UTC+5)</li>
        </ul>
        `,
        metaDescription: "Абдулазиз Салимов — эксперт по цифровой доступности, специалист в области инклюзивного дизайна и веб-доступности.",
        isPublished: true
      },
      {
        title: "Руководства WCAG",
        slug: "wcag-guides",
        content: `
        <h2>Web Content Accessibility Guidelines (WCAG)</h2>
        
        <p>WCAG — это международный стандарт веб-доступности, разработанный W3C. Эти руководства помогают создавать контент, доступный для людей с различными ограничениями возможностей.</p>
        
        <h3>Основные принципы WCAG</h3>
        
        <h4>1. Воспринимаемость (Perceivable)</h4>
        <p>Информация и компоненты интерфейса должны быть представлены пользователям способами, которые они могут воспринять.</p>
        <ul>
          <li>Предоставляйте текстовые альтернативы для нетекстового контента</li>
          <li>Обеспечивайте субтитры и другие альтернативы для мультимедиа</li>
          <li>Создавайте контент, который можно представить разными способами без потери смысла</li>
          <li>Облегчайте пользователям видеть и слышать контент</li>
        </ul>
        
        <h4>2. Управляемость (Operable)</h4>
        <p>Компоненты интерфейса и навигация должны быть управляемыми.</p>
        <ul>
          <li>Делайте всю функциональность доступной с клавиатуры</li>
          <li>Давайте пользователям достаточно времени для чтения и использования контента</li>
          <li>Не проектируйте контент способом, который вызывает судороги или физические реакции</li>
          <li>Помогайте пользователям навигировать и находить контент</li>
        </ul>
        
        <h4>3. Понятность (Understandable)</h4>
        <p>Информация и управление интерфейсом должны быть понятными.</p>
        <ul>
          <li>Делайте текстовый контент читаемым и понятным</li>
          <li>Делайте так, чтобы веб-страницы появлялись и работали предсказуемым образом</li>
          <li>Помогайте пользователям избегать и исправлять ошибки</li>
        </ul>
        
        <h4>4. Надежность (Robust)</h4>
        <p>Контент должен быть достаточно надежным для интерпретации различными пользовательскими агентами, включая вспомогательные технологии.</p>
        
        <h3>Уровни соответствия</h3>
        
        <p><strong>A (минимальный)</strong> — Базовый уровень доступности</p>
        <p><strong>AA (стандартный)</strong> — Рекомендуемый уровень для большинства сайтов</p>
        <p><strong>AAA (расширенный)</strong> — Высший уровень доступности</p>
        
        <h3>Полезные ресурсы</h3>
        
        <ul>
          <li><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener">WCAG 2.1 Quick Reference</a></li>
          <li><a href="https://www.w3.org/WAI/WCAG22/Understanding/" target="_blank" rel="noopener">Understanding WCAG 2.2</a></li>
          <li><a href="https://webaim.org/standards/wcag/" target="_blank" rel="noopener">WebAIM WCAG Overview</a></li>
        </ul>
        `,
        metaDescription: "Полное руководство по стандартам WCAG для веб-доступности. Принципы, уровни соответствия и практические рекомендации.",
        isPublished: true
      },
      {
        title: "Инструменты тестирования доступности",
        slug: "testing-tools",
        content: `
        <h2>Инструменты для тестирования веб-доступности</h2>
        
        <p>Автоматизированные инструменты помогают выявить многие проблемы доступности, но не заменяют ручное тестирование и тестирование с реальными пользователями.</p>
        
        <h3>Автоматизированные инструменты</h3>
        
        <h4>axe-core</h4>
        <p>Один из самых надежных инструментов для автоматического тестирования доступности.</p>
        <ul>
          <li><strong>Расширения для браузеров:</strong> axe DevTools</li>
          <li><strong>Интеграция:</strong> Jest, Cypress, Playwright</li>
          <li><strong>Преимущества:</strong> Высокая точность, минимум ложных срабатываний</li>
        </ul>
        
        <h4>Lighthouse</h4>
        <p>Встроенный в Chrome инструмент аудита, включающий проверки доступности.</p>
        <ul>
          <li><strong>Доступ:</strong> Chrome DevTools > Lighthouse</li>
          <li><strong>Особенности:</strong> Комплексный аудит производительности и доступности</li>
          <li><strong>Отчеты:</strong> Подробные рекомендации по улучшению</li>
        </ul>
        
        <h4>WAVE (Web Accessibility Evaluation Tool)</h4>
        <p>Визуальный инструмент для оценки доступности веб-страниц.</p>
        <ul>
          <li><strong>Расширение:</strong> Доступно для Chrome и Firefox</li>
          <li><strong>Онлайн версия:</strong> wave.webaim.org</li>
          <li><strong>Особенности:</strong> Визуальная подсветка проблем на странице</li>
        </ul>
        
        <h3>Инструменты для тестирования с клавиатуры</h3>
        
        <h4>Базовая навигация</h4>
        <ul>
          <li><strong>Tab</strong> — переход между интерактивными элементами</li>
          <li><strong>Shift + Tab</strong> — переход назад</li>
          <li><strong>Enter/Space</strong> — активация элементов</li>
          <li><strong>Стрелки</strong> — навигация в группах элементов</li>
          <li><strong>Esc</strong> — закрытие модальных окон</li>
        </ul>
        
        <h3>Скринридеры для тестирования</h3>
        
        <h4>Бесплатные варианты</h4>
        <ul>
          <li><strong>NVDA</strong> — для Windows, бесплатный</li>
          <li><strong>VoiceOver</strong> — встроен в macOS и iOS</li>
          <li><strong>Orca</strong> — для Linux</li>
          <li><strong>TalkBack</strong> — для Android</li>
        </ul>
        
        <h3>Инструменты для проверки цвета и контраста</h3>
        
        <ul>
          <li><strong>WebAIM Contrast Checker</strong> — онлайн проверка контраста</li>
          <li><strong>Colour Contrast Analyser</strong> — десктопное приложение</li>
          <li><strong>Stark</strong> — плагин для Figma и Sketch</li>
        </ul>
        
        <h3>Чек-лист для ручного тестирования</h3>
        
        <ol>
          <li>Проверьте навигацию только с клавиатуры</li>
          <li>Убедитесь, что фокус видим на всех элементах</li>
          <li>Проверьте работу со скринридером</li>
          <li>Протестируйте формы и сообщения об ошибках</li>
          <li>Убедитесь в достаточном контрасте цветов</li>
          <li>Проверьте адаптивность на разных размерах экрана</li>
        </ol>
        `,
        metaDescription: "Обзор лучших инструментов для тестирования веб-доступности: axe-core, Lighthouse, WAVE, скринридеры и методы ручного тестирования.",
        isPublished: true
      },
      {
        title: "Полезные ресурсы по доступности",
        slug: "resources",
        content: `
        <h2>Полезные ресурсы по веб-доступности</h2>
        
        <p>Подборка качественных материалов для изучения и работы с веб-доступностью.</p>
        
        <h3>Официальные стандарты и документация</h3>
        
        <h4>W3C Web Accessibility Initiative (WAI)</h4>
        <ul>
          <li><a href="https://www.w3.org/WAI/" target="_blank" rel="noopener">Главная страница WAI</a> — центральный ресурс по веб-доступности</li>
          <li><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener">WCAG 2.1 Quick Reference</a> — справочник по критериям WCAG</li>
          <li><a href="https://www.w3.org/WAI/tutorials/" target="_blank" rel="noopener">WAI Tutorials</a> — практические руководства</li>
        </ul>
        
        <h3>Образовательные ресурсы</h3>
        
        <h4>WebAIM</h4>
        <p>Некоммерческая организация, предоставляющая комплексные решения для веб-доступности.</p>
        <ul>
          <li><a href="https://webaim.org/articles/" target="_blank" rel="noopener">Статьи WebAIM</a> — глубокие материалы по различным аспектам</li>
          <li><a href="https://webaim.org/resources/" target="_blank" rel="noopener">Ресурсы и инструменты</a></li>
        </ul>
        
        <h4>The A11Y Project</h4>
        <p>Открытое сообщество, делающее веб-доступность более понятной.</p>
        <ul>
          <li><a href="https://www.a11yproject.com/" target="_blank" rel="noopener">Главная страница</a></li>
          <li><a href="https://www.a11yproject.com/checklist/" target="_blank" rel="noopener">Чек-лист доступности</a></li>
        </ul>
        
        <h3>Книги</h3>
        
        <ul>
          <li><strong>"Accessibility for Everyone" by Laura Kalbag</strong> — введение в доступность для дизайнеров и разработчиков</li>
          <li><strong>"Inclusive Design Patterns" by Heydon Pickering</strong> — практические паттерны инклюзивного дизайна</li>
          <li><strong>"Form Design Patterns" by Adam Silver</strong> — создание доступных форм</li>
        </ul>
        
        <h3>Блоги и новости</h3>
        
        <ul>
          <li><a href="https://www.deque.com/blog/" target="_blank" rel="noopener">Deque Blog</a> — новости и исследования в области доступности</li>
          <li><a href="https://www.levelaccess.com/blog/" target="_blank" rel="noopener">Level Access Blog</a> — экспертные статьи</li>
          <li><a href="https://accessibility.blog/" target="_blank" rel="noopener">GOV.UK Accessibility Blog</a> — опыт британского правительства</li>
        </ul>
        
        <h3>Подкасты</h3>
        
        <ul>
          <li><strong>A11y Rules Podcast</strong> — интервью с экспертами по доступности</li>
          <li><strong>13 Letters</strong> — истории людей с ограниченными возможностями в технологиях</li>
        </ul>
        
        <h3>Конференции и события</h3>
        
        <ul>
          <li><strong>CSUN Assistive Technology Conference</strong> — крупнейшая конференция по вспомогательным технологиям</li>
          <li><strong>axe-con</strong> — бесплатная онлайн конференция от Deque</li>
          <li><strong>Inclusive Design 24</strong> — 24-часовая онлайн конференция</li>
        </ul>
        
        <h3>Сообщества</h3>
        
        <ul>
          <li><strong>Web Accessibility Slack</strong> — активное сообщество специалистов</li>
          <li><strong>A11y Twitter</strong> — хэштег #a11y для новостей и дискуссий</li>
          <li><strong>Reddit r/accessibility</strong> — обсуждения и вопросы</li>
        </ul>
        
        <h3>Российские ресурсы</h3>
        
        <ul>
          <li><strong>Центр проблем аутизма</strong> — ресурсы по когнитивной доступности</li>
          <li><strong>РООИ "Перспектива"</strong> — российская организация людей с инвалидностью</li>
          <li><strong>Фонд "Живые сердца"</strong> — проекты по цифровой доступности</li>
        </ul>
        `,
        metaDescription: "Тщательно подобранные ресурсы для изучения веб-доступности: официальные стандарты, образовательные материалы, книги и сообщества.",
        isPublished: true
      }
    ];

    for (const pageData of pagesToCreate) {
      if (!existingSlugs.includes(pageData.slug)) {
        await storage.createPage(pageData);
        console.log(`Created page: ${pageData.title}`);
      } else {
        console.log(`Page already exists: ${pageData.title}`);
      }
    }

    console.log("Pages seeding completed");
  } catch (error) {
    console.error("Error seeding pages:", error);
  }
}