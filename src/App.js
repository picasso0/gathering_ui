import 'font-awesome/css/font-awesome.min.css';
import './assets/css/app.css';
import DashboardPage from './pages/DashboardPage';
import Profiles from './pages/Profiles'
import Workers from './pages/Workers'
import UploadUserdata from './pages/UserdataUpload'
import Userdata from './pages/Userdata'
import LoginPage from './pages/auth/LoginPage'
import ResetPassword from './pages/auth/ResetPassword';
import ProfilePage from './pages/profile/ProfilePage';
import ChangePasswordPage from './pages/profile/ChangePasswordPage';
import UserPreferencesPage from './pages/profile/UserPreferencesPage'
import AdminBlankPage from './pages/AdminBlankPage';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
        <Router>
            <Routes>
                <Route exact path='/' element={<DashboardPage/>} />
                <Route exact path='/login' element={<LoginPage/>} />
                <Route exact path='/profiles' element={<Profiles/>} />
                <Route exact path='/workers' element={<Workers/>} />
                <Route exact path='/userdata' element={<Userdata/>} />
                <Route exact path='/upload_userdata' element={<UploadUserdata/>} />
                <Route exact path='/preferences' element={<UserPreferencesPage/>} />
                {/* <Route exact path='/change-password' element={<ChangePasswordPage/>} /> */}
                {/* <Route exact path='/reset-password' element={<ResetPassword/>} /> */}
                {/* <Route exact path='/profiles' element={<ProfilePage/>} /> */}
                <Route exact path='/blank-page' element={<AdminBlankPage/>} />
            </Routes>  
        </Router>
    )
}

export default App;
