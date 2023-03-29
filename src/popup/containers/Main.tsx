import { Loader2 } from "lucide-preact";
import { useState } from "preact/hooks";
import CtnnLogo from "src/assets/images/catatann-logo.png";
import { UserContainer } from "src/popup/containers/UserContainer";

function MainContainer() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  return (
    <div id="ctnn-popup-container" className="container-fluid">
      <header id="ctnn-logo">
        <img src={CtnnLogo} alt="logo" />
      </header>
      <main id="ctnn-main">
        {loading && (
          <div className="loading-placeholder">
            <Loader2 width={36} height={36} color="hsl(0, 0%, 70%)" />
          </div>
        )}
        {loading && !Boolean(user) && (
          <div className="main-section-container">
            <button className="btn btn-dark">Login</button>
          </div>
        )}
        {user && <UserContainer user={user} />}
        {user && (
          <div className="main-section-container">
            <button className="btn btn-dark">Catatann Client</button>
          </div>
        )}
      </main>
    </div>
  );
}

export const Main = <MainContainer />;
