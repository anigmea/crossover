import React from 'react';
import styled from "styled-components";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Pagination } from 'swiper/modules';
import Carousel1 from "../assets/images/Carousel1.jpeg";
import Carousel2 from "../assets/images/Carousel2.jpeg";
import Carousel3 from "../assets/images/Carousel3.jpeg";
import Carousel4 from "../assets/images/Carousel4.jpg";
import { Autoplay } from 'swiper/modules';




const IMAGE = styled.img`
height: 86vh;
width: 100%;

@media (max-width: 768px) {
  height:  50vh;
}`;

const Carousel = () => {
    return (
        
      <Swiper
        autoHeight={true}
        modules={[Pagination, Autoplay]}
        autoplay={{
            delay: 2500, // Delay between transitions (in milliseconds)
            disableOnInteraction: false, // Keep autoplaying even after user interaction
        }}
        spaceBetween={0}
        slidesPerView={1}
      >
        <SwiperSlide><IMAGE src={Carousel1}></IMAGE></SwiperSlide>
        <SwiperSlide><IMAGE src={Carousel2}></IMAGE></SwiperSlide>
        <SwiperSlide><IMAGE src={Carousel3}></IMAGE></SwiperSlide>
        {/* <SwiperSlide><IMAGE src={Carousel4}></IMAGE></SwiperSlide> */}
        ...
      </Swiper>
    );
  };

  export default Carousel;