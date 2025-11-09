# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spring Boot application for a carwash order management portal backend service. The project uses Maven for dependency management and build automation.

## Technology Stack

- **Framework**: Spring Boot 3.5.7
- **Java Version**: 25
- **Build Tool**: Maven
- **Web Framework**: Spring Web (RESTful services)

## Common Development Commands

### Building and Running
```bash
# Build the project
mvn clean compile

# Run the application
mvn spring-boot:run

# Build executable JAR
mvn clean package

# Run tests
mvn test

# Run specific test class
mvn test -Dtest=MgmtportalApplicationTests
```

### Development Workflow
```bash
# Clean and rebuild
mvn clean install

# Skip tests during build
mvn clean install -DskipTests

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Project Structure

```
src/
├── main/
│   ├── java/com/carwash/mgmtportal/
│   │   └── MgmtportalApplication.java  # Main application class
│   └── resources/
│       └── application.properties      # Application configuration
└── test/
    └── java/com/carwash/mgmtportal/
        └── MgmtportalApplicationTests.java  # Spring Boot test
```

## Architecture

- **Main Class**: `MgmtportalApplication` - Spring Boot entry point with `@SpringBootApplication` annotation
- **Configuration**: Uses `application.properties` for application settings
- **Testing**: Basic Spring Boot context loading test in `MgmtportalApplicationTests`
- **Dependencies**: Spring Boot Starter Web for REST API development

## Key Files

- `pom.xml` - Maven configuration with Spring Boot dependencies
- `src/main/resources/application.properties` - Application configuration
- `src/test/java/.../MgmtportalApplicationTests.java` - Basic integration test

## Development Notes

- This is a minimal Spring Boot application ready for REST API development
- The project currently contains only the basic Spring Boot structure
- Future development should follow Spring Boot best practices for REST services
- Consider adding additional Spring Boot starters as needed (JPA, Security, etc.)