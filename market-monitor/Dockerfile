FROM container-registry.oracle.com/java/openjdk:24
WORKDIR /app
COPY target/market-monitor-0.0.1-SNAPSHOT.jar market-monitor-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "market-monitor-0.0.1-SNAPSHOT.jar"]