import { useContext, createContext, useEffect, useState } from 'react';
import { 
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, db} from '../firebase/fbConfig';
import { addDoc, collection } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [coll, setColl] = useState({});

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    }

    const logOut = () => {
        signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setColl(currentUser?.uid ? collection(db, currentUser.uid) : {});
            console.log("User: ", user);
        });

        return () => {
            unsubscribe();
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ googleSignIn, user, logOut, coll }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}