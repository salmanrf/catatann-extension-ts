import { Loader2 } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import CtnnLogo from "src/assets/images/catatann-logo.png";
import { User } from "src/lib/types/users.model";
import { createClientAppTab, startAuthFlow } from "src/lib/utils/auth";
import { UserContainer } from "src/popup/containers/UserContainer";

function MainContainer() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  async function loadUser() {
    try {
      setLoading(true);

      const user = await startAuthFlow();

      if (user) {
        setUser({ ...user });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function redirectToClientApp() {
    createClientAppTab({ active: true });
  }

  return (
    <div id="ctnn-popup-container" className="container-fluid">
      <header id="ctnn-logo">
        <img src={CtnnLogo} alt="logo" />
      </header>
      <main id="ctnn-main">
        {loading && (
          <div className="loading-placeholder">
            <Loader2
              className={"ctnn-icon-spinning"}
              width={36}
              height={36}
              color="hsl(0, 0%, 70%)"
            />
          </div>
        )}
        {!loading && !Boolean(user) && (
          <div className="main-section-container">
            <button className="btn btn-dark" onClick={redirectToClientApp}>
              Login
            </button>
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
