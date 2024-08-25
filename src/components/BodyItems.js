import { db } from "../firebase/fbConfig";
import { UserAuth } from "../context/AuthContext";
import { collection } from "firebase/firestore";
import { useState } from "react";

let loadedList = [];

const BodyItems = () => {
    
    const { user, coll } = UserAuth();
    const [currentModal, setCurrentModal] = useState({id: "0", description: "example", status: '0'});
    const [isEditing, setIsEditing] = useState(false);

    // const mainModal = document.getElementById('exampleModal');
    // mainModal.addEventListener('show.bs.modal', () => {
    //     setCurrentModal()
    // })

    async function genNums(num) {
        let temp = [];
        for(let i = 0; i <= num; i++){
            temp = [...temp];
        }
        console.log(temp);
        return temp;
    }

    function setModal(id) {
        setCurrentModal({id: id, description: "example", status: '0'});
    }

    const ls = [1,2,3,4,5,6,7,8];

    return(
        <div className="container">
            {ls.map((n) => 
                <button key={n.toString()} 
                    className="btn btn-success p-3 m-1" 
                    type="button" 
                    data-bs-toggle='modal' 
                    data-bs-target="#exampleModal"
                    onClick={() => setModal(n.toString())}>
                    {n}
                </button>
            )}
            
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                {isEditing ? 
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">{currentModal.id}</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body mx-auto">
                                <p className="mb-5">{currentModal.description}</p>
                                <div className="btn-group" role="group" aria-label="Basic ass example">
                                    <button className="btn btn-success">Load</button>
                                    <button className="btn btn-danger">Unload</button>
                                    <button className="btn btn-secondary">Mark Unused</button>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" onClick={() => setIsEditing(false)}>Save changes</button>
                            </div>
                        </div>
                    </div> : 
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">{currentModal.id}</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body mx-auto">
                                <p className="mb-5">{currentModal.description}</p>
                                <div className="btn-group" role="group" aria-label="Basic ass example">
                                    <button className="btn btn-success">Load</button>
                                    <button className="btn btn-danger">Unload</button>
                                    <button className="btn btn-secondary">Mark Unused</button>
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
        
    );
    // return (
    //     <div className="container page-body">
    //         <div class="dropdown">
    //             <button class="btn btn-success dropdown-toggle btn-lg" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    //                 Dropdown
    //             </button>
    //             <ul class="dropdown-menu">
    //                 <li><h1 className="dropdown-item-text fs-5">Sample</h1></li>
    //                 <li><hr className="dropdown-divider" /></li>
    //                 <li><p className="dropdown-item-text">Description</p></li>
    //                 <li><hr className="dropdown-divider" /></li>
    //                 <li><button class="dropdown-item btn-primary" type="button">Load</button></li>
    //                 <li><button class="dropdown-item" type="button">Unload</button></li>
    //                 <li><button class="dropdown-item" type="button">Mark Unused</button></li>
    //             </ul>
    //         </div>
    //     </div>
    // );
}

export default BodyItems;