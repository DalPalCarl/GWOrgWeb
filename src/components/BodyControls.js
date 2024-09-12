import { UserAuth } from "../context/AuthContext";
import { doc, setDoc, getDocs, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/fbConfig";
import { useState, useEffect } from "react";

const BodyControls = () => {

    const { user, filterButtonPress, importButtonPress, coll, setFilter } = UserAuth();
    const [file, setFile] = useState();
    const [isConfirming, setIsConfirming] = useState(false);
    const [authDelete, setAuthDelete] = useState(false);
    const fileReader = new FileReader();
    let fileCheck = null;

    const importModal = document.getElementById('importModal');
    if (importModal) {importModal.addEventListener('hide.bs.modal', () => {
        setIsConfirming(false);
    });}

    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {deleteModal.addEventListener('hide.bs.modal', () => {
        setAuthDelete(false);
    });}

    const submitForm = async(e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const load = Object.fromEntries(formData);
        const qDoc = await getDoc(doc(db, user.uid.toString(), load.id));
        if(qDoc.exists()) {
            console.log("Already Exists");
        }
        else{
            const entryData = {
                id: load.id,
                title: load.title,
                description: load.description,
                status: (load.btnradio) ? load.btnradio : '0'
            }
            addEntry(entryData);
            setFilter('-1');
        }
    }

    useEffect(() => {
        if(user === null){
            setFile();
        }
    }, [user]);

    async function addEntry(entry) {
        await setDoc(doc(db, user.uid.toString(), entry.id), entry);
    }

    function pressedFilter(status) {
        filterButtonPress(status);
    }

    async function importFile(e) {
        e.preventDefault();

        if(file){
            fileReader.onload = function (e){
                if(fileCheck !== file){
                    const text = e.target.result;
                    importButtonPress(text);
                    fileCheck = file;

                }
            }
            fileReader.readAsText(file);
        }
        setFile();
    }
    
    async function deleteAllEntries() {
        const gd = await getDocs(coll);
        gd.forEach((doc) => {
            handleDeleteEntry(doc.id);
            console.log("Deleted: ", doc.id);
        });
        setAuthDelete(false);
        filterButtonPress('0');
        filterButtonPress('0');
    }

    async function handleDeleteEntry(id) {
        await deleteDoc(doc(db, user.uid.toString(), id));
    }

    return (
        <div className="mx-auto col oswald">
            { user?.uid ? 
                <div>
                    <div className="row m-3">
                        <h2 className="p-2 text-center">Hello, {user.email}!</h2>
                    </div>
                    <div className="m-3">
                        <div className="btn-group justify-content-center d-flex mb-2" role="group" aria-label="filterButtons">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => {pressedFilter('0')}}>Loaded</button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => {pressedFilter('1')}}>Unloaded</button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => {pressedFilter('2')}}>Unmarked</button>
                        </div>
                        <div className="justify-content-center col d-flex gap-4">
                            
                            <button type='button' className="btn btn-primary p-2 btn-sm" data-bs-toggle='modal' data-bs-target='#addModal'>
                                <i className="bi bi-clipboard-plus"></i> Add New Item
                            </button>
                            <button type='button' className="btn btn-danger p-2 btn-sm" data-bs-toggle='modal' data-bs-target='#deleteModal'>
                                <i className="bi bi-trash-fill"></i> Delete Entries
                                </button>
                            <button className="btn btn-dark p-2 btn-sm" data-bs-toggle='modal' data-bs-target='#importModal'>
                                <i className="bi bi-upload"></i> Import from File
                            </button>
                        </div>
                    </div>
                    <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Item</h5>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={submitForm}>
                                        <div className="mb-3">
                                            <label className="form-label">Item ID</label>
                                            <input className="form-control" name="id" required></input>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Item name(s)</label>
                                            <input className="form-control" name="title" required></input>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Description (optional)</label>
                                            <input className="form-control" name="description"></input>
                                        </div>
                                        <div className="btn-group btn-group-lg mb-3" role="group" aria-label="truck radio label">
                                            <input type="radio" className="btn-check" name="btnradio" value={0} id="btnradio1" autoComplete="off"/>
                                            <label className="btn btn-outline-success" htmlFor="btnradio1">On Truck</label>

                                            <input type="radio" className="btn-check" name="btnradio" value={1} id="btnradio2" autoComplete="off"/>
                                            <label className="btn btn-outline-danger" htmlFor="btnradio2">Off Truck</label>

                                            <input type="radio" className="btn-check" name="btnradio" value={2} id="btnradio3" autoComplete="off"/>
                                            <label className="btn btn-outline-secondary" htmlFor="btnradio3">Mark Unused</label>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss='modal'>Cancel</button>
                                            <button type="submit" className="btn btn-primary" data-bs-dismiss='modal'>Add Item</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div className="modal fade" id="importModal" tabIndex="-1" aria-labelledby="importModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Import CSV File</h5>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={(e) => importFile(e)}>
                                        <div className="row g-3">
                                            <input type="file"
                                                id="csvFileInput"
                                                accept=".csv"
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                            {(file) ? 
                                                <button className="btn btn-primary" type="button" onClick={() => setIsConfirming(true)} disabled={isConfirming ? true : false}>Import to Database</button>
                                            : <div></div>
                                            }
                                            {isConfirming ? 
                                                <div>
                                                    <p>WARNING This will delete and replace all entries in the current list</p>
                                                    <button className="btn btn-primary" type="submit" data-bs-dismiss='modal'>Confirm</button>
                                                </div>
                                            : <div></div>
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Delete All Entries</h5>
                                </div>
                                <div className="modal-body">
                                    {authDelete ? 
                                        <div>
                                            <p><em>Warning:</em> This will delete all entries in your database.</p>
                                            <button type="button" className="btn btn-danger" data-bs-dismiss='modal' onClick={() => deleteAllEntries()}>Confirm Delete</button>
                                        </div> : <button type="button" className="btn btn-danger" onClick={() => setAuthDelete(true)}>Delete</button>}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>:
                <h2 className="p-2">Please log in to start organizing</h2>
            }
        </div>
    );
}

export default BodyControls;