package com.healthcare.analytics;

import com.google.gson.JsonObject;
import java.io.Serializable;

public class AppointmentEvent implements Serializable {
    private String eventType;
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private String timestamp;
    
    public AppointmentEvent() {}
    
    public AppointmentEvent(String eventType, Long appointmentId, Long patientId, Long doctorId, String timestamp) {
        this.eventType = eventType;
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.timestamp = timestamp;
    }
    
    public static AppointmentEvent fromJson(String json) {
        com.google.gson.Gson gson = new com.google.gson.Gson();
        JsonObject obj = gson.fromJson(json, JsonObject.class);
        
        return new AppointmentEvent(
            obj.has("event_type") ? obj.get("event_type").getAsString() : null,
            obj.has("appointment_id") ? obj.get("appointment_id").getAsLong() : null,
            obj.has("patient_id") ? obj.get("patient_id").getAsLong() : null,
            obj.has("doctor_id") ? obj.get("doctor_id").getAsLong() : null,
            obj.has("timestamp") ? obj.get("timestamp").getAsString() : null
        );
    }
    
    // Getters and setters
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}