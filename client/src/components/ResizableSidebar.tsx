'use client';
import React, { useRef, useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
  side?: 'left' | 'right';
  minWidth?: number;
  maxWidth?: number;
  initialWidth?: number;
};

const ResizableSidebar: React.FC<Props> = ({
  children,
  side,
  minWidth = 150,
  maxWidth = 500,
  initialWidth = 300,
}) => {
  const isResizingRef = useRef(false);
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      // Determine sidebar resizing based on which edge the resizer is on
      const newWidth =
        side === 'left'
          ? Math.min(Math.max(e.clientX, minWidth), maxWidth)
          : Math.min(Math.max(window.innerWidth - e.clientX, minWidth), maxWidth);

      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [side, minWidth, maxWidth]);

  const startResizing = () => {
    isResizingRef.current = true;
    document.body.style.cursor = 'ew-resize';
  };

  return (
    <div className={`relative flex-initial`} style={{ width }}>
      
      {/* Sidebar content */}
      <div className="w-full overflow-hidden">{children}</div>

      {/* Resizer on appropriate side */}
      <div
        onMouseDown={startResizing}
        className={`absolute top-0 h-full w-0.5 cursor-ew-resize bg-gray-700 hover:bg-gray-400 hover:w-1 ${
          side === 'left' ? 'right-0' : 'left-0'
        }`}
      />
    </div>
  );
};

export default ResizableSidebar;
