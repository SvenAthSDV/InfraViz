provider "aws" {
  region = "us-east-1"
}

# 1. LE CONTENEUR GLOBAL (VPC)
resource "aws_vpc" "production_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  
  tags = {
    Name = "Production-VPC"
    Environment = "Prod"
  }
}

# 2. LA PORTE D'ENTRÉE (Gateway)
resource "aws_internet_gateway" "main_gw" {
  vpc_id = aws_vpc.production_vpc.id
  
  tags = {
    Name = "Main-IGW"
  }
}

# ============================================================
# ZONE PUBLIQUE (Load Balancer Layer)
# ============================================================

resource "aws_subnet" "public_subnet_1" {
  vpc_id            = aws_vpc.production_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  
  tags = {
    Name = "Public-Subnet-AZ1"
    Type = "Frontend"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id            = aws_vpc.production_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "Public-Subnet-AZ2"
    Type = "Frontend"
  }
}

# Security Group pour le Load Balancer
resource "aws_security_group" "alb_sg" {
  name        = "alb-security-group"
  description = "Allow HTTP/HTTPS from Internet"
  vpc_id      = aws_vpc.production_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Le Load Balancer (Ressource complexe avec beaucoup de liens)
resource "aws_lb" "app_alb" {
  name               = "app-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]

  tags = {
    Environment = "Production"
  }
}

# ============================================================
# ZONE PRIVÉE (Application Layer)
# ============================================================

resource "aws_subnet" "private_app_subnet_1" {
  vpc_id            = aws_vpc.production_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "Private-App-AZ1"
  }
}

resource "aws_security_group" "app_sg" {
  name        = "app-security-group"
  description = "Allow traffic from ALB only"
  vpc_id      = aws_vpc.production_vpc.id

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id] # Lien de dépendance SG -> SG
  }
}

# Instance Web 1
resource "aws_instance" "web_worker_1" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"
  subnet_id     = aws_subnet.private_app_subnet_1.id
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "Worker-Node-01"
    Role = "API-Server"
  }
}

# Instance Web 2 (Pour tester l'alignement horizontal)
resource "aws_instance" "web_worker_2" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"
  subnet_id     = aws_subnet.private_app_subnet_1.id # Même subnet pour voir le grouping
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "Worker-Node-02"
    Role = "API-Server"
  }
}

# ============================================================
# ZONE DE DONNÉES (Database Layer)
# ============================================================

resource "aws_subnet" "database_subnet_1" {
  vpc_id            = aws_vpc.production_vpc.id
  cidr_block        = "10.0.20.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "DB-Subnet-Secure"
  }
}

resource "aws_db_subnet_group" "main_db_group" {
  name       = "main-db-group"
  subnet_ids = [aws_subnet.database_subnet_1.id]

  tags = {
    Name = "My DB Subnet Group"
  }
}

resource "aws_security_group" "db_sg" {
  name        = "db-security-group"
  vpc_id      = aws_vpc.production_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id] # Lien App -> DB
  }
}

# La Base de données (Grosse carte avec beaucoup d'infos)
resource "aws_db_instance" "postgres_primary" {
  allocated_storage    = 20
  db_name              = "production_db"
  engine               = "postgres"
  engine_version       = "13.7"
  instance_class       = "db.t3.micro"
  username             = "admin_user"
  password             = "supersecretpassword123!"
  db_subnet_group_name = aws_db_subnet_group.main_db_group.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  skip_final_snapshot  = true

  tags = {
    Name = "Primary-Postgres-Cluster"
    Backup = "Daily"
  }
}