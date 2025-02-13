import { db } from "../firebase/fbConfig";
import { UserAuth } from "../context/AuthContext";
import { query, getDocs, where, onSnapshot, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import '../App.css';

let loadedList = [];

const BodyItems = () => {
    
    const {signIn, createUser, user, coll, filter, csvFile, setFilter } = UserAuth();
    const [currentList, setCurrentList] = useState([]);

    const [currentModal, setCurrentModal] = useState({id: "0", title: "exampleTitle", description: "example", status: "0"});
    const [isEditing, setIsEditing] = useState(false);
    const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

    const [editId, setEditId] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');

    const [creatingUser, setCreatingUser] = useState(false);
    
    let collectionUnsubscribe = null;

    const collListener = async () => {
        loadedList = [];
        collectionUnsubscribe = onSnapshot(coll, (D) => {
            var tempList = [...loadedList];
            D.docChanges().forEach((change) => {
                //console.log(change);
                if(change.type === 'added'){
                    tempList.push(change.doc.data());
                }
                else if(change.type === 'modified'){
                    var modIndex = tempList.findIndex((item) => item.id === change.doc.data().id);
                    tempList.splice(modIndex, 1, change.doc.data());
                }
                else if(change.type === 'removed') {
                    var delIndex = tempList.findIndex((item) => item.id === change.doc.data().id);
                    tempList.splice(delIndex, 1);
                }
            });
            tempList.sort((a,b) => collator.compare(a.id, b.id));
            loadedList = [...tempList];
            setCurrentList([...loadedList]);
        }, (err) => {
            console.log(err);
        });
    }

    async function wipeDatabase() {
        const gd = await getDocs(coll);
        gd.forEach((doc) => {
            handleDeleteEntry(doc.id);
        });
        await setDoc(doc(db, user.uid.toString(), user.uid.toString()), {id: user.uid.toString()});
        var csvRows = csvFile.slice(csvFile.indexOf('\n') + 1).split('\n');
        let rowArray = [];
        csvRows.forEach((row) => {
            var rowData = row.split(",");
            rowArray.push(rowData);
        });
        addEntries(rowArray);
    }

    async function addEntry(data) {
        await setDoc(doc(db, user.uid.toString(), data.id), data);
    }

    async function addEntries(entriesArray) {
        entriesArray.forEach((entry) => {
            const entryData = {
                id: entry[0],
                title: entry[1],
                description: entry.slice(2).join(','),
                status: '0'
            }
            addEntry(entryData);
            handleDeleteEntry(user.uid.toString());
        });
        setFilter('-1');
    }

    useEffect(() => {
        if(csvFile !== ''){
            wipeDatabase();
        }
    }, [csvFile]);

    useEffect(() => { // Initialize Collection Listener
        if (user !== null){ //When user is signed in (collection doesn't exist)
            collListener();
            setCreatingUser(false);
        }
        else{  //When user isn't signed in (collection is present)
            if (collectionUnsubscribe){
                collectionUnsubscribe();
                setCurrentList([]);
            }
        }
    }, [user]);

    async function filterEntries() {
        var tempList = [];
        const q = query(coll, where("status", "==", filter));
        const snap = await getDocs(q);
        snap.forEach((doc) => {
            tempList.push(doc.data());
        });
        tempList.sort((a,b) => collator.compare(a.id, b.id));
        setCurrentList([...tempList]);
    }


    useEffect(() => {
        if(filter === '-1'){
            setCurrentList(loadedList);
        }
        else{
            filterEntries();
        }
    }, [filter]);

    const mainModal = document.getElementById('itemModal');
    if (mainModal) {mainModal.addEventListener('hide.bs.modal', () => {
        setIsEditing(false);
    });}

    function setModal(entry) {
        setEditId(entry.id);
        setEditTitle(entry.title);
        setEditDesc(entry.description);
        setCurrentModal({id: entry.id, title: entry.title, description: entry.description, status: entry.status});
    }

    const submitForm = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const load = Object.fromEntries(formData);
        console.log(load);

        const entryData = {
            id: load.id,
            title: load.title,
            description: load.description
        }

        if(load.id !== currentModal.id){ //Handles when the ID is changed (i.e. we must delete the entry, and rewrite )
            handleDeleteEntry(currentModal.id);
            handleUpdateId(entryData);
        }
        else if(load.title !== currentModal.title || load.description !== currentModal.description){
            handleUpdate(entryData);
        }
    }

    async function handleUpdate(data) {
        await updateDoc(doc(db, user.uid.toString(), currentModal.id), data);
    }

    async function handleUpdateId(data) {
        await setDoc(doc(db, user.uid.toString(), data.id), {
            id: data.id,
            title: data.title,
            description: data.description,
            status: currentModal.status
        });
    }

    async function handleDeleteEntry(id) {
        await deleteDoc(doc(db, user.uid.toString(), id));
    }

    async function changeStatus(newStatus) {
        await setDoc(doc(db, user.uid.toString(), currentModal.id), { status: newStatus }, { merge: true });
    }

    return(
        <div className="justify-content-center row oswald">
            <div className="pb-4 col-md-8 justify-content-center row">
                <h4 className="text-center oswald">{user?.uid ? "Entries" : ""}</h4>
                {user?.uid ?
                    currentList.map((entry, index) =>
                        <div className="input-group text-wrap justify-content-center mb-3 p-2">
                            <div className={"input-group-text col-3 fs-3 text-wrap text-break " + (entry.status === "0" ? "btn-success id-bg-on" : entry.status === "1" ? "btn-danger id-bg-off" : "btn-dark id-bg-un")}>{entry.id}</div>
                            <button key={(entry.id + index)} 
                                id={entry.id}
                                className={"btn p-3 col-9 " + (entry.status === "0" ? "btn-success" : entry.status === "1" ? "btn-danger" : "btn-secondary")}
                                type="button"
                                data-bs-toggle='modal' 
                                data-bs-target="#itemModal"
                                onClick={() => setModal(entry)}>
                                <h5 className="text-wrap text-start">{entry.title}</h5>
                            </button>
                        </div>
                    ) : null
                }
                
                <div className="modal fade" id="itemModal" tabIndex="-1" aria-labelledby="itemModalLabel" aria-hidden="true">
                    {isEditing ? 
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={submitForm}>
                                    <div className="modal-header gap-2">
                                        <input className="modal-title fs-5 form-control" name="id" value={editId} onChange={(c) => {setEditId(c.target.value)}} aria-label="idLabel"></input>
                                        <input className="modal-title fs-5 form-control " name="title" value={editTitle} onChange={(c) => {setEditTitle(c.target.value)}} aria-label="titleLabel"></input>
                                    </div>
                                    <div className="modal-body">
                                        <input className="mb-5 form-control text-wrap" name="description" value={editDesc} onChange={(c) => {setEditDesc(c.target.value)}} aria-label="descLabel"></input>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" 
                                            className="btn btn-secondary" 
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditId(currentModal.id);
                                                setEditTitle(currentModal.title);
                                                setEditDesc(currentModal.description);}}>Cancel</button>
                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                                        <button type="button" 
                                            className="btn btn-danger"
                                            data-bs-dismiss='modal'
                                            onClick={() => {
                                                handleDeleteEntry(currentModal.id);
                                            }} >Delete Entry</button>
                                    </div>
                                </form>
                            </div>
                        </div> : 
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header d-flex flex-col gap-2">
                                    <h1 className="badge bg-primary fs-2 d-flex" id="modalIdLabel">{currentModal.id}</h1>
                                    <h1 className="fs-2 d-flex">{currentModal.title}</h1>
                                </div>
                                <div className="modal-body d-flex flex-wrap">
                                    <p className="mb-5 p-2 text-wrap text-break d-block w-100">{currentModal.description}</p>
                                    <div className="btn-group btn-group-lg d-block" role="group" aria-label="Basic example">
                                        <button type="submit" className="btn btn-success" data-bs-dismiss="modal" onClick={() => changeStatus('0')}>Load</button>
                                        <button type="submit" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => changeStatus('1')}>Unload</button>
                                        <button type="submit" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => changeStatus('2')}>Mark Unused</button>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Item</button>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                        }
                    </div>

                </div>
        </div>
        
    );
}

export default BodyItems;