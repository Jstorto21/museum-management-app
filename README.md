# Museum Management Web Application

This is a full-stack Node.js and MariaDB web application designed to manage a museum's internal operations. It supports CRUD operations across departments, employees, exhibits, and artworks. The system was developed as part of the CS340 course at Oregon State University.

## Features

- Create, read, update, and delete:
  - Departments
  - Employees
  - Exhibits (supports many-to-many relationships with departments)
  - Artworks (linked to departments and optionally to exhibits)
- Dynamic dropdown menus populated from the database
- AJAX-enabled routes for smooth updates and deletions
- Input validation and duplicate entry handling
- Modular design using Express routes and Handlebars templates

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MariaDB (MySQL-compatible)
- **Templating Engine:** Handlebars (.hbs)
- **Frontend:** HTML, CSS, JavaScript
- **Development Tools:** Git, GitHub, Visual Studio Code

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Jstorto21/museum-management-app.git
cd museum-management-app
```

### 2. Configure the Database

This project requires a local MariaDB database. You can set up your connection credentials in the following file:

```
/database/db-connector.js
```

Example configuration:

```js
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'museum_db'
});
```

### 3. Load the Database Schema and Sample Data

Two SQL files are provided to set up the database schema and populate it with sample data:

- `DDL.sql` – contains table creation statements
- `DML.sql` – contains insert statements with sample data

To import them into your MariaDB instance:

```bash
mariadb -u root -p museum_db < ./public/downloads/DDL.sql
mariadb -u root -p museum_db < ./public/downloads/DML.sql
```

> Make sure the `museum_db` database exists before running the above commands.

### 4. Install Dependencies

From the root project directory, run:

```bash
npm install
```

### 5. Start the Application

To run the application locally:

```bash
node app.js
```

Once the server is running, open your browser and navigate to:

```
http://localhost:9546
```

## Project Structure

```
.
├── app.js
├── database/
│   └── db-connector.js
├── public/
│   ├── downloads/
│   ├── js/
│   └── css/
├── views/
│   └── *.hbs
├── package.json
└── README.md
```

## Authors

- **Joseph Storto** – [GitHub Profile](https://github.com/Jstorto21)

This project was developed for CS340 – Introduction to Databases at Oregon State University.

