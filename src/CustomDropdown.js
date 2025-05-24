import React, { useState, useRef, useEffect } from "react";

export default function CustomDropdown({
  value,
  onChange,
  options,
  disabled,
  placeholder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    onChange(code);
    setIsOpen(false);
  };

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-3 rounded-lg border border-gray-300 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"
        }`}
      >
        <span className={value ? "text-gray-800" : "text-gray-500"}>
          {value
            ? options.find(([code]) => code === value)?.[1]
              ? `${value} - ${options.find(([code]) => code === value)[1]}`
              : placeholder
            : placeholder}
        </span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className={`w-5 h-5 transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map(([code, name]) => (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code)}
              className="w-full px-4 py-2 text-left text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-150"
            >
              {code} - {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
