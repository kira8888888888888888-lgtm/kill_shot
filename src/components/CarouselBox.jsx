import React, { useState, useEffect } from "react";

const images = [
  "https://mmtto.pro/upload/default/52946924084400128/20250416/0/303231892528517120.png",
  "https://static.vecteezy.com/system/resources/thumbnails/035/328/945/small/ai-generated-bitcoin-cryptocurrency-coin-on-the-background-of-the-financial-chart-and-graph-photo.jpg",
  "https://wallpapers.com/images/hd/crypto-bitcoin-with-speed-motion-graphics-9bfrqo5li82lokxf.jpg",
  "https://wallpapers.com/images/hd/glowing-green-bitcoin-tzotf1rswnwcb04o.jpg"
];

const CarouselBox = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // меняем картинку каждые 3 секунды

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width:'93%',
        height: "140px",
        backgroundImage: `url(${images[index]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "8px",
        transition: "background-image 0.5s ease-in-out",
        margin:'4% auto'
      }}
    />
  );
};

export default CarouselBox;
