package com.healthcare.appointment.service;

import com.healthcare.appointment.model.Appointment;
import com.healthcare.appointment.dto.AppointmentRequest;
import com.healthcare.appointment.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private KafkaTemplate<String, Map<String, Object>> kafkaTemplate;
    
    public Appointment createAppointment(AppointmentRequest request) {
        Appointment appointment = new Appointment();
        appointment.setPatientId(request.getPatientId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentDatetime(request.getAppointmentDatetime());
        appointment.setReason(request.getReason());
        
        Appointment saved = appointmentRepository.save(appointment);
        
        // Publish to Kafka
        Map<String, Object> event = new HashMap<>();
        event.put("event_type", "appointment_created");
        event.put("appointment_id", saved.getId());
        event.put("patient_id", saved.getPatientId());
        event.put("doctor_id", saved.getDoctorId());
        event.put("appointment_datetime", saved.getAppointmentDatetime().toString());
        event.put("timestamp", LocalDateTime.now().toString());
        
        kafkaTemplate.send("appointment-events", event);
        
        return saved;
    }
    
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }
    
    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }
    
    public Appointment updateAppointmentStatus(Long id, String status) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(status);
            
            Appointment updated = appointmentRepository.save(appointment);
            
            // Publish to Kafka
            Map<String, Object> event = new HashMap<>();
            event.put("event_type", "appointment_status_updated");
            event.put("appointment_id", updated.getId());
            event.put("status", status);
            event.put("timestamp", LocalDateTime.now().toString());
            
            kafkaTemplate.send("appointment-events", event);
            
            return updated;
        }
        throw new RuntimeException("Appointment not found");
    }
}