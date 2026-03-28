FROM openjdk:14-jdk-alpine
MAINTAINER upgrad
ADD ./target/security-service.jar /usr/OFO-App/security-service.jar
WORKDIR /usr/OFO-App
ENV PATH="${PATH}:${JAVA_HOME}/bin"
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "/usr/OFO-App/security-service.jar"]