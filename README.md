# Flight Management System

This is a flight management system built with Node.js and Express. It uses GraphQL for API and Auth0 for authentication.

## Features

- User authentication with Auth0
- Role-based access control
- REST API endpoints for managing airlines, locations, airplanes, airports, persons, passengers, passenger vacations, legs, routes, route paths, flights, pilots, and pilot licenses
- GraphQL API

## Installation

1. Clone the repository: `git clone https://github.com/yourusername/your-repo-name.git`
2. Navigate into the directory: `cd your-repo-name`
3. Install the dependencies: `npm install`
4. Copy the `.env.example` file to a new file called `.env` and fill in your Auth0 credentials and other configuration values
5. Start the server: `npm start`

## Usage

Visit `http://localhost:3000` in your web browser. If you're not logged in, you'll be redirected to the Auth0 login page.

Once you're logged in, you can visit the various API endpoints to manage the flight management system. You can also use the GraphQL API at `http://localhost:3000/graphql`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
