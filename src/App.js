import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/home/Login';
import Registration from './pages/home/Registration';
import PrivateRoute from './routes/PrivateRoute';
import User from './pages/User.jsx';
import QuotesPage from './pages/home/QuotesPage.jsx';
import MyAssets from './components/MyAssets.jsx';
import RechargePage from './pages/home/RechargePage.jsx';
import UsdtPage from './pages/home/UsdtPage.jsx';
import EthPage from './pages/home/EthPage.jsx';
import UsdcPage from './pages/home/UsdcPage.jsx';
import AdminPage from './pages/home/AdminPage.jsx';
import Tasks from './pages/home/Tasks.jsx';
import AdminLogin from './pages/home/AdminLogin.jsx';
import PrivateAdminRoute from './routes/PrivateAdminRoute.js';
import './App.css';
import Withdraw from './pages/home/Withdraw.jsx';
import UsdtPageWithdraw from './pages/home/UsdtPageWithdraw.jsx';
import EthPageWithdraw from './pages/home/EthPageWithdraw.jsx';
import UsdcPageWithdraw from './pages/home/UsdcPageWithdraw.jsx';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Registration />} />
     
      
      {/* Для защищенных маршрутов используем PrivateRoute */}
      <Route
        path='/user/:id'
        element={
          <PrivateRoute>
            <User />
          </PrivateRoute>
        }
        
      />
       {/* Защищенный маршрут для /quotation */}
      <Route
        path='/quotation'
        element={
          <PrivateRoute>
            <QuotesPage />  {/* Страница Quotes, доступна только авторизованным */}
          </PrivateRoute>
        }
      />
      <Route
        path='/assets'
        element={
          <PrivateRoute>
            <MyAssets /> 
          </PrivateRoute>
        }
      />
      <Route
        path='/assets/deposit'
        element={
          <PrivateRoute>
            <RechargePage /> 
          </PrivateRoute>
        }
      />
      <Route
        path='/assets/usdt'
        element={
          <PrivateRoute>
            <UsdtPage /> 
          </PrivateRoute>
        }
      />
      <Route
        path='/assets/eth'
        element={
          <PrivateRoute>
            <EthPage /> 
          </PrivateRoute>
        }
      />
      <Route
        path='/assets/usdc'
        element={
          <PrivateRoute>
            <UsdcPage /> 
          </PrivateRoute>
        }
      />
      <Route
        path='/2707200004032004/'
        element={
          <PrivateRoute>
            <AdminPage /> 
          </PrivateRoute>
        }
      />
      <Route
        path='/270720000403200420012015/'
        element={
          <PrivateRoute>
            <AdminLogin /> 
          </PrivateRoute>
        }
      />
       <Route
        path='/tasks/'
        element={
          <PrivateRoute>
            <Tasks /> 
          </PrivateRoute>
        }
      />
      <Route
        path='/assets/withdraw'
        element={
          <PrivateRoute>
            <Withdraw /> 
          </PrivateRoute>
        }
      />
      <Route
        path='/assets/withdraw/usdt'
        element={
          <PrivateRoute>
            <UsdtPageWithdraw /> 
          </PrivateRoute>
        }
      />
      <Route
        path='/assets/withdraw/eth'
        element={
          <PrivateRoute>
            <EthPageWithdraw /> 
          </PrivateRoute>
        }
      />
      <Route
        path='/assets/withdraw/usdc'
        element={
          <PrivateRoute>
            <UsdcPageWithdraw /> 
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
