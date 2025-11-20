import React from 'react'
import section3_leftside_icon from '../images/section3_leftside_icon.png'
import './section3.css';
const steps = [
  {
    className: 'section3_p_1',
    text: 'Deposit to Account',
  },
  {
    className: 'section3_p_2',
    text: 'Deposit into your cryptocurrency account to start gaming. You can choose from various payment methods.',
  },
  {
    className: 'section3_p_3',
    text: 'After Payment',
  },
  {
    className: 'section3_p_4',
    text: 'After payment, you should receive your wallet code and wait a maximum of 24 hours so that our moderators can review your request and add money to your account.',
  },
  {
    className: 'section3_p_5',
    text: 'Start Gaming',
  },
  {
    className: 'section3_p_6',
    text: 'When the wallet has at least 100$ then you will receive a task where you can get money',
  },
];


function Section3() {
      return (
        <div className='section3_bg_div'>
          <h2 className='section3_h2'>Start your first Game in just a few steps.</h2>
          <div className='section3_small_div'>
              <div>
                  <img src={section3_leftside_icon} alt="" />
              </div>
              <div>
                  {steps.map((step, index) => (
                    <p key={index} className={step.className}>
                      {step.text}
                    </p>
                ))}
              </div>
          </div>
        </div>
      )
}

export default Section3
