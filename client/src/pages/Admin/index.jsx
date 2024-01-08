import { useEffect, useState } from "react";
import Gallery from "../../components/Gallery";
import AdminActions from "./AdminActions";
import MovieFormModal from "./MovieFormModal";
import axios from 'axios'

export const DisplayTypes = {
    Movies: 'movies',
    TvShows: 'tvshows',
    Comments: 'comments',
};

const AdminPage = () => {
    const [displayType, setDisplayType] = useState(DisplayTypes.Movies);
    const [movies, setMovies] = useState([]);
    const [tvShows, setTVShows] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage] = useState(20);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const onCardClick = (card) => {
        setSelectedCard(card);
        openModal();
    };

    const fetchMovies = async (page = 1) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_YTS_MOVIES}?page=${page}&limit=${itemsPerPage}`);
            const movies = response.data.data.movies;
            setMovies(movies);
            setActivePage(page);
            setTotalPages(Math.ceil(response.data.data.movie_count / itemsPerPage));
        } catch (error) {
            console.error('Error fetching movies:', error.message);
            throw error; // You can handle the error according to your needs
        }
    };

    const fetchTvShows = async () => {
        const options = {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`
            }
        };
        try {
            const response = await fetch(`${import.meta.env.VITE_TMDB_POPULAR_TV_SHOWS}`, options);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setTVShows(data.results);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMovies();
        fetchTvShows();
    }, [])

    return (
        <div style={{ marginTop: 50, height: 'auto' }}>
            <AdminActions displayType={displayType} setDisplayType={setDisplayType} />

            <div style={{ marginTop: 20 }}>
                {displayType === DisplayTypes.Movies ? (
                    <>
                        <Gallery data={movies} displayType={DisplayTypes.Movies}
                            onCardClick={onCardClick}
                            activePage={activePage}
                            totalPages={totalPages}
                            onPageChange={fetchMovies}
                        />
                        <MovieFormModal
                            selectedCard={selectedCard}
                            modalOpen={modalOpen}
                            closeModal={closeModal}
                        />
                    </>

                ) : (
                    <Gallery data={tvShows} displayType={DisplayTypes.TvShows} onCardClick={onCardClick} />
                )}
            </div>
        </div>
    )
}

export default AdminPage