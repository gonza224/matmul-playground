import React from 'react';

const CustomButton = ({ icon: Icon, text, onClick, className = '', props }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center px-2 py-2 space-x-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition-all duration-200 ${className}`}
            {...props}
        >
            {Icon && <Icon className="w-6 h-6" />}
            {text && <span>{text}</span>}
        </button>
    );
};

export default CustomButton;
