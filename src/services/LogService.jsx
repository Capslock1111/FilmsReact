const LogService = {
  // Основные методы компонента-сервиса, которые мы будем вызывать в разных компонентах

  // логирование действия и связанных данных
  info: (action, data = {}) => {
    console.log(`${action}`, data);
  },

  // логирование успешного действия
  success: (action, data = {}) => {
    console.log(`✅ ${action}`, data);
  },
  // логирование ошибок
  error: (action, data = {}) => {
    console.error(`${action}`, data);
  },

  // логирование поискового запроса
  search: (query) => {
    console.log(`Поиск: "${query}"`);
  },

  // логирование навигации: перехода по страницам
  navigation: (page) => {
    console.log(`Переход на: ${page}`);
  },

  // логирование нажатия на кнопку
  click: (buttonName) => {
    console.log(`Клик: ${buttonName}`);
  },
};

export default LogService;
