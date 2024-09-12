import { useContext, createContext, useEffect, useState } from 'react';
import { 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from '../firebase/fbConfig';
import { collection, query, limit, getDocs, setDoc, doc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [coll, setColl] = useState(null);
    const [filter, setFilter] = useState('-1');
    const [csvFile, setCsvFile] = useState('');

    const generateNewColl = async (newUser) => {
        const docData = {
            id: "Example",
            title: "[SAMPLE ENTRY]",
            description: "Welcome to GWOrg! Please delete this entry",
            status: '2'
        }
        await setDoc(doc(db, newUser.user.uid.toString(), docData.id), docData);
        setUser(newUser.user);
    }
    const handleCollCheck = async (userToBe) => {
        const q = query(collection(db, userToBe.user.uid.toString()), limit(1));
        const checkDoc = await getDocs(q);
        var doesExist = false;
        checkDoc.forEach((d) => {
            if(d.exists()){
                setUser(userToBe.user);
                doesExist = true;
            }
        });
        if(!doesExist){generateNewColl(userToBe);}
    }

    const signIn = async (email, password) => {
        const signedUser = await signInWithEmailAndPassword(auth, email, password)
            .catch((err) => {
                console.log(err);
        });
        handleCollCheck(signedUser);
        setFilter('-1');
    }

    const createUser = async (email, password) => {
        const createdUser = await createUserWithEmailAndPassword(auth, email, password)
            .catch((err) => {
                console.log(err);
        });
        handleCollCheck(createdUser);
        setFilter('-1');
    }

    const logOut = async () => {
        await signOut(auth)
        .then(() => {
            console.log("sign out successful");
        })
        .catch((err) => {
            console.log(err);
        });
        setCsvFile('');
        setFilter('-1');
    }

    const filterButtonPress = (status) => {
        if(status === filter){
            setFilter('-1');
        }
        else{
            setFilter(status);
        }
    }

    const importButtonPress = (csvData) => {
        setCsvFile(csvData);
    }
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("user changed");
            if (currentUser !== null){
                setUser(currentUser);
                setColl(collection(db, currentUser.uid.toString()));
            }
            else{
                setUser(currentUser);
                setColl(null);
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ signIn, createUser, user, logOut, coll, filterButtonPress, filter, importButtonPress, csvFile, setFilter}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}