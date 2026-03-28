FROM openjdk:14-jdk-alpine
MAINTAINER upgrad
ADD ./target/user-service.jar /usr/OFO-App/user-service.jar
WORKDIR /usr/OFO-App
ENV PATH="${PATH}:${JAVA_HOME}/bin"
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "/usr/OFO-App/user-service.jar"]