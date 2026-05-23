import { RawKinopoiskMovie, Movie } from '../types/movie';
export class ApiService {
  public baseUrl: string;
  public apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_KINOPOISK_API_KEY;
    // this.apiKey = "25f9d95e-7f29-41e5-9350-236e9ac357fa";
    this.baseUrl = "https://kinopoiskapiunofficial.tech/api/v2.2";
  }

  /**
   * Получить топ фильмов
   * @param {string} type - Тип запроса (ТОПа): TOP_100_POPULAR_FILMS, TOP_250_BEST_FILMS, TOP_AWAIT_FILMS
   * @param {number} page - параметр запроса: страница
   * @returns {Promise<Array>} - что получаем на выходе
   */
  async getTopFilms(type: string = "TOP_250_BEST_FILMS", page = 1,): Promise<Movie[]> {
    try {
      const url = `${this.baseUrl}/films/top?type=${type}&page=${page}`;
      console.log("📡 Запрос к Kinopoisk:", url);

      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();

      return data.films.map((film: RawKinopoiskMovie) => this.formatFilm(film));
    } catch (error) {
      console.error("❌ Ошибка при получении топ фильмов:", error);
      return this.getFallbackMovies();
    }
  }

  /**
   * Поиск фильмов
   * @param {string} keyword - Ключевое слово - параметр
   * @param {number} page - Страница - параметр
   * @returns {Promise<Array>}
   */
  async searchFilms(keyword: string, page = 1) {
    try {
      const url = `${this.baseUrl}/films?keyword=${encodeURIComponent(keyword)}&page=${page}`;

      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.items.map((film: RawKinopoiskMovie) => this.formatFilm(film));
    } catch (error) {
      console.error("❌ Ошибка поиска:", error);
      return [];
    }
  }

  /**
   * Получить фильмы по году
   * @param {number} year - Год
   * @param {number} page - Страница
   * @returns {Promise<Array>}
   */
  async getFilmsByYear(year: number, page = 1) {
    try {
      const url = `${this.baseUrl}/films?yearFrom=${year}&yearTo=${year}&page=${page}`;

      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.items.map((film: RawKinopoiskMovie) => this.formatFilm(film));
    } catch (error) {
      console.error("❌ Ошибка по году:", error);
      return [];
    }
  }

  /**
   * Получить детали фильма по ID
   * @param {number} filmId - ID фильма
   * @returns {Promise<Object>}
   */

  formatFilm(movie: RawKinopoiskMovie): Movie {
    return {
      // Основные поля
      id: movie.filmId,
      title: movie.nameRu,
      originalTitle: movie.nameEn,
      year: movie.year,
      rating: movie.rating,

      // Для нашего приложения
      duration: `${movie.filmLength} мин`,
      ageRating: movie.ratingAgeLimits ? movie.ratingAgeLimits + "+" : "0+",
      description: movie.description || "Нет описания",

      // Жанры и страны
      genres: movie.genres ? movie.genres.map((g) => g.genre) : ["Не указано"],
      countries: movie.countries ? movie.countries.map((c) => c.country) : [],

      // Постер
      poster: movie.posterUrl || movie.posterUrlPreview || "/placeholder.jpg",
      posterPreview: movie.posterUrlPreview,

      // Дополнительно
      type: movie.type,
      isSeries: movie.serial || false,
    };
  }


  getFallbackMovies() {
    console.log("🔄 Использую fallback данные");
    return [
      {
        id: 435,
        title: "Зеленая миля",
        year: 1999,
        rating: 9.1,
        duration: "189 мин",
        ageRating: "16+",
        description:
          "Пол Эджкомб — начальник блока смертников в тюрьме «Холодная гора»...",
        genres: ["драма", "фэнтези", "криминал"],
        poster: "https://kinopoiskapiunofficial.tech/images/posters/kp/435.jpg",
        isSeries: false,
      },
      {
        id: 326,
        title: "Побег из Шоушенка",
        year: 1994,
        rating: 9.1,
        duration: "142 мин",
        ageRating: "16+",
        description:
          "Бухгалтер Энди Дюфрейн обвинен в убийстве собственной жены и ее любовника...",
        genres: ["драма"],
        poster: "https://kinopoiskapiunofficial.tech/images/posters/kp/326.jpg",
        isSeries: false,
      },
      {
        id: 448,
        title: "Форрест Гамп",
        year: 1994,
        rating: 9.0,
        duration: "142 мин",
        ageRating: "16+",
        description:
          "От лица главного героя Форреста Гампа, слабоумного безобидного человека...",
        genres: ["драма", "комедия", "мелодрама"],
        poster: "https://kinopoiskapiunofficial.tech/images/posters/kp/448.jpg",
        isSeries: false,
      },
    ];
  }

  /**
   * Заголовки для запросов
   */
  getHeaders() {
    return {
      "X-API-KEY": this.apiKey,
      "Content-Type": "application/json",
    };
  }
}

export const apiService = new ApiService();
