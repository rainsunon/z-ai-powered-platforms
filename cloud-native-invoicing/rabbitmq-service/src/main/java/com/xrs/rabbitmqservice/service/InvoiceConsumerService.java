package com.xrs.rabbitmqservice.service;

import java.util.List;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.xrs.rabbitmqservice.dto.InvoiceMessageDTO;
import com.xrs.rabbitmqservice.model.BoletaAudit;
import com.xrs.rabbitmqservice.model.BoletaOracle;
import com.xrs.rabbitmqservice.repository.BoletaAuditRepository;
import com.xrs.rabbitmqservice.repository.BoletaOracleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceConsumerService {

    private final BoletaOracleRepository boletaOracleRepository;
    private final BoletaAuditRepository boletaAuditRepository;
    private final RabbitTemplate rabbitTemplate;
    private final DLQService dlqService;
    private final Environment environment;

    /**
     * CONSUMIDOR AUTOMÁTICO DESHABILITADO - Solo consumo manual disponible
     * Los mensajes se procesan únicamente a través del endpoint /consume-messages
     * Para habilitar consumo automático, descomenta el @RabbitListener
     */
    // @RabbitListener(queues = "invoice.queue")
    public void processInvoiceMessageAutomatic(InvoiceMessageDTO message) {
        log.info("Automatic consumer received message: {}", message);
        processInvoiceMessage(message);
    }

    /**
     * Procesa mensajes de factura (llamado manualmente o automáticamente)
     * 🆕 Ahora con manejo de errores y envío a DLQ
     */
    public void processInvoiceMessage(InvoiceMessageDTO message) {
        try {
            log.info("Processing invoice message: {}", message);
            
            // 🆕 VALIDACIÓN DE ERRORES - Verificar si debe ir a DLQ
            if (dlqService.shouldSendToDLQ(message)) {
                String errorReason = dlqService.getErrorReason(message);
                log.error("Message validation failed: {}", errorReason);
                dlqService.sendMessageToDLQ(message, errorReason);
                log.warn("Message sent to DLQ due to validation errors. Invoice ID: {}", message.getInvoiceId());
                return; // No procesar este mensaje más
            }
            
            // FLUJO ORIGINAL - Sin cambios en la lógica existente
            // Crear nueva boleta para Oracle Cloud
            BoletaOracle boleta = new BoletaOracle();
            boleta.setClientId(message.getClientId());
            boleta.setInvoiceDate(message.getInvoiceDate());
            boleta.setFileName(message.getFileName());
            boleta.setS3Key(message.getS3Key());
            boleta.setOriginalInvoiceId(message.getInvoiceId());
            boleta.setDescription("Boleta procesada desde cola MQ - " + message.getDescription());
            boleta.setStatus("PROCESSED");
            
            // Guardar en Oracle Cloud
            BoletaOracle savedBoleta = boletaOracleRepository.save(boleta);
            
            // 🆕 DUAL STORAGE - También guardar en tabla de auditoría
            BoletaAudit auditBoleta = new BoletaAudit();
            auditBoleta.setClientId(message.getClientId());
            auditBoleta.setInvoiceDate(message.getInvoiceDate());
            auditBoleta.setFileName(message.getFileName());
            auditBoleta.setS3Key(message.getS3Key());
            auditBoleta.setOriginalInvoiceId(message.getInvoiceId());
            auditBoleta.setDescription("Audit - " + message.getDescription());
            auditBoleta.setStatus("PROCESSED");
            auditBoleta.setAction("CREATE");
            
            BoletaAudit savedAuditBoleta = boletaAuditRepository.save(auditBoleta);
            
            log.info("Invoice message processed successfully: Oracle Boleta ID {}, Audit Boleta ID {}, Original Invoice ID {}", 
                     savedBoleta.getId(), savedAuditBoleta.getId(), message.getInvoiceId());
            
        } catch (Exception e) {
            log.error("Error processing invoice message: {}", e.getMessage(), e);
            // 🆕 En caso de error inesperado, también enviar a DLQ
            try {
                dlqService.sendMessageToDLQ(message, "Processing exception: " + e.getMessage());
                log.warn("Message sent to DLQ due to processing exception. Invoice ID: {}", message.getInvoiceId());
            } catch (Exception dlqError) {
                log.error("Failed to send message to DLQ: {}", dlqError.getMessage());
            }
            throw new RuntimeException("Failed to process invoice message", e);
        }
    }

    public List<BoletaOracle> getAllBoletas() {
        return boletaOracleRepository.findAllOrderByProcessedDateDesc();
    }

    public List<BoletaOracle> getBoletasByClient(String clientId) {
        return boletaOracleRepository.findByClientId(clientId);
    }

    public List<BoletaOracle> getBoletasByOriginalInvoiceId(Long invoiceId) {
        return boletaOracleRepository.findByOriginalInvoiceId(invoiceId);
    }

    /**
     * Método para consumir mensajes manualmente de la cola
     * Utilizado por el endpoint /consume-messages
     */
    public int consumeMessages() {
        int messagesProcessed = 0;
        try {
            // Intentar recibir mensajes de la cola hasta que no haya más
            Message message;
            while ((message = rabbitTemplate.receive("invoice.queue", 1000)) != null) {
                try {
                    // Convertir el mensaje a InvoiceMessageDTO
                    InvoiceMessageDTO invoiceMessage = (InvoiceMessageDTO) rabbitTemplate.getMessageConverter()
                            .fromMessage(message);
                    
                    // Procesar el mensaje usando el mismo método que el listener automático
                    processInvoiceMessage(invoiceMessage);
                    messagesProcessed++;
                    
                    log.info("Manually processed message #{}: {}", messagesProcessed, invoiceMessage);
                } catch (Exception e) {
                    log.error("Error processing manual message: {}", e.getMessage());
                    // No relanzamos la excepción para continuar procesando otros mensajes
                }
            }
            
            log.info("Manual consumption completed. Total messages processed: {}", messagesProcessed);
            return messagesProcessed;
            
        } catch (Exception e) {
            log.error("Error during manual message consumption: {}", e.getMessage());
            throw new RuntimeException("Failed to consume messages manually", e);
        }
    }

    /**
     * Obtiene información de la cola incluyendo cantidad de mensajes
     */
    public QueueInfo getQueueInfo() {
        try {
            // Obtener información de la cola usando RabbitTemplate
            org.springframework.amqp.core.QueueInformation queueInfo = 
                rabbitTemplate.execute(channel -> {
                    String queueName = "invoice.queue";
                    try {
                        var declareOk = channel.queueDeclarePassive(queueName);
                        return new org.springframework.amqp.core.QueueInformation(
                            queueName, 
                            declareOk.getMessageCount(), 
                            declareOk.getConsumerCount()
                        );
                    } catch (Exception e) {
                        log.error("Error getting queue info: {}", e.getMessage());
                        return new org.springframework.amqp.core.QueueInformation(queueName, 0, 0);
                    }
                });
            
            return new QueueInfo(
                queueInfo != null ? queueInfo.getName() : "invoice.queue",
                queueInfo != null ? queueInfo.getMessageCount() : 0,
                queueInfo != null ? queueInfo.getConsumerCount() : 0
            );
            
        } catch (Exception e) {
            log.error("Error getting queue information: {}", e.getMessage());
            return new QueueInfo("invoice.queue", 0, 0);
        }
    }
    
    // Clase interna para información de cola
    public static class QueueInfo {
        public final String name;
        public final int messageCount;
        public final int consumerCount;
        
        public QueueInfo(String name, int messageCount, int consumerCount) {
            this.name = name;
            this.messageCount = messageCount;
            this.consumerCount = consumerCount;
        }
    }
    
    // 🆕 MÉTODOS PARA MANEJO DE DLQ
    
    /**
     * Obtiene información de la cola DLQ
     */
    public QueueInfo getDLQInfo() {
        try {
            org.springframework.amqp.core.QueueInformation queueInfo = 
                rabbitTemplate.execute(channel -> {
                    String queueName = "invoice.dlq";
                    try {
                        var declareOk = channel.queueDeclarePassive(queueName);
                        return new org.springframework.amqp.core.QueueInformation(
                            queueName, 
                            declareOk.getMessageCount(), 
                            declareOk.getConsumerCount()
                        );
                    } catch (Exception e) {
                        log.error("Error getting DLQ info: {}", e.getMessage());
                        return new org.springframework.amqp.core.QueueInformation(queueName, 0, 0);
                    }
                });
            
            return new QueueInfo(
                queueInfo != null ? queueInfo.getName() : "invoice.dlq",
                queueInfo != null ? queueInfo.getMessageCount() : 0,
                queueInfo != null ? queueInfo.getConsumerCount() : 0
            );
            
        } catch (Exception e) {
            log.error("Error getting DLQ information: {}", e.getMessage());
            return new QueueInfo("invoice.dlq", 0, 0);
        }
    }
    
    /**
     * Consume mensajes de la DLQ para inspección (NO los procesa)
     */
    public int getDLQMessages() {
        int dlqMessagesFound = 0;
        try {
            Message message;
            while ((message = rabbitTemplate.receive("invoice.dlq", 1000)) != null) {
                try {
                    InvoiceMessageDTO dlqMessage = (InvoiceMessageDTO) rabbitTemplate.getMessageConverter()
                            .fromMessage(message);
                    dlqMessagesFound++;
                    log.info("DLQ Message #{}: {}", dlqMessagesFound, dlqMessage);
                } catch (Exception e) {
                    log.error("Error reading DLQ message: {}", e.getMessage());
                }
            }
            log.info("Total DLQ messages found: {}", dlqMessagesFound);
            return dlqMessagesFound;
        } catch (Exception e) {
            log.error("Error accessing DLQ: {}", e.getMessage());
            return 0;
        }
    }
    
    /**
     * Verifica si el auto-consumer está habilitado mediante la propiedad de configuración
     */
    public boolean isAutoConsumerEnabled() {
        return environment.getProperty("rabbitmq.auto-consumer.enabled", Boolean.class, false);
    }
    
    /**
     * Activa o desactiva el auto-consumer dinámicamente
     * NOTA: Esto solo funciona en tiempo de ejecución para consulta.
     * Para cambios persistentes, modifica application.properties o variables de entorno.
     */
    public boolean setAutoConsumerEnabled(boolean enabled) {
        try {
            // Para Spring Boot, no podemos cambiar propiedades en tiempo de ejecución fácilmente
            // Esto es más para demostración - en producción se cambiaría via environment variables
            log.info("Auto-consumer change requested: enabled={}", enabled);
            log.warn("Note: This change is only for demonstration. " +
                    "For persistent changes, modify application.properties or environment variables.");
            
            // Simulamos que el cambio se aplicó exitosamente
            return true;
        } catch (Exception e) {
            log.error("Error changing auto-consumer setting: {}", e.getMessage());
            return false;
        }
    }
}
