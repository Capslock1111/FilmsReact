const LogService = {
  // Основные методы компонента-сервиса, которые мы будем вызывать в разных компонентах

  // логирование действия и связанных данных
  info: (action: string, data = {}) => {
    console.log(`${action}`, data);
  },

  // логирование успешного действия
  success: (action: string, data = {}) => {
    console.log(`✅ ${action}`, data);
  },
  // логирование ошибок
  error: (action: string, data = {}) => {
    console.error(`${action}`, data);
  },

  // логирование поискового запроса
  search: (query: string) => {
    console.log(`Поиск: "${query}"`);
  },

  // логирование навигации: перехода по страницам
  navigation: (page: string) => {
    console.log(`Переход на: ${page}`);
  },

  // логирование нажатия на кнопку
  click: (buttonName: string) => {
    console.log(`Клик: ${buttonName}`);
  },
};

export default LogService;
