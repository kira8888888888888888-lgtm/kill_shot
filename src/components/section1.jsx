import React from 'react'
import { Link } from 'react-router';
import Section2 from './section2';
import Section3 from './section3';
import Section4 from './section4';
import './section1.css';


function Section1() {
  return (
    <>
        <div className='home_section1_parent'>
            <div className='home_section1_small_div'>
                <h1 className='home_section1_h1'>HappyBit</h1>
                <h2 className='home_section1_h2'>Most Trusted</h2>
                <p className='home_section1_p'>Cryptocurrency Gaming Platform</p>
                <Link className='home_section1_sign_up_btn' to={"/login"}>Sign up now</Link>
            </div>
        </div>
        <Section2/>
        <Section3/>
        <Section4/>
    </>
  )
}

export default Section1
