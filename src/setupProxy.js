// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

module.exports = function (app) {
  //   app.use(
  //     '/login',
  //     createProxyMiddleware({
  //       target: 'http://localhost:5000', // 后端 API 地址
  //       changeOrigin: true,
  //     })
  //   );

  app.use(express.urlencoded({ extended: true })); // 解析 form-data

  app.post('/login', (req, res) => {
    console.log('login...');

    const { username, password } = req.body;
    if (username === 'admin' && password === '352817') {
      // return res.redirect('/dashboard');
      return res.status(200).send('login success');
    } else {
      res.status(401).send('用户名或密码错误');
    }
  });

  app.get('/dashboard', (req, res) => {
    res.send('<h1>Welcome Dashboard</h1>');
  });
};
