import './App.css';
import logo from './GWOrgLogo2.png';

import SignIn from './components/SignIn.js';
import BodyControls from './components/BodyControls.js';
import BodyItems from './components/BodyItems.js';
import ThemeButton from './components/ThemeButton.js';
import { UserAuth } from './context/AuthContext.js';

function App() {
  const {isDark} = UserAuth();

  return(
    <div className="screen">
      <nav className={isDark ? "navbar navbar-dark navbar-expand justify-content-around" : "navbar navbar-expand justify-content-around"}>
        <a href="/" className="navbar-brand"><img src={logo} className="logo" alt="GWOrg" /></a>
        <ThemeButton/>
        <SignIn />
      </nav>
      <div className={isDark ? 'container page-body page-body-dark' : 'container page-body'}>
        <div className="container page-body-header col-md-8">
          <BodyControls />
        </div>
        <div className={isDark ? 'container page-body page-body-dark col-md-10' : 'container page-body col-md-10'}>
          <BodyItems />
        </div>
      </div>
      <div className="footer d-flex justify-content-center m-3">
        <p className="oswald">GWOrg <em>v1.0.3</em> - {new Date().getFullYear()}</p>
      </div>
    </div>
    
  );
}

export default App;