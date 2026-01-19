import useAuth from "../hooks/useAuth";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const Body = () => {
  useAuth();

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default Body;
