
import { UserAuth } from "../context/AuthContext";

const ThemeButton = () => {

    const {isDark, setIsDark} = UserAuth();
    return(
        <button className="btn btn-secondary" onClick={() => setIsDark(!isDark)}>
            <i className={isDark ? "bi bi-sun-fill" : "bi bi-moon-fill"} />
        </button>
    );
}

export default ThemeButton;