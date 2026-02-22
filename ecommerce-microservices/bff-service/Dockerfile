## start with a base image
FROM maven:latest
VOLUME /tmp
ARG PROJECT_VERSION=0.0.1
RUN mkdir -p /home/app
WORKDIR /home/app
ENV SPRING_PROFILES_ACTIVE application
COPY ./ .
ADD target/bff-service-0.0.1-SNAPSHOT.jar bff-service-0.0.1-SNAPSHOT.jar
EXPOSE 8090
ENTRYPOINT ["java", "-jar", "bff-service-0.0.1-SNAPSHOT.jar"]
CMD ["mvn", "spring-boot:run"]
