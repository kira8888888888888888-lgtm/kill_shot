import { Link } from 'react-router-dom';
import React from 'react';
import rightside_sms_icon from "../images/rightside_sms_icon.png";
import rightside_usa_icon from "../images/home_header_usa_flag.png";
// import BitcoinCash from '../images/BitcoinCash.png';
import G0009_Bitcoin_Purple from '../images/G0009-Bitcoin-Purple.webp';
import "./header.css";
const navItems = [
    { name: 'Futures', to: '#' },
    { name: 'Markets', to: '#' },
    { name: 'Assets', to: '#' },
    { name: 'System', to: '#' },
];
const rightNavItems = [
    {
        label: 'Login',
        to: '/login',
        className: 'home_header_navigation_rightside_link_a',
    },
    {
        label: 'Register',
        to: '/register',
        className: 'home_header_navigation_rightside_register',
    },
    {
        label: 'Contact Us',
        to: '#',
        className: 'home_header_navigation_rightside_link',
        icon: rightside_sms_icon,
        liClass: 'home_header_navigation_rightside_link_contactus_li',
    },
    {
        label: 'English',
        to: '#',
        className: 'home_header_navigation_rightside_link',
        icon: rightside_usa_icon,
        iconClass: 'home_header_navigation_rightside_link_english_logo',
        liClass: 'home_header_navigation_rightside_link_contactus_li',
    },
    {
        label: 'Download',
        to: '#',
        className: 'home_header_navigation_rightside_link_download',
    },
];

function Header() {
    return (
        <nav className='home_header_navigation'>
            <div className='home_header_navigation_leftside'>
                <ul className='home_header_navigation_leftside_ul'>
                    <li>
                        <Link to='/' className='home_header_navigation_leftside_link_first'>
                            <img width='32px' height='32px' style={{borderRadius:'50%',marginTop:'10%'}} src={G0009_Bitcoin_Purple} />
                        </Link>
                    </li>
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link to={item.to} className='home_header_navigation_leftside_link'>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='home_header_navigation_rightside'>
                <ul className='home_header_navigation_rightside_ul'>
                    {rightNavItems?.map((item, index) => (
                    <li key={index} className={item.liClass || ''}>
                        {item.icon && (
                            <figure>
                                <img
                                    src={item.icon}
                                    alt=""
                                    className={item.iconClass || ''}
                                />
                            </figure>
                        )}
                        <Link to={item.to} className={item.className}>
                            {item.label}
                        </Link>
                    </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

export default Header
