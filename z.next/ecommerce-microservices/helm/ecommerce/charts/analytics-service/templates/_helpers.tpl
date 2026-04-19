{{- define "analytics-service.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "analytics-service.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- include "analytics-service.name" . -}}
{{- end -}}
{{- end -}}

{{- define "analytics-service.labels" -}}
app.kubernetes.io/name: {{ include "analytics-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
{{- end -}}

{{- define "analytics-service.selectorLabels" -}}
app.kubernetes.io/name: {{ include "analytics-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
