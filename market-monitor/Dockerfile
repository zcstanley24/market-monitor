FROM maven:3.9-eclipse-temurin-24 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM container-registry.oracle.com/java/openjdk:24
WORKDIR /app
COPY --from=builder /app/target/market-monitor-0.0.1-SNAPSHOT.jar market-monitor-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "market-monitor-0.0.1-SNAPSHOT.jar"]