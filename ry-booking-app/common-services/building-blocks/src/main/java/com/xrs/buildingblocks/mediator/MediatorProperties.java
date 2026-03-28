package com.xrs.buildingblocks.mediator;


import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */

@ConfigurationProperties(prefix = "mediator")
@ConditionalOnBean({MediatorConfiguration.class})
public class MediatorProperties {

 private boolean enabled = true;
 private boolean enabledLogPipeline = true;

 public boolean isEnabled() {
  return enabled;
 }

 public void setEnabled(boolean enabled) {
  this.enabled = enabled;
 }

 public boolean isEnabledLogPipeline() {
  return enabledLogPipeline;
 }

 public void setEnabledLogPipeline(boolean enabledLogPipeline) {
  this.enabledLogPipeline = enabledLogPipeline;
 }
}