// Author: Nathan Luong
variable "TORCHXRAYVISION_MODEL_URL" {
    type = string
    sensitive = true
}

variable "NEURALANALYZER_MODEL_URL" {
    type = string
    sensitive = true
}

variable "COGNITO_USER_POOL_ID" {
    type = string
    sensitive = true
}

variable "COGNITO_APP_CLIENT_ID" {
    type = string
    sensitive = true
}

variable "COGNITO_APP_CLIENT_SECRET" {
    type = string
    sensitive = true
}

variable "AWS_REGION" {
    type = string
    sensitive = true
}

variable "AWS_ACCESS_KEY_ID" {
    type = string
    sensitive = true
}

variable "AWS_SECRET_ACCESS_KEY" {
    type = string
    sensitive = true
}

variable "OPENAI_API_KEY" {
    type = string
    sensitive = true
}

variable "acm_ssl_certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
  default = "arn:aws:acm:us-west-2:893123825267:certificate/73e08c1d-f7d9-4ad9-9cf4-589bbc2f1bb6"
}