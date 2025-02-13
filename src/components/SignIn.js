import { UserAuth } from "../context/AuthContext";
import GoogleButton from 'react-google-button';

const SignIn = () => {

    const { googleSignIn, user, logOut } = UserAuth();

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <nav className="navbar sticky-top oswald">
            <div className="container">
                { user?.uid ? 
                    <button className="btn btn-secondary" onClick={() => handleSignOut()}>Sign Out</button> :
                    <GoogleButton onClick={() => googleSignIn()}/>
                }
                
            </div>
        </nav>
    );
}

export default SignIn;