import React from 'react';
import Section1 from './section1';
import { useState,useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import UserBottomNavigation from './UserBottomNavigation';

function Body() {

    return (
            <div>
                <Section1/>
                <UserBottomNavigation/>
            </div>
    )
}

export default Body
