# Incoherent Game API
The backend system for "Incoherent", a what's the gibberish game, is designed to manage users, games, and cards for the game. It provides a RESTFUL API for creating, reading, updating, and deleting (CRUD) resources. Built with Node.js, Express, and PostgreSQL, it utilizes Sequelize as an ORM to interact with the database and ensure data integrity.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm or yarn

### Installation


### Installation
1. **Clone the repository to your local machine.**

    ```
    git clone <repository-url>
    ```

2. **Navigate to the project directory.**

    ```
    cd <project-directory>
    ```

3. **Install dependencies.**

    ```
    npm install
    ```
    
     or if you use yarn, 
     
     ```
     yarn install
     ```

4. Set up environment variables. Create a **`.env`** file in the root of your project and add the following variables:

    ```
    PORT=5050
    DATABASE_URL=<your-production-postgresql-connection-string>
    DEV_DATABASE_URL=<your-development-postgresql-connection-string>
    TEST_DATABASE_URL=<your-test-postgresql-connection-string>
    ```

5. Start the server.

    ```
    npm run start
    ``` 
    
    or using yarn, 
    
    ```
    yarn start
    ```


## API Reference

### Users
* **GET `/users`** - Retrieve authorized user.
* **POST `/users`** - Create a new user account.
* **PUT `/users/:id`** - Update an authorized user by ID.

### Games
* **GET `/games`** - Retrieve all games for the authorized user.
* **GET `/games/:id`** - Retrieve a single game by ID.
* **POST `/games`** - Create a new game.
* **PUT `/games/:id`** - Update a game by ID.
* **PUT `/games/:id/addPlay`** - Add a play to a game by ID.
* **DELETE `/games/:id`** - Delete a game by ID.

### Cards
* **GET `/cards`** - Retrieve all cards up to a limit.
* **POST `/cards`** - Create a new card.
* **PUT `/cards/:id`** - Update a card by ID.
* **DELETE `/cards/:id`** - Delete a card by ID.

### Messages 
* **GET `/events`** - Retrieve all messages.
* **GET `/events/:id`** - Retrieve a single message by ID.
* **POST `/events`** - Create a new message.
* **DELETE `/events/:id`** - Delete a message by ID.

## Development

### Running Tests
To run the automated tests for this system, use the following command:

```
npm test
```


## Deployment
This project is set up for basic deployment. For production environments, ensure that your Postgres connection string (DATABASE_URL) is correctly configured in your environment variables. 

Use the start script for standard environments and dev for development environments, which includes hot reloading via nodemon.

For standard development environments:

```
npm start
```

For development with hot reloading:

```
npm run dev
```

### Environment Variables
Ensure you set up the following environment variables in your .env file:

* **`PORT`**: The port number on which your server will run.
* **`DATABASE_URL`**: Your Postgres connection string for production.
* **`DEV_DATABASE_URL`**: Your Postgres connection string for development.
* **`TEST_DATABASE_URL`**: Your Postgres connection string for testing.

### Dependencies
* **`basic-auth`**: Basic access authentication library.
* **`bcryptjs`**: Library for hashing and salting user passwords.
* **`cors`**: Used to enable CORS with various options.
* **`dotenv`**: Loads environment variables from a .env file into process.env.
* **`express`**: Fast, unopinionated, minimalist web framework for Node.js.
* **`morgan`**: HTTP request logger middleware for Node.js.
* **`pg`**: PostgreSQL client for Node.js.
* **`nodemon`**: Utility that will monitor for any changes in your source and automatically restart your server.

### DevDependencies
* **`cross-env`**: Run scripts that set and use environment variables across platforms.
* **`jest`**: Delightful JavaScript Testing.
* **`nodemon`**: Utility that will monitor for any changes in your source and automatically restart your server.
* **`sequelize-cli`**: The Sequelize Command Line Interface (CLI).
* **`supertest`**: Super-agent driven library for testing HTTP servers.


## Authors

### **Liz Trejo**
* [Github](https://github.com/lissetet)
* [Portrfolio](https://liztrejo.dev/)
* [LinkedIn](https://www.linkedin.com/in/liz-trejo/)