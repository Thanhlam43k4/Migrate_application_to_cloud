variable "ami_id" {
  type = string
}
variable "instance_type" {
  type = string
}
variable "public_subnet1_id" {
  type = string
}
variable "public_subnet2_id" {
  type = string
}
variable "vpc_id" {
  type = string
}
variable "key_id" {
  type = string
}
variable "availability_zone" {
  type = list
}
variable "user-data"{
  type = string
}