import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ImageGallery.css'; // Импортируем файл стилей

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loadingTime, setLoadingTime] = useState(null);
  const imageRefs = useRef([]);
  let observer; // Объявляем переменную observer здесь

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('https://api.unsplash.com/photos/random?count=10&client_id=l3jBvI2iSruy5Mi0bTQPPEybhDmG3ySERb1qttW4TLo');
        const data = response.data;
        setImages(data);

        // Вычисляем время загрузки изображений
        const loadTime = performance.now() - startTime;
        setLoadingTime(loadTime);
      } catch (error) {
        console.error('Ошибка при получении данных из API Unsplash:', error);
      }
    };

    const startTime = performance.now(); // Записываем время начала загрузки изображений
    fetchImages();

    // Убеждаемся, что мы отключаем IntersectionObserver, когда компонент размонтируется
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const lazyLoadImage = (entries, observer) => { // Здесь тоже была ошибка - параметр observer в функции
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          img.setAttribute('src', src);
          img.onload = () => img.classList.add('loaded'); // Добавляем класс 'loaded' после загрузки изображения
          observer.unobserve(img);
        }
      });
    };

    observer = new IntersectionObserver(lazyLoadImage, { rootMargin: '0px 0px 100px 0px' }); // Используем объявленную переменную

    // Обновляем наблюдатель для всех изображений при изменении списка изображений
    imageRefs.current.forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [images]); // Запускаем useEffect при изменении списка изображений

  // Выбираем первые 5 изображений из массива данных
  const selectedImages = images.slice(0, 10);

  return (
    <div>
      {loadingTime && <p>Время загрузки изображений: {loadingTime.toFixed(2)} миллисекунд</p>}
      <div className="image-gallery">
        {selectedImages.map((image, index) => (
          <div key={image.id} className="image-container">
            <img
              ref={el => imageRefs.current[index] = el}
              data-src={image.urls.small}
              alt={image.alt_description}
              className="lazy-load-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;