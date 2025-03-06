import SignUp from "./signUp";
import Homepage from "./homePage";
import Lawyerpage from "./lawyerPage";
import Notfound from "./notFound";
import { Routes,Route } from "react-router-dom";

function App() {
  
  return (
    <>
    <Routes>
      <Route path="" Component={SignUp}/>
      <Route path="homepage" Component={Homepage}/>
      <Route path="lawyerpage/:username" Component={Lawyerpage}/>
      <Route path="*" Component={Notfound}/>
    </Routes>
    </>
  )
}

export default App
