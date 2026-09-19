import { forwardRef } from 'react';

export const Flower = forwardRef<SVGGElement, any>(({ className, ...props }, ref) => {
  return (
    <g ref={ref} className={`flower-group ${className}`} {...props}>
      {/* Petals */}
      <path className="flower-path" d="M0,0 C-10,-15 10,-15 0,0" transform="rotate(0)" />
      <path className="flower-path" d="M0,0 C-10,-15 10,-15 0,0" transform="rotate(45)" />
      <path className="flower-path" d="M0,0 C-10,-15 10,-15 0,0" transform="rotate(90)" />
      <path className="flower-path" d="M0,0 C-10,-15 10,-15 0,0" transform="rotate(135)" />
      <path className="flower-path" d="M0,0 C-10,-15 10,-15 0,0" transform="rotate(180)" />
      <path className="flower-path" d="M0,0 C-10,-15 10,-15 0,0" transform="rotate(225)" />
      <path className="flower-path" d="M0,0 C-10,-15 10,-15 0,0" transform="rotate(270)" />
      <path className="flower-path" d="M0,0 C-10,-15 10,-15 0,0" transform="rotate(315)" />
      {/* Center */}
      <circle className="flower-center" cx="0" cy="0" r="3" />
    </g>
  );
});

export const Stem = forwardRef<SVGPathElement, any>(({ className, d, strokeWidth = 2, ...props }, ref) => {
  return (
    <path
      ref={ref}
      className={`stem-path ${className}`}
      d={d}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
});

export const Leaf = forwardRef<SVGPathElement, any>(({ className, ...props }, ref) => {
  return (
    <path
      ref={ref}
      className={`leaf-path ${className}`}
      d="M0,0 Q10,-5 20,0 Q10,5 0,0"
      {...props}
    />
  );
});
