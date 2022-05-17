# MeanStack

Project made for education purpose.
It was made within udemy course.
[Link](https://www.udemy.com/course/angular-2-and-nodejs-the-practical-guide/ "Course Link")

I also implement some additional features like: 

- Reset password by token
- Smtp email sender to send token
- SSL for localhost

## Used technologies

- Express API
- Angular
- MongoDB

## Build

Before you run applications you have to edit `nodemon.json`

And also generate your own ssl key and cert to run with https 
[Link](https://github.com/RubenVermeulen/generate-trusted-ssl-certificate "SSL generator")

```json lines
    "env": {
        "MONGO_ATLAS_DB_NAME": "DB_NAME",
            "MONGO_ATLAS_USER": "DB_USER",
            "MONGO_ATLAS_PW": "PASSWORD_TO_DB",
            "JWT_KEY": "SECRET_KEY_FOR_TOKEN",
            "PORT": "3000",
            "BASE_URL": "https://localhost:8080",
            "SERVICE": "gmail",
            "PASS": "YOUR_EMAIL_PASSWORD",
            "USER": "YOUR_EMAIL",
            "HOST": "smtp.gmail.com"
    }
```

### Backend 
Run `nodemon server.js`

### Frontend
Run `npm start`
