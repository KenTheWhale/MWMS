import DashDefault from "./view/dashboard"
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";


function App() {
   return(
   <Router>
    <Routes>
        <Route path="/dashboard" element={<DashDefault/>}/>
    </Routes>
   </Router>
   )
}

export default App
