#!/bin/bash
sed -i '' '/<\/dependencies>/i\
\t\t<dependency>\
\t\t\t<groupId>org.springframework.boot<\/groupId>\
\t\t\t<artifactId>spring-boot-starter-oauth2-resource-server<\/artifactId>\
\t\t<\/dependency>\
' pom.xml
