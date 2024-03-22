# Node.js Mentoring Program

The repository was created for educational purposes, especially for the [Node.js Global Mentoring Program](https://learn.epam.com/detailsPage?id=f6759197-cdf4-4bc5-a79f-987b12ae327c) [2024 Q1-Q2 GUKKA, BY] in the [Learn Digital Platform](https://learn.epam.com/) of [EPAM Systems](https://www.epam.com/). The main goal of the project is to complete the practical tasks of the program.

## Agenda of the project:

- **Introduction to Node.js**
- **Node.js standard library**
- **EventEmitter & Buffer & Streams**
- **Network**
- **Testing**
- **Express & Layered Architecture**
- **Databases. NoSQL**
- **Databases. RDBMS**
- **Authorization & Authentication**
- **Deploy and Tools**

Each module has a practical tasks that will be completed in separate branches.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/artykovdaniyar/node.js-mentoring-program.git
   ```

2. Navigate into the project directory:

   ```sh
   cd node.js-mentoring-program
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

## Launching the Project

1. Start the development server (with hot reload) using nodemon:

   ```sh
   npm run dev
   ```

2. Or, start the project in production mode

It should be build first:

```sh
npm run build
```

than start:

```sh
npm start
```

## Additional Scripts

- Lint the code:

  ```sh
  npm run lint
  ```

- Fix linting issues:

  ```sh
  npm run lint:fix
  ```

- Build the project (if necessary):
  ```sh
  npm run build
  ```
