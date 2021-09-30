# Info
![vlibrus-1](https://user-images.githubusercontent.com/36642285/135482947-95098f4e-7c90-4605-94fe-8c29eaaa34b7.png)
V-Librus is an application which fetch your all Librus (Polish electronic diary) and display the most important data, like schedule, messages, grades etc. I made this application, because I didn't want to login into site everytime when I wanted check grades or something, and now with this application, I can just run it from my Desktop and it's logging me automatically.

# Features
```
 - Show my Grades
 - Show my Schedule
 - Show my Messages
 - Show Notifications
 - Display absences, tests in the next few days
```

# Build
<b>Windows</b>: ```npm run electron-build:Windows``` <br/><br/>
<b>Linux</b>: ```npm run electron-build:Linux``` Builed file will be "snap" so first install "snapd" package and later use: ```snap install --dangerous ./outputFile.snap``` <br/><br/>
<b>Mac OS</b>: ```npm run electron-build:MacOS```

# Images
![vlibrus-6](https://user-images.githubusercontent.com/36642285/135483002-8390ace8-3f78-440b-8251-b7ef4b781cf2.png)
![vlibrus-2](https://user-images.githubusercontent.com/36642285/135483036-f605663a-0e84-4972-994c-f863fc21b568.png)
![vlibrus-3](https://user-images.githubusercontent.com/36642285/135483040-262e580b-2f3c-4b53-aef4-06aa83edf52b.png)
![vlibrus-4](https://user-images.githubusercontent.com/36642285/135483046-8b6b4b82-480b-40a4-9ea4-cd22135208da.png)
![vlibrus-5](https://user-images.githubusercontent.com/36642285/135483056-83b31fed-b356-410e-828c-9fa7a041e811.png)

# API
V-Librus is using [librus-api](https://github.com/Mati365/librus-api) on which I even added and fixed some features.

# License
Project is under GNU General Public License v3.0. You can read more there: [www.gnu.org](https://www.gnu.org/licenses/gpl-3.0.html)
