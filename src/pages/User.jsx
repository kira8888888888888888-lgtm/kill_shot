import React from 'react';
import { useAuth } from '../context/AuthContext';
import userIcon from '../images/userIcon.png';
import LoadingSpinner from '../components/LoadingSpinner';
import UserBottomNavigation from '../components/UserBottomNavigation';
import BlockchainSection from '../components/BlockchainSection';
import CarouselBox from '../components/CarouselBox';
import CryptoTable from '../components/CryptoTable';
import '../components/cryptoTable.css';
import './home/user.css';


function User() {

  const { user, logout,loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner/>// пока данные не пришли
  }
  if (!user) {
    return <div>User not found. Please login.</div>;
  }
  
  return (
    <div style={{paddingBottom:'8%'}} >
      <div className='user_header-parent_div'>
        <nav to={`user/${user?.id}`} className='user_header-right_div'>
          <img className='user_header-right_div_img' src={userIcon} alt="User Icon" />
          <h2 className='user_header-right_div_user_email'>{user?.userEmail || user?.email}</h2>
        </nav>
        <div>
          <button className='user_header-parent_div_button' onClick={logout}>Logout</button>
        </div>
      </div>
      <CarouselBox/>
      <BlockchainSection/>
      <CryptoTable />
      <UserBottomNavigation user={user}/>
    </div>
  );
}

export default User;
