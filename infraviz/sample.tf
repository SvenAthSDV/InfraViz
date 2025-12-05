resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "web" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
}

resource "aws_instance" "web_server" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.web.id
}

resource "aws_s3_bucket" "logs" {
  bucket = "my-app-logs"
}

resource "aws_instance" "worker" {
  ami           = "ami-87654321"
  instance_type = "t2.medium"
  subnet_id     = aws_subnet.web.id
}
