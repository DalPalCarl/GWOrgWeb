import './App.css';
import logo from './GWOrgLogo2.png';

import SignIn from './components/SignIn.js';
import BodyControls from './components/BodyControls.js';
import BodyItems from './components/BodyItems.js';

function App() {

  return(
    <div className="screen">
      <nav className="navbar navbar-expand">
        <a href="/" className="navbar-brand"><img src={logo} className="logo" alt="GWOrg" /></a>
        <SignIn />
      </nav>
      <div className='container page-body'>
        <div className="container page-body-header justify-content-center d-flex">
          <BodyControls />
        </div>
        <div className='container page-body'>
          <BodyItems />
        </div>
      </div>
      <div className="footer d-flex justify-content-center m-3">
        <p className="">GWOrg - {new Date().getFullYear()}</p>
      </div>
    </div>
    
  );
}

export default App;