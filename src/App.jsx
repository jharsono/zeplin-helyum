import { useAuth0 } from '@auth0/auth0-react';
import './App.css';

function App() {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  return (
    <>
      <h1>Zeplin Helyum</h1>
      <div className="card">
      </div>
    </>
  )
}

export default App
