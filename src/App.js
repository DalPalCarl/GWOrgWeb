import './App.css';
import logo from './GWOrgLogo2.png';

function App() {
  return(
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container ms-3">
        <a href="/" className="navbar-brand col"><img src={logo} className="logo" alt="some shit" /></a>
        <div className='container col'></div>
        <div className='container col'>
          <button className='btn '></button>
        </div>
        
      </div>
    </nav>
  );
}

export default App;