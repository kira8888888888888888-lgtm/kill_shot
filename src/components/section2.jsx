import React from 'react';
import section_2_icon from '../images/section_2_icon.png';
import BlockchainSection from './BlockchainSection';
import './section2.css';


function Section2() {
  return (
    <>
        <div className='section2_parent_div'>
            <div className='section2_lefside_small_div'>
                <img src={section_2_icon} alt="" />
                <p className='section2_leftside_small_div_p'>HappyBit EX demonstrates commitment to legal and transparent operations through MSB registration</p>
            </div>
            <div className='section2_rightside_small_div'>
                <p className='section2_rightside_small_div_p'>More&#10093;</p>
            </div>
        </div>
        <BlockchainSection/>
    </>
  )
}

export default Section2
