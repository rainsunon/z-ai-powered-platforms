FROM maven:latest
VOLUME /tmp
ARG PROJECT_VERSION=0.0.1
RUN mkdir -p /home/app
WORKDIR /home/app
ENV SPRING_PROFILES_ACTIVE application
COPY ./ .
ADD target/analytics-service-1.0-SNAPSHOT.jar analytics-service-1.0-SNAPSHOT.jar
EXPOSE 8093
ENTRYPOINT ["java", "-jar", "analytics-service-1.0-SNAPSHOT.jar"]
CMD ["mvn", "spring-boot:run"]