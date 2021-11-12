<h1>Project Manager</h1>

## 1. Getting started

### 1.1 Requirements

Before starting, make sure you have at least those components on your workstation:

- An up-to-date release of [NodeJS](https://nodejs.org/) and NPM (Yarn is recommended)
- A database: MySQL.

### 1.2 Project configuration

Start by cloning this project on your workstation.

```sh
git clone https://github.com/zinza-d2-training/hieptd-nestjs.git
```

The next thing will be to install all the dependencies of the project.

```sh
cd ./hieptd-nestjs
npm install
```

or

```sh
cd ./hieptd-nestjs
yarn install
```

Once the dependencies are installed :

- You can now configure your project by creating a new `.env` file containing your environment variables used for development.
- Place the file in the root of your project.
- Example: `.env.example`
- Copy `.env,example` to `.env`

```sh
cp .env.example .env
vi .env
```

- Configure your database, environment variables by editing the `.env` file.

```sh
#Database mysql
PORT=5000
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=projectmanager
DB_LOGGING=true
JWT_SECRET=YOUR_SECRET_KEY
SALT_ROUND=10

# mail
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_mail
MAIL_PASSWORD=your_pass_smtp
MAIL_FROM=your_mailFrom

# optional
MAIL_TRANSPORT=smtp://${MAIL_USER}:${MAIL_PASSWORD}@${MAIL_HOST}
```

- Get SMTP password in Gmail https://hotter.io/docs/email-accounts/app-password-gmail/

### 1.3 Launch

### 1.3.1 Perform migrations in your database using TypeORM (include seeder data)

- Seed data: 100 users, 100 projects, 1000 tasks
- Default admin account :

```
username:admin
password:111111
```

Then

```sh

npm run migration:run
## or
yarn run migration:run
```

```sh
# Launch the development server with TSNode
## using npm
npm start:dev
## or
yarn start:dev
```

You can now head to http://localhost:5000 and see the application in action.
