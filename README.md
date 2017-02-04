# 接住福袋游戏

## 项目简介

该 H5 游戏使用 canvas 作为游戏的图像渲染，使用 gulp 进行代码打包。

使用 gulp 将 ES6 语法使用 Babel 自动转义为 ES5，并将 Sass 转义为 CSS。

## 目录介绍

```
new-year-game
├─┬ dist  // 生产文件
│ ├── static  // 静态文件(css,img,js)
│ └── index.html  // 入口HTML
├── src  // 编写的源文件
├── node_modules  // npm安装的nodejs的模块包
├── gulpfile.js  // gulp配置文件
├── package.json  // npm配置文件
├── README.md  // 介绍文件
├── .gitignore  // git配置文件
└── .babelrc  // babel配置文件
```

## 使用方法

1. 使用 `npm install` 安装生产环境
2. 使用 `npm run dev` 进入开发环境
3. 使用 `npm run build` 将代码打包

