provider "aws" {
  region = "us-west-2"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
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
    security_groups = [aws_security_group.frontend_sg.id] # Allow only frontend
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
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    security_groups = [aws_security_group.backend_sg.id] # Allow only backend
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
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
  port     = 3000 
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
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.backend_sg.id]
  subnets            = aws_subnet.private[*].id
}

resource "aws_lb_target_group" "backend_tg" {
  name     = "backend-tg"
  port     = 5000 # Ensure this matches the backend containerPort
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  target_type = "ip"
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
  execution_role_arn       = "arn:aws:iam::893123825267:role/ecsTaskExecutionRole"

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "893123825267.dkr.ecr.us-west-2.amazonaws.com/neuralanalyzer/frontend:latest"
      cpu       = 128
      memory    = 256
      essential = true
      portMappings = [{ containerPort = 3000 }]
      environment = [
        { name = "REACT_APP_API_URL", value = "http://${aws_lb.backend_lb.dns_name}:5000" }
      ]
    }
  ])
}

resource "aws_ecs_task_definition" "torchxrayvision" {
  family                   = "neuralanalyzer-torchxrayvision"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  memory                   = "512"
  cpu                      = "256"
  execution_role_arn       = "arn:aws:iam::893123825267:role/ecsTaskExecutionRole"

  container_definitions = jsonencode([
    {
      name      = "torchxrayvision"
      image     = "893123825267.dkr.ecr.us-west-2.amazonaws.com/neuralanalyzer/torchxrayvision:latest"
      cpu       = 128
      memory    = 256
      essential = true
      portMappings = [{ containerPort = 80 }]
      environment = []
    }
  ])
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "neuralanalyzer-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  memory                   = "512"
  cpu                      = "256"
  execution_role_arn       = "arn:aws:iam::893123825267:role/ecsTaskExecutionRole"

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "893123825267.dkr.ecr.us-west-2.amazonaws.com/neuralanalyzer/backend:latest"
      cpu       = 128
      memory    = 256
      essential = true
      portMappings = [{ containerPort = 5000 }]
      environment = []
    }
  ])
}


# Services

resource "aws_ecs_service" "torchxrayvision" {
  name            = "torchxrayvision-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.torchxrayvision.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.private[*].id
    security_groups = [aws_security_group.torch_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "torchxrayvision"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.backend_listener]
}

resource "aws_ecs_service" "backend" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.private[*].id
    security_groups = [aws_security_group.backend_sg.id]
    assign_public_ip = false
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

  network_configuration {
    subnets         = aws_subnet.public[*].id
    security_groups = [aws_security_group.frontend_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_tg.arn
    container_name   = "frontend"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.frontend_listener]
}

