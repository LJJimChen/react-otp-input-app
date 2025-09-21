'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from 'react';
import {
  OTPInput,
  OTPInputProps,
  SlotProps,
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from 'input-otp';
import styles from '../PinInput/PinInput.module.css';

/**
 *
 * @param {OTPInputProps} param0
 * @returns {JSX.Element}
 */
function PinCodeInput({
  className,
  containerClassName,
  onChange,
  onComplete,
  type,
  render,
  maxLength = 6,
  hasError = false,
  mask = '•',
  revealDuration = 500,

  ...props
}) {
  const [revealedIndex, setRevealedIndex] = useState(-1);

  const inputRef = useRef(null);
  const prevLength = useRef(0);

  const handleValueChange = useCallback(
    (value) => {
      if (type === 'password') {
        const newLength = value.length;
        if (newLength > prevLength.current && revealDuration > 0) {
          setRevealedIndex(newLength - 1); // show last char
        }
        prevLength.current = newLength;
      }
      onChange?.(value);
    },
    [onChange, revealDuration, type]
  );

  //handle revealed char
  useEffect(() => {
    let timer;
    if (revealedIndex >= 0) {
      timer = setTimeout(() => {
        //hide revealed char
        setRevealedIndex(-1);
      }, revealDuration);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [revealDuration, revealedIndex]);

  const renderDefaultSlots = useCallback(
    ({ slots }) => {
      return (
        <>
          {slots.map((slot, idx) => {
            let charToShow = slot.char;
            if (
              type === 'password' &&
              slot.char &&
              mask &&
              idx !== revealedIndex
            ) {
              charToShow = mask;
            }
            return (
              <PinSlot
                {...slot}
                key={idx}
                hasError={hasError}
                index={idx}
                char={charToShow}
              />
            );
          })}
        </>
      );
    },
    [hasError, mask, revealedIndex, type]
  );

  useEffect(() => {
    let observer;
    if (type === 'password' && inputRef.current) {
      observer = new MutationObserver(
        debounce((mutations) => {
          for (const mutation of mutations) {
            if (
              mutation.type === 'attributes' &&
              mutation.attributeName === 'value'
            ) {
              if (inputRef.current && inputRef.current.hasAttribute('value')) {
                inputRef.current.removeAttribute('value');
              }
            }
          }
        }, 50)
      );
      observer.observe(inputRef.current, {
        attributes: true,
        attributeFilter: ['value'],
      });
    }

    return () => {
      observer?.disconnect();
    };
  }, [type]);

  const defaultContainerClass = useMemo(
    () => `${styles.container} ${hasError ? styles.shake : ''}`,
    [hasError]
  );

  return (
    <OTPInput
      containerClassName={containerClassName ?? defaultContainerClass}
      className={className}
      render={render ?? renderDefaultSlots}
      onChange={handleValueChange}
      onComplete={onComplete}
      type={type}
      maxLength={maxLength}
      {...props}
      ref={inputRef}
    />
  );
}

/**
 *
 * @param {SlotProps} param0
 * @returns {JSX.Element}
 */
function Slot({
  char,
  placeholderChar,
  isActive,
  hasFakeCaret,
  hasError,
  index,
  className,
  revealDuration = 500,
  ...props
}) {
  const classNames = [styles.slot];
  if (isActive) classNames.push(styles.active);
  if (hasError) classNames.push(styles.error);

  return (
    <div className={classNames.join(' ')} {...props}>
      {char}
      {hasFakeCaret && !char && <span className={styles.caret}></span>}
    </div>
  );
}

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const PinSlot = memo(Slot);
const PinInput = memo(PinCodeInput);
export {
  PinInput,
  PinSlot,
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
};
