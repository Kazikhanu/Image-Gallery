import React, { useEffect } from 'react';
import ImageGallery from './ImageGallery';

const App = () => {
  useEffect(() => {
    const { timing } = window.performance;
    console.log('Load Time:', timing.loadEventEnd - timing.navigationStart);
  }, []);

  return (
    <div>
      <h1>Image Gallery</h1>
      <ImageGallery />
    </div>
  );
}
export default App;

