import Body from '../../components/Body';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

import React from 'react';


function Home() {
    const { loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />
  }
    return (
            <div className={loading ? '' : 'all_home-header_parent_bg'}>
                <Header/>
                <Body/>
                <Footer/>
            </div>
    )
}

export default Home
