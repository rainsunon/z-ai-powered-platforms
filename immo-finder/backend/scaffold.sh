#!/bin/bash

# Base URL for Spring Initializr
BASE_URL="https://start.spring.io/starter.zip"

# Common parameters
PARAMS="type=maven-project&language=java&bootVersion=3.5.11&baseDir=&groupId=com.github.xrs.immo_finder&javaVersion=21&packaging=jar"

# 1. buy-service
echo "Generating buy-service..."
curl -s "$BASE_URL?$PARAMS&artifactId=buy-service&name=buy-service&description=Buy%20Service&dependencies=web,data-jpa,postgresql,validation,actuator,kafka,flyway,lombok" -o buy-service.zip
unzip -qoo buy-service.zip -d buy-service
rm buy-service.zip

# 2. photo-service
echo "Generating photo-service..."
curl -s "$BASE_URL?$PARAMS&artifactId=photo-service&name=photo-service&description=Photo%20Service&dependencies=web,data-jpa,postgresql,validation,actuator,kafka,flyway,lombok" -o photo-service.zip
unzip -qoo photo-service.zip -d photo-service
rm photo-service.zip

# 3. favorite-service
echo "Generating favorite-service..."
curl -s "$BASE_URL?$PARAMS&artifactId=favorite-service&name=favorite-service&description=Favorite%20Service&dependencies=web,data-jpa,postgresql,data-redis,validation,actuator,kafka,flyway,lombok" -o favorite-service.zip
unzip -qoo favorite-service.zip -d favorite-service
rm favorite-service.zip

# 4. search-service
echo "Generating search-service..."
curl -s "$BASE_URL?$PARAMS&artifactId=search-service&name=search-service&description=Search%20Service&dependencies=web,data-elasticsearch,validation,actuator,kafka,lombok" -o search-service.zip
unzip -qoo search-service.zip -d search-service
rm search-service.zip

# 5. auth-gateway
echo "Generating auth-gateway..."
curl -s "$BASE_URL?$PARAMS&artifactId=auth-gateway&name=auth-gateway&description=Auth%20Gateway&dependencies=cloud-gateway,cloud-resilience4j,data-redis-reactive,actuator,lombok" -o auth-gateway.zip
unzip -qoo auth-gateway.zip -d auth-gateway
rm auth-gateway.zip

# 6. audit-service
echo "Generating audit-service..."
curl -s "$BASE_URL?$PARAMS&artifactId=audit-service&name=audit-service&description=Audit%20Service&dependencies=web,data-mongodb,validation,actuator,kafka,lombok" -o audit-service.zip
unzip -qoo audit-service.zip -d audit-service
rm audit-service.zip

# 7. analytics-service
echo "Generating analytics-service..."
curl -s "$BASE_URL?$PARAMS&artifactId=analytics-service&name=analytics-service&description=Analytics%20Service&dependencies=web,data-jpa,postgresql,validation,actuator,kafka,flyway,lombok" -o analytics-service.zip
unzip -qoo analytics-service.zip -d analytics-service
rm analytics-service.zip

echo "All services generated successfully!"
