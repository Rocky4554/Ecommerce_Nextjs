
import React, { useState, useRef } from "react";
//please read with patience code is messy here

const DualRangeSlider = ({ min = 0, max = 100000, priceRange, onPriceChange }) => {
  const [dragging, setDragging] = useState(null);
  const sliderRef = useRef(null);

  const minValue = priceRange[0];
  const maxValue = priceRange[1];


  const toPercent = (val) => ((val - min) / (max - min)) * 100;


  const getClientX = (e) => {
    return e.touches ? e.touches[0].clientX : e.clientX;
  };

 
  const startDrag = (e, type) => {
    e.preventDefault();
    setDragging(type);

    const move = (e) => {
      if (!sliderRef.current) return;
      
      const clientX = getClientX(e);
      const rect = sliderRef.current.getBoundingClientRect();
      let percent = (clientX - rect.left) / rect.width;
      percent = Math.min(Math.max(percent, 0), 1);
      const value = Math.round(min + percent * (max - min));

      if (type === "min") {
        onPriceChange([Math.min(value, maxValue), maxValue]);
      } else {
        onPriceChange([minValue, Math.max(value, minValue)]);
      }
    };

    const stop = () => {
      setDragging(null);
     
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", stop);
    };

    
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", stop);
  };

  return (
    <div className="mt-6 bg-neutral-100 p-4 rounded-sm">
      <h3 className="text-lg font-medium mb-2">Price</h3>

      <div className="text-sm mb-4">
        <span>Range: </span>
        ${minValue.toFixed(2)} - ${maxValue.toFixed(2)}
      </div>

      <div className="relative h-6 flex items-center">
        <div
          ref={sliderRef}
          className="w-full h-2 bg-gray-300 rounded-full relative"
        >
         
          <div
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{
              left: `${toPercent(minValue)}%`,
              width: `${toPercent(maxValue) - toPercent(minValue)}%`,
            }}
          />

          
          <div
            className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-2 border-white shadow touch-none"
            style={{
              left: `${toPercent(minValue)}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            onMouseDown={(e) => startDrag(e, "min")}
            onTouchStart={(e) => startDrag(e, "min")}
          />

          
          <div
            className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-2 border-white shadow touch-none"
            style={{
              left: `${toPercent(maxValue)}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            onMouseDown={(e) => startDrag(e, "max")}
            onTouchStart={(e) => startDrag(e, "max")}
          />
        </div>
      </div>
    </div>
  );
};

export default DualRangeSlider;
