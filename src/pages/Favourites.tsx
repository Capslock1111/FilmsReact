import { useFavouritesState } from "../store/favouritesStore";
import MovieCard from "../components/MovieCard";
import "./Favourites.css";
function Favourites() {
    const { favourites } = useFavouritesState();
    return (
        <div className="favorites-page">
            <div className="container">
                <h1>Избранное</h1>
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