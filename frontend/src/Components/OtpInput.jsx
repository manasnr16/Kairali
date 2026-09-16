import React, { useRef } from 'react';

/**
 * A row of 6 single-digit boxes that behaves like one OTP field.
 * `value` / `onChange` are plain strings, e.g. "123" while typing.
 */
const OtpInput = ({ length = 6, value = '', onChange, disabled = false, error = false }) => {
  const inputsRef = useRef([]);

  const setDigit = (index, digit) => {
    const digits = value.split('');
    digits[index] = digit;
    onChange(digits.join('').slice(0, length));
  };

  const handleChange = (e, index) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setDigit(index, '');
      return;
    }
    // Support typing/pasting multiple digits into one box.
    const chars = raw.split('');
    const digits = value.split('');
    chars.forEach((ch, i) => {
      digits[index + i] = ch;
    });
    const next = digits.join('').slice(0, length);
    onChange(next);

    const lastFilled = Math.min(index + chars.length, length - 1);
    inputsRef.current[lastFilled]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        setDigit(index, '');
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        setDigit(index - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[index] || ''}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-gold transition
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
