import '@/styles/banner.css'

const images = [
  '/icons/Dr_Guillermo1.jpg',
  '/icons/Dra_Dilian.jpeg',
  '/icons/Dr_Guillermo2.jpg',
  '/icons/Dra_Dilian2',
  '/icons/Dr_Guillermo3.jpg',
  '/icons/Dra_Dilian3.jpg',
  '/icons/Dr_Diego7.jpeg',
  '/icons/Dr_Guillermo4.jpg',
  '/icons/Dra_Dilian4.jpg',
  '/icons/Dr_Guillermo5.jpg',
  '/icons/Dra_Dilian5.jpg',
  '/icons/Dr_Guillermo6.jpg',
  '/icons/Dra_Dilian6',
  '/icons/Dr_Diego1.jpeg',
];

export const BannerCarousel = () => {
  return (
    <div className="banner">
      <div className="banner-track">
        {/* duplicamos las imágenes para efecto infinito */}
        {[...images, ...images].map((src, index) => (
          <img key={index} src={src} alt="logo" />
        ))}
      </div>
    </div>
  );
};