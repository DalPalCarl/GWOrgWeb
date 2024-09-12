import { UserAuth } from "../context/AuthContext";

const SignIn = () => {

    const { user, logOut } = UserAuth();

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
                    null
                }
                
            </div>
        </nav>
    );
}

export default SignIn;