{{- define "ai-ml-service.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "ai-ml-service.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- include "ai-ml-service.name" . -}}
{{- end -}}
{{- end -}}

{{- define "ai-ml-service.labels" -}}
app.kubernetes.io/name: {{ include "ai-ml-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
{{- end -}}

{{- define "ai-ml-service.selectorLabels" -}}
app.kubernetes.io/name: {{ include "ai-ml-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
