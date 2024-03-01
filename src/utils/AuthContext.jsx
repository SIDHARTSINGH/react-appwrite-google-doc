import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authService from "./authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    //setLoading(false)
    checkUserStatus();
  }, []);

  const loginUser = async (userInfo) => {
    setLoading(true);

    console.log("userInfo", userInfo);

    try {
      //   let response = await account.createEmailSession(
      //     userInfo.email,
      //     userInfo.password
      //   );
      //   let accountDetails = await account.get();

      let response = authService.login(userInfo);
      let accountDetails = authService.getCurrentUser();

      setUser(accountDetails);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const logoutUser = async () => {
    // await account.deleteSession("current");
    authService.logout();
    setUser(null);
  };

  const registerUser = async (userInfo) => {
    // console.log("AuthContext -> registerUser -> userInfo", userInfo);
    setLoading(true);

    try {
      //   let response = await account.create(
      //     ID.unique(),
      //     userInfo.email,
      //     userInfo.password1,
      //     userInfo.name
      //   );
      let response = await authService.createAccount({ ...userInfo });
      //   await account.createEmailSession(userInfo.email, userInfo.password1);
      await authService.login({ ...userInfo });
      //   let accountDetails = await account.get()
      let accountDetails = await authService.getCurrentUser();

      setUser(accountDetails);
      navigate("/");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const checkUserStatus = async () => {
    try {
      let accountDetails = await authService.getCurrentUser();
      setUser(accountDetails);
    } catch (error) {}
    setLoading(false);
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    registerUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

//Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
