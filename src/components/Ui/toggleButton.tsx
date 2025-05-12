import { FaBars, FaTimes } from 'react-icons/fa';
import '@/styles/navbar.css';

export default function ToggleBtn({ navbarOpen, handleToggle }: { navbarOpen: boolean, handleToggle: () => void }) {
    return (
        <button
            className={`icon d-lg-none text-black ${navbarOpen ? 'rotate' : ''}`}
            onClick={(event) => {
                event.preventDefault();
                handleToggle();
            }}
        >
            {navbarOpen ? <FaTimes /> : <FaBars />}
        </button>
    );
}