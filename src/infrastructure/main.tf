provider "aws" {
  region = "us-west-2"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index}.0/24"
  availability_zone       = element(["us-west-2a", "us-west-2b"], count.index)
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 2}.0/24"
  availability_zone = element(["us-west-2a", "us-west-2b"], count.index)
}

resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main-igw"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_igw.id
  }

  tags = {
    Name = "public-route-table"
  }
}

resource "aws_route_table_association" "public_subnet_association" {
  count          = length(aws_subnet.public[*].id)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_security_group" "frontend_sg" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Open to internet
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "backend_sg" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Open to internet
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "torch_sg" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "torch_sg"
  }
}

resource "aws_lb" "frontend_lb" {
  name               = "frontend-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.frontend_sg.id]
  subnets            = aws_subnet.public[*].id
}

resource "aws_lb_target_group" "frontend_tg" {
  name     = "frontend-tg"
  port     = 80 
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  target_type = "ip"
}

resource "aws_lb_listener" "frontend_listener" {
  load_balancer_arn = aws_lb.frontend_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }
}

resource "aws_lb" "backend_lb" {
  name               = "backend-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.backend_sg.id]
  subnets            = aws_subnet.public[*].id
}

resource "aws_lb_target_group" "backend_tg" {
  name     = "backend-tg"
  port     = 5000 # Ensure this matches the backend containerPort
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  target_type = "ip"
  health_check {
    port = 5000
    path = "/health"
    protocol = "HTTP"
    interval = 300
    timeout = 10
    healthy_threshold = 3
    unhealthy_threshold = 3
    matcher = 200
  }
}

resource "aws_lb_listener" "backend_listener" {
  load_balancer_arn = aws_lb.backend_lb.arn
  port              = 5000
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }
}

resource "aws_ecs_cluster" "main" {
  name = "neuralanalyzer-cluster"
}

# Task Definitions
resource "aws_ecs_task_definition" "frontend" {
  family                   = "neuralanalyzer-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  memory                   = "512"
  cpu                      = "256"
  task_role_arn            = "arn:aws:iam::893123825267:role/ecsTaskExecutionRole"
  execution_role_arn       = "arn:aws:iam::893123825267:role/ecsTaskExecutionRole"

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "893123825267.dkr.ecr.us-west-2.amazonaws.com/neuralanalyzer/frontend:latest"
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.frontend_logs.name
          awslogs-region        = "us-west-2"
          awslogs-stream-prefix = "ecs"
        }
      }

      cpu       = 128
      memory    = 256
      essential = true
      portMappings = [{ containerPort = 80 }]
      environment = [
        { name = "REACT_APP_API_URL", value = "http://${aws_lb.backend_lb.dns_name}:5000" },
        { name = "AWS_REGION", value = var.AWS_REGION }
      ]
    }
  ])
}

resource "aws_cloudwatch_log_group" "frontend_logs" {
  name              = "/ecs/neuralanalyzer-frontend"
  retention_in_days = 1
}

resource "aws_ecs_task_definition" "torchxrayvision" {
  family                   = "neuralanalyzer-torchxrayvision"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  memory                   = "2048"
  cpu                      = "1024"
  task_role_arn            = "arn:aws:iam::893123825267:role/ecsTaskExecutionRole"
  execution_role_arn       = "arn:aws:iam::893123825267:role/ecsTaskExecutionRole"
  #  Run on arm64 architecture
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([
    {
      name      = "torchxrayvision"
      image     = "893123825267.dkr.ecr.us-west-2.amazonaws.com/neuralanalyzer/torchxrayvision:latest"
      memory    = 2048
      cpu       = 1024
      essential = true
      portMappings = [{ containerPort = 80 }]
      environment = []
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.torchxrayvision_logs.name
          awslogs-region        = "us-west-2"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

resource "aws_cloudwatch_log_group" "torchxrayvision_logs" {
  name              = "/ecs/neuralanalyzer-torchxrayvision"
  retention_in_days = 1
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "neuralanalyzer-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  memory                   = "512"
  cpu                      = "256"
  task_role_arn            = "arn:aws:iam::893123825267:role/ecsTaskExecutionRole"
  execution_role_arn       = "arn:aws:iam::893123825267:role/ecsTaskExecutionRole"

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "893123825267.dkr.ecr.us-west-2.amazonaws.com/neuralanalyzer/backend:latest"
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.backend_logs.name
          awslogs-region        = "us-west-2"
          awslogs-stream-prefix = "ecs"
        }
      }
      cpu       = 128
      memory    = 256
      essential = true
      portMappings = [{ containerPort = 5000 }]
      environment = [
        { name = "FRONTEND_URL", value = "http://${aws_lb.frontend_lb.dns_name}" },
        { name = "TORCHXRAYVISION_MODEL_URL", value = var.TORCHXRAYVISION_MODEL_URL },
        { name = "NEURALANALYZER_MODEL_URL", value = var.NEURALANALYZER_MODEL_URL },
        { name = "COGNITO_USER_POOL_ID", value = var.COGNITO_USER_POOL_ID },
        { name = "COGNITO_APP_CLIENT_ID", value = var.COGNITO_APP_CLIENT_ID },
        { name = "COGNITO_APP_CLIENT_SECRET", value = var.COGNITO_APP_CLIENT_SECRET },
        { name = "AWS_REGION", value = var.AWS_REGION },
        { name = "AWS_ACCESS_KEY_ID", value = var.AWS_ACCESS_KEY_ID },
        { name = "AWS_SECRET_ACCESS_KEY", value = var.AWS_SECRET_ACCESS_KEY },
        { name = "OPENAI_API_KEY", value = var.OPENAI_API_KEY }
      ]
    }
  ])
}

resource "aws_cloudwatch_log_group" "backend_logs" {
  name              = "/ecs/neuralanalyzer-backend"
  retention_in_days = 1
}


# Services

resource "aws_ecs_service" "torchxrayvision" {
  name            = "torchxrayvision-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.torchxrayvision.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets         = aws_subnet.public[*].id
    security_groups = [aws_security_group.backend_sg.id]
    assign_public_ip = true
  }
}

resource "aws_ecs_service" "backend" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets         = aws_subnet.public[*].id
    security_groups = [aws_security_group.backend_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "backend"
    container_port   = 5000
  }

  depends_on = [
    aws_ecs_service.torchxrayvision, 
    aws_lb_listener.backend_listener
  ]
}

resource "aws_ecs_service" "frontend" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets         = aws_subnet.public[*].id
    security_groups = [aws_security_group.frontend_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_tg.arn
    container_name   = "frontend"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.frontend_listener]
}


resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "private-route-table"
  }
}

resource "aws_route_table_association" "private_subnet_association" {
  count          = length(aws_subnet.private[*].id)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private_rt.id
}


# Security Group for ECR Endpoints
resource "aws_security_group" "aws_services_related_endpoints_sg" {
  name   = "aws-services-related-endpoints-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "aws-services-related-endpoints-sg"
  }
  lifecycle {
    create_before_destroy = true
  }
}

# ECR API Endpoint
resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-west-2.ecr.api"
  vpc_endpoint_type = "Interface"
  subnet_ids        = aws_subnet.private[*].id
  security_group_ids = [aws_security_group.aws_services_related_endpoints_sg.id]
  private_dns_enabled = true

  tags = {
    Name = "ecr-api-endpoint"
  }
}

# ECR Docker Registry Endpoint
resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-west-2.ecr.dkr"
  vpc_endpoint_type = "Interface"
  subnet_ids        = aws_subnet.private[*].id
  security_group_ids = [aws_security_group.aws_services_related_endpoints_sg.id]
  private_dns_enabled = true

  tags = {
    Name = "ecr-dkr-endpoint"
  }
}

# S3 Endpoint for ECR Layer Downloads
resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.main.id
  service_name = "com.amazonaws.us-west-2.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = [
    aws_route_table.public_rt.id,
    aws_route_table.private_rt.id
  ]

  tags = {
    Name = "s3-endpoint"
  }
}

resource "aws_vpc_endpoint" "logs" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-west-2.logs"
  vpc_endpoint_type = "Interface"
  subnet_ids        = aws_subnet.private[*].id
  security_group_ids = [aws_security_group.aws_services_related_endpoints_sg.id] 
  private_dns_enabled = true

  tags = {
    Name = "cloudwatch-logs-endpoint"
  }
}