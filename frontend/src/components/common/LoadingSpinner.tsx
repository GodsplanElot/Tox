import React from "react";
import logo from "../../assets/logo.png";

interface LoadingSpinnerProps {
  size?: number;
  fullscreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 44, fullscreen = true }) => {
  const spinner = (
    <div role="status" aria-label="Loading" className="relative grid place-items-center" style={{ width: size * 1.8, height: size * 1.8 }}>
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-white/[0.06] border-t-accent [animation-duration:900ms]" />
      <img src={logo} alt="" style={{ width: size, height: size }} className="animate-pulse object-contain opacity-90" />
    </div>
  );

  if (fullscreen) {
    return <div className="grid min-h-[70svh] w-full place-items-center">{spinner}</div>;
  }

  return spinner;
};

export default LoadingSpinner;
