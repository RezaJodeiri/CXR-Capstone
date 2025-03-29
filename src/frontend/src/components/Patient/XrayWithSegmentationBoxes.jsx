import React, { useRef, useState, useEffect } from "react";

export const XrayWithSegmentationBoxes = ({
  src,
  boundingBoxes,
  onSelectLabel,
  selectedLabel,
}) => {
  const parentRef = useRef(null);
  const [parentDimensions, setParentDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (parentRef.current) {
        const { offsetWidth, offsetHeight } = parentRef.current;
        setParentDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateDimensions();

    const observer = new ResizeObserver(updateDimensions);
    if (parentRef.current) {
      observer.observe(parentRef.current);
    }

    return () => {
      if (parentRef.current) {
        observer.unobserve(parentRef.current);
      }
    };
  }, [parentRef]);

  return (
    <div ref={parentRef} style={{ position: "relative" }}>
      <img src={src} alt="X-ray" width={800} height={800} />
      {boundingBoxes.map((box, index) => (
        <SegmentationBoxes
          key={index}
          imageWidth={parentDimensions.width}
          imageHeight={parentDimensions.height}
          x1={box.x1}
          y1={box.y1}
          x2={box.x2}
          y2={box.y2}
          options={{
            label: box.label,
            onSelectLabel: onSelectLabel,
            selectedLabel: selectedLabel,
          }}
        />
      ))}
    </div>
  );
};

const SegmentationBoxes = ({
  imageWidth,
  imageHeight,
  x1,
  y1,
  x2,
  y2,
  options,
}) => {
  const { label, onSelectLabel, selectedLabel } = options;
  const isSelected = selectedLabel === label;
  const style = {
    position: "absolute",
    border: isSelected ? `2px solid rgb(220, 38, 38)` : `1px solid rgba(200, 200, 200, 0.8)`,
    boxSizing: "border-box",
    width: `${(x2 - x1) * imageWidth}px`,
    height: `${(y2 - y1) * imageHeight}px`,
    left: `${x1 * imageWidth}px`,
    top: `${y1 * imageHeight}px`,
  };

  return (
    <div
      onClick={() => onSelectLabel(label)}
      style={style}
      className={
        "hover:z-10 hover:scale-105 ease-in-out hover:duration-300 cursor-pointer"
      }
    ></div>
  );
};

export default XrayWithSegmentationBoxes;
