# Мини приложение для платформы VK 
![GitHub last commit](https://img.shields.io/github/last-commit/Alnipet/moving-photos-mini-app)
![GitHub top language](https://img.shields.io/github/languages/top/Alnipet/moving-photos-mini-app)
![GitHub language](https://img.shields.io/github/languages/count/Alnipet/moving-photos-mini-app)

Добавляет функционал переноса фотографий между альбомами VK

## 🚀 Запуск мини приложения

Запуск

```sh
npm start
```

Запустить vk-tunnel 

```shell
npm run tunnel
```

Полученную в ссылку вставить в [управление](https://vk.com/apps?act=manage), предварительно включив режим разработки и сохранить. Открыть мини апп, нажав на его иконку или по ссылке вида `https://m.vk.com/app<appID>`

## 🌐 Деплой мини приложения

Настроен автоматический деплой приложения с помощью GitHub actions при изменении версии и пуша тега версии, например:

```sh
npm version patch
git push origin HEAD
git push --tags
```


## 🗂️ Библиотеки VK

1. [vk-bridge](https://dev.vk.com/ru/mini-apps/bridge) | Библиотека для отправки команд и обмена данными с платформой ВКонтакте. 
2. [VKUI](https://vkcom.github.io/VKUI/) | Библиотека React-компонентов для создания мини-приложений в стиле ВКонтакте. 
3. [vk-bridge-react](https://www.npmjs.com/package/@vkontakte/vk-bridge-react) | Пакет, который даёт возможность использовать события библиотеки VK Bridge в React-приложениях. 
4. [vk-mini-apps-router](https://dev.vk.com/ru/libraries/router) | Библиотека для маршрутизации и навигации в мини-приложениях, созданных с помощью VKUI.
5. [icons](https://vkcom.github.io/icons/) | Набор иконок для использования в компонентах VKUI. |
6. [vk-miniapps-deploy](https://dev.vk.com/ru/mini-apps/development/hosting) | Пакет для размещения файлов мини-приложения на хостинге ВКонтакте. |
7. [eruda](https://www.npmjs.com/package/eruda) | Консоль для мобильного браузера|

### 📎 Полезные ссылки

[Dev портал разработчиков](https://dev.vk.com/ru)  
[Пример мини приложения](https://dev.vk.com/ru/mini-apps/examples/shop)  
[Если столкнулись с проблемами](https://github.com/VKCOM/create-vk-mini-app/issues)
