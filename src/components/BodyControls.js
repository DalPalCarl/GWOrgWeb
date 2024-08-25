import { UserAuth } from "../context/AuthContext";


const BodyControls = () => {
    const { user } = UserAuth();
    

    return (
        <div className="container">
            <div className="row justify-content-center m-3 gap-2">
                { user?.displayName ? <h2 className="p-2 flex-grow-1">Hello, {user.displayName}!</h2> : <h2 className="p-2 flex-grow-1">Please log in to start organizing</h2>}
            </div>
            <div className="justify-content-center m-3 gap-4">
                <form className="col-sm-4 m-2" role="search">
                    <input className="form-control" type="search" placeholder="Search" aria-label="search"></input>
                </form>
                <div className="col-sm-4 btn-group m-2" role="group" aria-label="filterButtons">
                    <button className="btn btn-secondary btn-sm">Loaded</button>
                    <button className="btn btn-secondary btn-sm">Unloaded</button>
                </div>
                <div className="col-sm-4 d-flex gap-4 m-2">
                    <button className="btn btn-primary p-2 btn-sm">Add New Item</button>
                    <button className="btn btn-info p-2 btn-sm">Import from File</button>
                </div>
            </div>
        </div>
    );
}

export default BodyControls;