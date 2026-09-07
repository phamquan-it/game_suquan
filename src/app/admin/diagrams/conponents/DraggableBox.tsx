"use client"

import { useRef, useState } from "react";
import Draggable from "react-draggable";
import styles from "../styles";
import { Spin } from "antd";

// Component box có thể kéo thả - FIXED
export const DraggableBox = ({
  id,
  children,
  position,
  color = '#fff',
  borderColor = '#333',
  onDrag,
  onContextMenu,
  scale = 1,
  dragDisabled = false,
  onStart,
  loading = false
}: any) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStart={onStart}
      onDrag={onDrag}
      onStop={onDrag}
      scale={scale}
      bounds={false}
      disabled={dragDisabled}
    >
      <div
        ref={nodeRef}
        id={id}
        style={{
          ...styles.draggableBox(color, borderColor),
          ...(isHovered && styles.draggableBoxHover),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu?.(e);
        }}
      >
        {loading ? (
          <Spin size="small" />
        ) : (
          children
        )}
      </div>
    </Draggable>
  );
};

