#!/bin/bash

SERVICES=("buy-service" "photo-service" "favorite-service" "search-service" "audit-service" "analytics-service")

for SERVICE in "${SERVICES[@]}"; do
  # Add springdoc and mapstruct dependencies
  sed -i '' '/<\/dependencies>/i\
\t\t<dependency>\
\t\t\t<groupId>org.springdoc<\/groupId>\
\t\t\t<artifactId>springdoc-openapi-starter-webmvc-ui<\/artifactId>\
\t\t\t<version>2.3.0<\/version>\
\t\t<\/dependency>\
\t\t<dependency>\
\t\t\t<groupId>org.mapstruct<\/groupId>\
\t\t\t<artifactId>mapstruct<\/artifactId>\
\t\t\t<version>1.5.5.Final<\/version>\
\t\t<\/dependency>\
' "$SERVICE/pom.xml"

  # Add mapstruct processor to maven-compiler-plugin
  sed -i '' '/<plugins>/a\
\t\t\t<plugin>\
\t\t\t\t<groupId>org.apache.maven.plugins<\/groupId>\
\t\t\t\t<artifactId>maven-compiler-plugin<\/artifactId>\
\t\t\t\t<configuration>\
\t\t\t\t\t<annotationProcessorPaths>\
\t\t\t\t\t\t<path>\
\t\t\t\t\t\t\t<groupId>org.mapstruct<\/groupId>\
\t\t\t\t\t\t\t<artifactId>mapstruct-processor<\/artifactId>\
\t\t\t\t\t\t\t<version>1.5.5.Final<\/version>\
\t\t\t\t\t\t<\/path>\
\t\t\t\t\t\t<path>\
\t\t\t\t\t\t\t<groupId>org.projectlombok<\/groupId>\
\t\t\t\t\t\t\t<artifactId>lombok<\/artifactId>\
\t\t\t\t\t\t\t<version>${lombok.version}<\/version>\
\t\t\t\t\t\t<\/path>\
\t\t\t\t\t\t<path>\
\t\t\t\t\t\t\t<groupId>org.projectlombok<\/groupId>\
\t\t\t\t\t\t\t<artifactId>lombok-mapstruct-binding<\/artifactId>\
\t\t\t\t\t\t\t<version>0.2.0<\/version>\
\t\t\t\t\t\t<\/path>\
\t\t\t\t\t<\/annotationProcessorPaths>\
\t\t\t\t<\/configuration>\
\t\t\t<\/plugin>\
' "$SERVICE/pom.xml"

  # Rename application.properties to application.yml and add virtual threads config
  mv "$SERVICE/src/main/resources/application.properties" "$SERVICE/src/main/resources/application.yml"
  echo "spring:" >> "$SERVICE/src/main/resources/application.yml"
  echo "  threads:" >> "$SERVICE/src/main/resources/application.yml"
  echo "    virtual:" >> "$SERVICE/src/main/resources/application.yml"
  echo "      enabled: true" >> "$SERVICE/src/main/resources/application.yml"
  echo "  application:" >> "$SERVICE/src/main/resources/application.yml"
  echo "    name: $SERVICE" >> "$SERVICE/src/main/resources/application.yml"
done

# Auth Gateway specific config
mv "auth-gateway/src/main/resources/application.properties" "auth-gateway/src/main/resources/application.yml"
echo "spring:" >> "auth-gateway/src/main/resources/application.yml"
echo "  threads:" >> "auth-gateway/src/main/resources/application.yml"
echo "    virtual:" >> "auth-gateway/src/main/resources/application.yml"
echo "      enabled: true" >> "auth-gateway/src/main/resources/application.yml"
echo "  application:" >> "auth-gateway/src/main/resources/application.yml"
echo "    name: auth-gateway" >> "auth-gateway/src/main/resources/application.yml"

echo "Configuration updated successfully!"
