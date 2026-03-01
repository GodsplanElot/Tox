import React from "react";
import logo from "../../assets/logo.png";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  size?: number;
  fullscreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 80,
  fullscreen = true,
}) => {
  const spinnerContent = (
    <div className="toxic-spinner-container">
      <div className="toxic-spinner-ring"></div>
      <img
        src={logo}
        alt="Loading..."
        className="toxic-spinner-icon"
        style={{ width: size, height: size }}
      />
    </div>
  );

  if (fullscreen) {
    return <div className="toxic-spinner-fullscreen">{spinnerContent}</div>;
  }

  return spinnerContent;
};

export default LoadingSpinner;
