import { useFavouritesState } from "../store/favouritesStore";
import MovieCard from "../components/MovieCard";
import "./Favourites.css";
function Favourites() {
    const { favourites } = useFavouritesState();
    const { clearFavourites } = useFavouritesState();
    return (
        <div className="favorites-page">
            <div className="container">
                <div className="cont">
                    <h1>Избранное</h1>
                    <button className="clean" onClick={clearFavourites}>Очистить все</button>
                </div>

                {favourites.length === 0 ? (
                    <p>Нет избранных фильмов</p>
                ) : (
                    <div className="movies-grid">
                        {favourites.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
export default Favourites;