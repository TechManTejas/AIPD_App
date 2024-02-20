import { useEffect, useRef, useState } from "react";
import First from "../../Images/slideshow_1.gif"
import Second from "../../Images/slideshow_2.gif"
import Third from "../../Images/slideshow_3.jpeg"
import Fourth from "../../Images/slideshow_4.jpeg"
import Five from "../../Images/slideshow_5.gif"

import './slideshow.css'

const colors = ["#0088FE", "#00C49F", "#0088FE", "#00C49F", "#0088FE"];
const content = [<img src={First} />, <img src={Second} />, <img src={Third} />, <img src={Fourth} />, <img src={Five} />];
const delay = 6000;

export default function Slideshow({ setCarouselShown }) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => {
        setIndex((prevIndex) => {
          // Check if prevIndex is at the end of the colors array
          if (prevIndex === colors.length - 1) {
            // If yes, set rotation to 1
            setCarouselShown(true);
            return 0;
          } else {
            // If not, increment the index
            return prevIndex + 1;
          }
        });
      },
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className="slideshow w-screen">
      <div
        className="slideshowSlider w-full h-full"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {colors.map((backgroundColor, index) => (
          <div
            className="slide w-full h-full"
            key={index}
          >
            <div className="w-full flex justify-center h-[500px]">
              {content[index]}
            </div>
          </div>
        ))}
      </div>

      <div className="slideshowDots">
        {colors.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}