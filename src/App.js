import "./App.css";
import React from "react";
import { NavLink, Outlet, useNavigation } from 'react-router-dom';
// import RemoteAppModule from "./module/AppModule";
// import RemoteExtModule from "./modules/ExternalModule";
// import StandaloneModule from "./modules/StandaloneModule";

function App() {
  const navigation = useNavigation();
  return (
    <>
      <div id="sidebar">
        <h1>React Navigation</h1>
        <nav>
          <ul>
            <li>
              <NavLink to={`products`} className={({ isActive, isPending }) => isActive
                    ? "active"
                    : isPending
                      ? "pending"
                      : ""
                }
              >
                <>
                  Products
                </>
              </NavLink>
            </li>
            <li>
              <NavLink to={`contact`} className={({ isActive, isPending }) => isActive
                    ? "active"
                    : isPending
                      ? "pending"
                      : ""
                }
              >
                <>
                  Contact
                </>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail" className={
        navigation.state === "loading" ? "loading" : ""
      }>
        <Outlet />
      </div>
    </>
  );
}

export default App;


//             <div className="remotes-col">
//               <RemoteExtModule></RemoteExtModule>
//             </div>
//             <div className="remotes-col">
//               <StandaloneModule></StandaloneModule>
//             </div>