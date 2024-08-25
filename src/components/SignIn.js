import { UserAuth } from "../context/AuthContext";

const SignIn = () => {

    const { googleSignIn, user, logOut } = UserAuth();

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (e) {
            console.log(e);
        }
    }

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <nav className="navbar sticky-top">
            <div className="container">
                { user?.displayName ? 
                    <button className="btn btn-secondary" onClick={handleSignOut}>Sign Out</button> :
                    <button className='btn btn-primary' onClick={handleGoogleSignIn}>Sign In</button>
                }
                
            </div>
        </nav>
    );
}

export default SignIn;