/* eslint-disable react/prop-types */
/**
 * @param {object} args - Additional attributes for the input element
 * @param {string} value - The value of the input field
 * @param {function} setter - Function to update the value of the input
 */

import { useState } from "react";

export function InputField({ value, label, setter, args = {}, required = false }) {
  return <div className="space-y-1 w-full flex flex-col">
    <label htmlFor={label} className="text-sm">{label} { required && <span className="text-rose-400"> * </span>} </label>
    <input value={value} onChange={(e) => setter(e.target.value)} {...args} className="bg-gray-200 rounded-md p-2 border-none text-xs outline-transparent focus:outline-yellow-300" />
  </div>
}

export function TextAreaField({ value, label, setter, args = {} }) {
  return <div className="space-y-1 w-full flex flex-col">
    <label htmlFor={label} className="text-sm">{label}</label>
    <textarea value={value} onChange={(e) => setter(e.target.value)} rows={5} {...args} className="bg-gray-200 rounded-md p-2 border-none text-xs outline-transparent focus:outline-yellow-300" />
  </div>
}

export function SelectField({ value, label, setter, options = [], args = {} }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter options based on search input
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative space-y-1 w-full flex flex-col">
      <label htmlFor={label} className="text-sm">{label}</label>
      
      {/* Input field to trigger dropdown and search */}
      <input
        type="text"
        name={label}
        value={searchTerm || value}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="bg-gray-200 rounded-md p-2 border-none text-xs outline-transparent focus:outline-yellow-300"
        {...args}
      />

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-40 overflow-y-auto w-full">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, key) => (
              <div
                key={key}
                className="p-2 hover:bg-yellow-200 text-xs cursor-pointer"
                onClick={() => {
                  setter(option);
                  setSearchTerm(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))
          ) : (
            <p className="p-2 text-gray-500 text-xs">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}
