# Market Monitor

Market Monitor is a web application built with Spring Boot and React that provides detailed dashboards with real-time and historical stock data. This was created primarily for experimentation and learning purposes.

## Tech Stack

- Backend
  - Java 24
  - Spring Boot - Spring Security, Data JPA, and Cache (Caffeine)
  - PostgreSQL
  - Maven  

- Frontend
  - JavaScript
  - React
  - Material UI (MUI)

## License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

## Disclaimer 

This project is provided as is, without warranty of any kind. It was created as a personal experiment and is not actively maintained. Use it at your own risk.

## Contributing

Feel free to create an issue if you encounter any bugs or errors.

## Getting Started

Download the repo with:
```bash
git clone https://github.com/zcstanley24/market-monitor.git
```

### Running the frontend server locally
```bash
cd market-monitor-frontend
npm install
npm run dev
```

### Running the backend server locally
First, ensure you have Java 24 (JDK), Maven, and PostgreSQL installed.  
Then, in src/main/resources/application.properties, update the following with your local PostgreSQL database credentials:  
```bash
spring.datasource.url=jdbc:postgresql://localhost:5432/{database-name}
spring.datasource.username={username}
spring.datasource.password={password}
```

You will also need to generate or set an existing JWT secret with:
```bash
export JWT_SECRET=your_secret
```

Additionally, you will need an account with Twelve Data to access the stocks API locally.  
It's free and easy to sign up - https://twelvedata.com/register.  
Once you've created your account, you should be granted an API key that you can set as
an environment variable with:
```bash
export TWELVE_API_KEY=your_api_key
```

You will want to set an environment variable to allow your frontend server to communicate with
Spring Boot:
```bash
export ALLOWED_DOMAINS=your_domain (probably http://localhost:5173)
```

Now, just run:
```bash
mvn clean install
mvn spring-boot:run
```

Now, you should be able to create a new user from http://localhost:5173/register

If you run into any problems, please feel free to create an issue in Github.