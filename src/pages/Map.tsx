import React from 'react';

const Map: React.FC = () => {
  return (
    <div className="w-full h-screen bg-green-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl aspect-video border-4 border-green-500 shadow-lg">
        <iframe
          src="https://www.google.com/maps/d/u/0/embed?mid=1cfo93Ljmbr6xWkzpB8pRy85yHsqzeW4&femb=1&ll=34.980093402769896%2C-18.105869749999997&z=3"
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default Map;
