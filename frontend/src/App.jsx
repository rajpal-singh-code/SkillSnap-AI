import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Body from "./components/Body";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Chat from "./components/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Welcome />} />

            
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            
            <Route
              path="chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />

            
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;