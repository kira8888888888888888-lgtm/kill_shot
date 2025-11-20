import React from 'react';
import homeIcon from '../images/home.png';
import marketIcon from '../images/market.png';
import tradeIcon from '../images/trade.png';
import assetsIcon from '../images/assets.png';
import { NavLink } from 'react-router-dom';


function UserBottomNavigation({user}) {
    
    const user_bottom_navigation_parent_div_data = [
        {
            img:homeIcon,
            alt:'Home Icon',
            text:'Home',
            navigationLink:`/user/${user?.id}`
        },
        {
            img:marketIcon,
            alt:'Market Icon',
            text:'Quotes',
            navigationLink:'/quotation'
        },
        {
            img:tradeIcon,
            alt:'Trade Icon',
            text:'Tasks',
            navigationLink:'/tasks'
        },
        {
            img:assetsIcon,
            alt:'Assets Icon',
            text:'Assets',
            navigationLink:'/assets'
        },
    ]

  return (
    <div className='user_bottom_navigation_all_parent_div'>
        <div className='user_bottom_navigation_parent_div'>
        {user_bottom_navigation_parent_div_data?.map((item,index)=> (
            <NavLink  className={({ isActive }) => isActive ? 'active-link' : 'user_bottom_navigation_link'} to={item?.navigationLink} key={index}>
                <img className='user_bottom_navigation_img' src={item?.img} alt={item?.alt} />
                <p className='user_bottom_navigation_link_p'>{item?.text}</p>
            </NavLink>
        ))}
        </div>
    </div>
  )
  
}

export default UserBottomNavigation;
