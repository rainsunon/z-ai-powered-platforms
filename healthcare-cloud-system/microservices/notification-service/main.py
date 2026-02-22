from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from kafka import KafkaConsumer
from prometheus_client import Counter, generate_latest
from starlette.responses import Response
import boto3
import json
import threading
import os
import logging
from datetime import datetime
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Prometheus metrics
NOTIFICATION_COUNT = Counter('notifications_sent_total', 'Total notifications sent', ['type'])

# AWS SNS client (for sending notifications)
try:
    sns_client = boto3.client('sns', region_name=os.getenv('AWS_REGION', 'ap-south-1'))
    logger.info("Connected to AWS SNS")
except Exception as e:
    logger.error(f"Failed to connect to AWS SNS: {e}")
    sns_client = None

# DynamoDB client (for logging notifications)
try:
    dynamodb = boto3.resource('dynamodb', region_name=os.getenv('AWS_REGION', 'ap-south-1'))
    notifications_table = dynamodb.Table(os.getenv('DYNAMODB_TABLE', 'healthcare-notifications'))
    logger.info(f"Connected to DynamoDB table: {notifications_table.name}")
except Exception as e:
    logger.error(f"Failed to connect to DynamoDB: {e}")
    notifications_table = None

# Kafka consumer setup
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
KAFKA_TOPICS = ['appointment-events', 'user-events', 'payment-events']

app = FastAPI(title="Notification Service", version="1.0.0")

class Notification(BaseModel):
    recipient: str
    message: str
    type: str  # email, sms, push

def send_notification(notification_type: str, recipient: str, message: str):
    """Send notification and log to DynamoDB"""
    notification_id = f"notif-{int(time.time() * 1000)}"
    
    # In production, use actual SNS/SES
    # For demo, we'll just log
    logger.info(f"Sending {notification_type} to {recipient}: {message}")
    
    # Log to DynamoDB
    if notifications_table:
        try:
            notifications_table.put_item(
                Item={
                    'notification_id': notification_id,
                    'type': notification_type,
                    'recipient': recipient,
                    'message': message,
                    'status': 'sent',
                    'timestamp': datetime.utcnow().isoformat()
                }
            )
            logger.info(f"Logged notification to DynamoDB: {notification_id}")
        except Exception as e:
            logger.error(f"Failed to log to DynamoDB: {e}")
    
    NOTIFICATION_COUNT.labels(type=notification_type).inc()
    return notification_id

def process_appointment_event(event: dict):
    """Process appointment events and send notifications"""
    event_type = event.get('event_type')
    
    if event_type == 'appointment_created':
        patient_id = event.get('patient_id')
        doctor_id = event.get('doctor_id')
        appointment_datetime = event.get('appointment_datetime')
        
        # Send notification to patient
        message = f"Your appointment has been scheduled for {appointment_datetime}"
        send_notification('email', f"patient-{patient_id}@healthcare.com", message)
        
        # Send notification to doctor
        message = f"New appointment scheduled with patient {patient_id} at {appointment_datetime}"
        send_notification('email', f"doctor-{doctor_id}@healthcare.com", message)
        
    elif event_type == 'appointment_status_updated':
        appointment_id = event.get('appointment_id')
        status = event.get('status')
        message = f"Appointment {appointment_id} status updated to: {status}"
        send_notification('email', "admin@healthcare.com", message)

def process_user_event(event: dict):
    """Process user events and send notifications"""
    event_type = event.get('event_type')
    
    if event_type == 'user_registered':
        email = event.get('email')
        message = "Welcome to Healthcare System! Your account has been created successfully."
        send_notification('email', email, message)

def process_payment_event(event: dict):
    """Process payment events and send notifications"""
    event_type = event.get('event_type')
    
    if event_type == 'payment_completed':
        user_id = event.get('user_id')
        amount = event.get('amount')
        message = f"Payment of ${amount} has been processed successfully"
        send_notification('email', f"user-{user_id}@healthcare.com", message)

def kafka_consumer_thread():
    """Background thread to consume Kafka messages"""
    try:
        consumer = KafkaConsumer(
            *KAFKA_TOPICS,
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS.split(','),
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            group_id='notification-service-group',
            auto_offset_reset='latest',
            enable_auto_commit=True
        )
        logger.info(f"Kafka consumer started for topics: {KAFKA_TOPICS}")
        
        for message in consumer:
            try:
                event = message.value
                topic = message.topic
                logger.info(f"Received event from {topic}: {event}")
                
                if topic == 'appointment-events':
                    process_appointment_event(event)
                elif topic == 'user-events':
                    process_user_event(event)
                elif topic == 'payment-events':
                    process_payment_event(event)
                    
            except Exception as e:
                logger.error(f"Error processing message: {e}")
                
    except Exception as e:
        logger.error(f"Kafka consumer error: {e}")

# Start Kafka consumer in background thread
consumer_thread = threading.Thread(target=kafka_consumer_thread, daemon=True)
consumer_thread.start()

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "notification-service",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/metrics")
async def metrics():
    return Response(content=generate_latest(), media_type="text/plain")

@app.post("/notifications")
async def send_manual_notification(notification: Notification, background_tasks: BackgroundTasks):
    """Manual endpoint to send notifications"""
    notification_id = send_notification(
        notification.type,
        notification.recipient,
        notification.message
    )
    return {
        "notification_id": notification_id,
        "status": "sent"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)