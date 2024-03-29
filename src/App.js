/*
 * @copyRight by md sarwar hoshen.
 */
import AppRoutes from "../src/routes";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import AuthProvider from './context/AuthContext';
//
function App() {
  return (
    <>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </>
  );
}

export default App;
