/*
 * @copyRight by md sarwar hoshen.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { PublicPost, Post, Delete } from "../api";
import { apiUrl } from "../config/appConfig";
import { setItem, getItem, removeItem } from "../utils";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingView from "../components/Loading";
//
const AuthContext = createContext();
//
const AuthProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user_type, setUserType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  //
  //Get Store Usr
  useEffect(() => {
    loadUsr();
  }, []);
  //loadUsr
  const loadUsr = async () => {
    try {
      // setLoading(true);
      const user = await getItem("usr");
      console.log("user:::", user);
      if (user?.user_type) {
        setIsAuthenticated(true);
        setUserType(user.user_type);
        if(user.pas_cg_rq){
          return navigate("/password-change", { replace: true });
        }
        if (
          location.pathname == "/signin" ||
          location.pathname == "/" ||
          location.pathname == "/signup" ||
          location.pathname == "/verification"
        ) {
          navigate("/home", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setIsAuthenticated(false);
        setUserType("");
        if (
          location.pathname == "/signin" ||
          location.pathname == "/" ||
          location.pathname == "/signup" ||
          location.pathname == "/verification"
        )
          navigate(from, { replace: true });
        else navigate("/signin", { replace: true });
      }
    } catch (err) {
      // console.error('err:', err);
    } finally {
      setLoading(false);
    }
  };
  if (isLoading) {
    return <LoadingView />;
  }
  //signIn
  const signIn = async (params) => {
    try {
      setAuthError("");
      const resp = await PublicPost(`${apiUrl()}/auth/login`, params);
      console.log("resp:::", resp);
      if (resp.success) {
        const { data } = resp;
        setIsAuthenticated(true);
        setItem("usr", {
          email: data.email,
          user_type: data.user_type,
          isVerified: data.isVerified,
          pas_cg_rq: data.pas_cg_rq,
          isAuthenticated: true,
        });
        setItem("apat", data.token);
        setUserType(resp.data?.user_type);
        setLoading(false);
        if(data.pas_cg_rq){
          return navigate("/password-change", { replace: true });
        }
        navigate("/home", { replace: true });
      } else {
        setAuthError(resp?.error);
        setIsAuthenticated(false);
        return;
      }
    } catch (err) {}
  };
  //signOut
  const signOut = async () => {
    try {
      const resp = await Delete(`/auth/logout`);
      console.log("resp", resp);
      if (resp.success) {
        setIsAuthenticated(false);
        setUserType("");
        setItem("usr", null);
        setItem("apat", null);
        navigate("/signin", { replace: true });
      }
    } catch (err) {}
  };
  //
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        token,
        isAuthenticated,
        user_type,
        signIn,
        authError,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
//
export default AuthProvider;
//
//
export const useAuthContext = () => useContext(AuthContext);

/*
 * @copyRight by md sarwar hoshen.
 */

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { PublicPost, Delete, Post } from "../api";
// import LoadingView from "../components/Loading";
// import { apiUrl } from "../config/appConfig";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setUser, clearAat } from "../redux/reducers/authReducer";
// import {getItem, setItem} from '../utils';

// const AuthContext = createContext();
// //
// const AuthProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const [isLoading, setLoading] = useState(true);
//   const [token, setToken] = useState("");
//   const [authError, setAuthError] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user_type, setUserType] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname;
//   const user = useSelector((state) => state.auth);
//   console.log("user", user);
//   //
//   //Get Store Usr
//   useEffect(() => {
//     loadUsr();
//   }, []);
//   //loadUsr
//   const loadUsr = async () => {
//     try {
//       // setLoading(true);
//       console.log("user:::111", user);
//       if (user) {
//         await setItem('apat', user.apat)
//         setIsAuthenticated(true);

//         setUserType(user.user_type);
//         if (location.pathname == "/signin" || location.pathname == "/")
//           navigate("/home", { replace: true });
//         else navigate(from, { replace: true });
//       } else {
//         setIsAuthenticated(false);
//         setUserType("");
//         navigate("/signin", { replace: true });
//       }
//     } catch (err) {
//       // console.error('err:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   if (isLoading) {
//     return <LoadingView />;
//   }
//   //signIn
//   const signIn = async (params) => {
//     try {
//       setAuthError("");
//       const resp = await PublicPost(`${apiUrl()}/auth/login`, params);
//       console.log("resp:::", resp);
//       if (resp.success) {
//         //
//         const { data } = resp;
//         dispatch(
//           setUser({
//             user_id: data.email,
//             user_type: data.user_type,
//             isVerified: data.isVerified,
//             pass_cng: data.pas_cg_rq,
//             isAuthenticated: true,
//             apat: data.token,
//           })
//         );
//         setIsAuthenticated(true);
//         setUserType(resp.data?.user_type);
//         setLoading(false);
//         navigate("/home", { replace: true });
//       } else {
//         setAuthError(resp.message ? resp.message : "");
//         setIsAuthenticated(false);
//         return;
//       }
//     } catch (err) {}
//   };
//   //signOut
//   const signOut = async () => {
//     try {
//       console.log("called");
//       const resp = await Delete(`/auth/logout`);
//       console.log("resp",resp);

//       if (resp.status == 'success') {
//         setIsAuthenticated(false);
//         clearAat();
//         setUserType();
//       }
//     } catch (err) {}
//   };
//   //
//   return (
//     <AuthContext.Provider
//       value={{
//         isLoading,
//         token,
//         isAuthenticated,
//         user_type,
//         signIn,
//         authError,
//         signOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
// //
// export default AuthProvider;
// //
// //
// export const useAuthContext = () => useContext(AuthContext);
