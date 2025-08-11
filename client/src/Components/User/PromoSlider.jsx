import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importar imágenes desde la carpeta "assets"
import promo1 from "../../Assents/images/promo1.jpg";
import promo2 from "../../Assents/images/promo2.jpg";
import promo3 from "../../Assents/images/promo3.jpg";

const imagenes = [promo1, promo2, promo3];

const PromoSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
      };
    
  return (
    <Slider {...settings}>
      {imagenes.map((imagen, index) => (
        <div key={index} style={{ textAlign: "center" }}>
          <img src={imagen} alt={`Promo ${index + 1}`} style={{ width: "100%", height: "500px", objectFit: "cover" }} />
        </div>
      ))}
    </Slider>
  )
}

export default PromoSlider