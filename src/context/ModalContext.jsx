import { createContext, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    const value = {
        selectedMovie,
        isModalOpen,
        openModal,
        closeModal,
    };

    return (
        <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
    )
}