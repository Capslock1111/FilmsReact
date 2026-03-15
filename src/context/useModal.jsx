import { useContext } from "react"
import { ModalContext, ModalProvider } from './ModalContext'

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal должен использоваться внутри ModalProvider');
    }
    return context;
}
