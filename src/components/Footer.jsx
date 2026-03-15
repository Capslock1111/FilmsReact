import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">CinemaHub</h3>
            <p className="footer-description">
              Ваш гид в мире кино. Открывайте новые фильмы, сохраняйте любимые и
              делитесь впечатлениями.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Навигация</h4>
            <ul className="footer-links">
              <li>
                <a href="/" className="footer-link">
                  Главная
                </a>
              </li>
              <li>
                <a href="/movies" className="footer-link">
                  Фильмы
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  О проекте
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Контакты</h4>
            <ul className="footer-links">
              <li>Email: info@cinemahub.com</li>
              <li>Телефон: +7 (999) 123-45-67</li>
              <li>Адрес: Москва, Киностудия 1</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} CinemaHub. Все права защищены.
          </p>
          <p>Сделано с ❤️ для киноманов</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
