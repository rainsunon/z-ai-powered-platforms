module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  enable_irsa = true

  cluster_endpoint_public_access = true

  # EKS Managed Node Group(s)
  eks_managed_node_group_defaults = {
    ami_type       = "AL2023_x86_64_STANDARD"
    instance_types = ["t3.medium"]

    attach_cluster_primary_security_group = true
  }

  eks_managed_node_groups = {
    general = {
      name = "general-node-group"

      min_size     = 2
      max_size     = 6
      desired_size = 3

      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"

      labels = {
        role = "general"
      }

      tags = {
        NodeGroup = "general"
      }
    }

    services = {
      name = "services-node-group"

      min_size     = 2
      max_size     = 10
      desired_size = 4

      instance_types = ["t3.large"]
      capacity_type  = "SPOT"

      labels = {
        role = "services"
        workload = "microservices"
      }

      taints = [{
        key    = "workload"
        value  = "microservices"
        effect = "NO_SCHEDULE"
      }]

      tags = {
        NodeGroup = "services"
      }
    }
  }

  tags = {
    Environment = var.environment
    Project     = "OFO"
  }
}

# Install AWS Load Balancer Controller
resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  version    = "1.10.2"

  set {
    name  = "clusterName"
    value = module.eks.cluster_name
  }

  set {
    name  = "serviceAccount.create"
    value = "true"
  }

  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }

  depends_on = [module.eks]
}

# Install Strimzi Kafka Operator
resource "helm_release" "strimzi_kafka" {
  name       = "strimzi-kafka-operator"
  repository = "https://strimzi.io/charts/"
  chart      = "strimzi-kafka-operator"
  namespace  = "kafka"
  version    = "0.45.0"

  create_namespace = true

  depends_on = [module.eks]
}

