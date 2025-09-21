import logo from './logo.svg';
import './App.css';
import MultiCodeInput from './MultiCodeInput/MultiCodeInput';
import { useState, useRef } from 'react';
import { PinInput } from './PinInput/PinInput';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

function App() {
  const [error, setError] = useState(false);
  const inputRef = useRef(null);
  const [password, setPassword] = useState('');

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <PinInput></PinInput>
          <br></br>
          <PinInput
            type={'password'}
            hasError={error}
            value={password}
            onChange={setPassword}
            onComplete={(val) => {
              if (val !== '1234') {
                setError(true);
                // 0.5秒后清空输入
                setTimeout(() => {
                  setError(false);
                  setPassword('');
                }, 500);
              } else {
                alert('PIN 正确!');
              }
            }}></PinInput>
        </div>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'>
          Learn React
        </a>
      </header>
      <div
      // onSubmit={(event) => {
      //   event.preventDefault(); // Prevents the default form submission behavior (page reload)
      //   window.location.href = '/dashboard';
      //   return true;
      // }}
      >
        <label>
          用户名
          <input name='username' type='text' autoComplete='username' required />
        </label>
        <label>
          密码
          <PinInput
            inputMode='numeric'
            pattern={REGEXP_ONLY_DIGITS}
            name='password'
            type='password'
            autoComplete='current-password'
            required
          />
        </label>
        <button
          // type='submit'
          onClick={(event) => {
            event.preventDefault(); // Prevents the default form submission behavior (page reload)
            window.location.href = '/dashboard';
          }}>
          登录
        </button>
      </div>
      );
    </div>
  );
}

export default App;
