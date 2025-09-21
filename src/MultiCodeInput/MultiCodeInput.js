import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { OTPInput, SlotProps } from 'input-otp';
import styles from './MultiCodeInput.module.css';

function Slot({
  char,
  placeholderChar,
  isActive,
  hasFakeCaret,
  mode,
  hasError,
}) {
  const classNames = [styles.slot];
  if (isActive) classNames.push(styles.active);
  if (hasError) classNames.push(styles.error);

  let displayChar;
  if (mode === 'pin') {
    displayChar = char ? '•' : placeholderChar;
  } else {
    displayChar = char ?? placeholderChar;
  }

  return (
    <div className={classNames.join(' ')}>
      {displayChar}
      {hasFakeCaret && !char && <span className={styles.caret}>|</span>}
    </div>
  );
}

const MultiCodeInput = forwardRef(function MultiCodeInput(
  { length = 6, mode = 'otp', onComplete, error = false },
  ref
) {
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  // PIN 模式时，把隐藏 input 改成 password
  useEffect(() => {
    if (mode === 'pin' && inputRef.current) {
      //   inputRef.current.
    }
  }, [mode]);

  // 错误时触发 shake 动画
  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    reset: () => {
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      }
    },
  }));

  return (
    <div className={`${shake ? styles.shake : ''}`}>
      <OTPInput
        ref={inputRef}
        maxLength={length}
        containerClassName={styles.container}
        textAlign='center'
        type='password'
        render={({ slots }) => (
          <>
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} mode={mode} hasError={error} />
            ))}
          </>
        )}
        onComplete={onComplete}
      />
    </div>
  );
});

export default MultiCodeInput;
