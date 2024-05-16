/*
 * @copyRight by md sarwar hoshen.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { PublicPost, Post, Delete } from "../services";
import apiEndpoints from "../config/apiEndpoints";
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
          location.pathname == "/verification"||
          location.pathname == "/chnage-password"
        ) {
          navigate("/home", { replace: true });
        } else {
          navigate(from, { replace: true, state: { search: location.search } });
        }
      } else {
        setIsAuthenticated(false);
        setUserType("");
        if (
          location.pathname == "/signin" ||
          location.pathname == "/" ||
          location.pathname == "/signup" ||
          location.pathname == "/verification"||
          location.pathname == "/chnage-password"
        )
          navigate(from, { replace: true, state: { search: location.search } });
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
      const resp = await PublicPost(apiEndpoints.auth.login, params);
      //console.log("resp:::", resp);
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
        console.log("resp",resp);
        if(resp?.status && resp?.status === "not-verified"){
          navigate("/verification", { state: { showOtpMsg: true , msg: resp?.error } });
          return ;
        }
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
      //console.log("resp", resp);
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
