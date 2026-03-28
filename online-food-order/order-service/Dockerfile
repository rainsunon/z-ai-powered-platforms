FROM openjdk:14-jdk-alpine
MAINTAINER upgrad
ADD ./target/order-service.jar /usr/OFO-App/order-service.jar
WORKDIR /usr/OFO-App
ENV PATH="${PATH}:${JAVA_HOME}/bin"
EXPOSE 8080
ENTRYPOINT [ "java", "-Djdk.tls.client.protocols=TLSv1.2", "-jar", "/usr/OFO-App/order-service.jar"]