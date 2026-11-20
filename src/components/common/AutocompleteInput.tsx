import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface AutocompleteInputProps {
  id: string;
  value?: string;
  onChange: (value: string) => void;
  options?: string[];
  placeholder?: string;
  hasError?: boolean;
  className?: string;
  allowManual?: boolean;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  id,
  value = '',
  onChange,
  options = [],
  placeholder = 'Type or select an option...',
  hasError = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const safeValue = typeof value === 'string' ? value : '';

  // Filter options related to user input
  const filteredOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    const validStrings = options.filter(
      (opt): opt is string => typeof opt === 'string' && opt.trim().length > 0
    );
    const query = safeValue.toLowerCase().trim();
    if (!query) {
      return validStrings;
    }
    return validStrings.filter((opt) => opt.toLowerCase().includes(query));
  }, [options, safeValue]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option: string) => {
    if (typeof onChange === 'function') {
      onChange(option);
    }
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    if (typeof onChange === 'function') {
      onChange(nextVal);
    }
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
    } else if (e.key === 'Enter') {
      if (isOpen && filteredOptions.length > 0) {
        e.preventDefault();
        handleSelectOption(filteredOptions[0]);
      } else {
        setIsOpen(false);
      }
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      inputRef.current?.focus();
    }
  };

  // Only show dropdown if it is open and there are matching options to show
  const showDropdown = isOpen && filteredOptions.length > 0;
  const isFilled = Boolean(safeValue.trim());

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input container box - matched precisely to the Name input field (h-[38px] sm:h-[40px], rounded-[6px], px-3) */}
      <div
        className={`relative flex items-center h-[38px] sm:h-[40px] border rounded-[6px] transition-all px-3 ${
          hasError
            ? 'bg-red-50/30 border-red-400 ring-2 ring-red-100'
            : isOpen
            ? 'bg-[#F0F7FF] border-[#146EF5] ring-2 ring-[#146EF5]/10'
            : isFilled
            ? 'bg-[#F0F7FF] border-[#B9D5FD] hover:border-[#146EF5]'
            : 'bg-white border-[#E2E8F0] hover:border-[#146EF5]/50 focus-within:border-[#146EF5] focus-within:ring-2 focus-within:ring-[#146EF5]/10'
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={safeValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full h-full bg-transparent text-xs sm:text-[13px] font-medium text-[#071B49] placeholder:text-slate-400 focus:outline-none pr-6 truncate"
        />

        {/* Dropdown toggle button with arrow */}
        <button
          type="button"
          onClick={toggleDropdown}
          tabIndex={-1}
          title={isOpen ? 'Close suggestions' : 'Show suggestions'}
          className="absolute right-2.5 p-1 text-[#146EF5] hover:text-blue-700 transition-colors cursor-pointer"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#146EF5]' : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      {/* Floating Suggestions Dropdown (Only appears when matching options exist) */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-xl border border-[#D7E3F3] shadow-[0_12px_28px_rgba(7,26,61,0.09)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100/70 py-1 text-xs sm:text-[13px]">
            {filteredOptions.map((opt, idx) => {
              const isSelected = safeValue.toLowerCase().trim() === opt.toLowerCase().trim();
              return (
                <button
                  key={`${opt}-${idx}`}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectOption(opt);
                  }}
                  onClick={() => {
                    handleSelectOption(opt);
                  }}
                  className={`w-full text-left px-4 py-2.5 sm:py-3 flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#EAF4FF] text-[#0B63F6] font-bold border-l-4 border-[#0B63F6]'
                      : 'text-[#071A3D] hover:bg-[#EAF4FF] hover:text-[#0B63F6]'
                  }`}
                >
                  <span className="truncate pr-2">{opt}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#0B63F6] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
