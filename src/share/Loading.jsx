import React from "react";
import "./Loading.css";

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="loading-dots">
                    <div className="dot dot1"></div>
                    <div className="dot dot2"></div>
                    <div className="dot dot3"></div>
                    <div className="dot dot4"></div>
                </div>
            </div>
            <div className="loading-text">Loading...</div>
        </div>
    );
};

export default Loading;
