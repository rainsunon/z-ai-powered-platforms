#!/bin/bash
# Build script for Flink analytics job

echo "Building Flink Analytics Job..."
mvn clean package

echo "Build complete. JAR file: target/flink-analytics-1.0.0.jar"