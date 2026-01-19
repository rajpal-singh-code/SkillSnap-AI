import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserFromStorage } from "../utils/userSlice";

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserFromStorage());
  }, [dispatch]);
};

export default useAuth;
