import React, { useState } from 'react';
import './footer.css';
import UserBottomNavigation from './UserBottomNavigation';

export default function Footer() {
    const footerText = [
        {
            text1: 'About',
            text2: 'Announcements',
            text3: 'Service Agreement'
        },
        {
            text1: 'Support',
            text2: 'Support center',
            text3: 'Online Customer Service',
            text4: 'Suggestions and Feedback',
        },
        {
            text1: 'Service',
            text2: 'Download',
            text3: 'Listing application',
            text4: 'Privacy Statement',
        }
    ];

    // State to track which item is open (array of booleans)
    const [openIndexes, setOpenIndexes] = useState(Array(footerText.length).fill(false));

    const toggleItem = (index) => {
        setOpenIndexes(prev => {
            const updated = [...prev];
            updated[index] = !updated[index]; // Toggle the clicked item
            return updated;
        });
    };

    return (
        <footer>
            <div className='footer_parent_div'>
                {/* Left static content */}
                <div className='footer_small_left_div' style={{ borderRight: '0.1px solid #ffffff26', paddingRight: '2%' }}>
                    <div className='footer_small_left_div_logo' style={{ display: "flex", alignItems: 'center' }}>
                        <p className='footer_small_left_div_p'>HappyBit</p>
                    </div>
                    <p className='footer_copytight'>CopyRight @2018-2025 HappyBit All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
