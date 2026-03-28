FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/invoice-service.jar app.jar

RUN mkdir -p /app/invoices

EXPOSE 8090

ENTRYPOINT ["java", "-jar", "app.jar"]

