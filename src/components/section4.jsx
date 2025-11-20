import React from 'react';
import eos_fel_10 from "../images/ eos_fel_ 10.png";
import eos_rose_11 from "../images/ eos_rose_11.png";
import litecoin_rises from "../images/ litecoin_rises_10.png";
import cardano_rises from "../images/ cardano_rises_10.png";
import CarouselBox from './CarouselBox';
import './section4.css';


const section4_eos_datas = [
    {
        img:eos_fel_10,
        name:'EOS fell 10%',
        className:'section_4_img_1',
    },
    {
        img:eos_rose_11,
        name:'EOS rose 11%',
        className:'section_4_img_2',
    },
    {
        img:litecoin_rises,
        name:'Litecoin rises 10%',
        className:'section_4_img_3'
    },
    {
        img:cardano_rises,
        name:'Cardano rises 10%',
        className:'section_4_img_4'
    }
]

const section4_aboutus_texts = [

    {
        text:"Please read this before playing. We want to warn you that this will not make you rich.This is done solely so that you can play and enjoy the game.But it can close in an instantthus, we inform you that by playing you agree.",
        className:"section4_aboutus_p",
    },
    
]


const Section4 = () => {
    return (
        <>
            <div className='section_4_second_part_parent_div'>
            <div className='section_4_second_part_small_div'>
            <h2 className='section_4_second_part_h2'>About US</h2>
                {section4_aboutus_texts?.map((item,index)=>(
                    <p className={item.className} key={index}>{item.text}</p>
                ))}
            </div>
            </div>
            <CarouselBox/>
        </>
    )
}

export default Section4
