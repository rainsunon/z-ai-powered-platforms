FROM openjdk:14-jdk-alpine
MAINTAINER upgrad
ADD ./target/ofo-gateway.jar /usr/OFO-App/ofo-gateway.jar
WORKDIR /usr/OFO-App
ENV PATH="${PATH}:${JAVA_HOME}/bin"
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "/usr/OFO-App/ofo-gateway.jar"]