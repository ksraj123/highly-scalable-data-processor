# Kubernetes Setup

Install [minikube](https://v1-18.docs.kubernetes.io/docs/tasks/tools/install-minikube/) on local environment of setup a kubernetes cluster on a cloud platform

Install [Helm](https://helm.sh/docs/intro/install/)

This project uses the [strimzi](https://strimzi.io/) operator to manage the kafka cluster, install it using the commands below

    helm repo add strimzi https://strimzi.io/charts/
    helm install my-release strimzi/strimzi-kafka-operator

Deploy the kafka cluster and zookeeper with the following command

    kubectl apply -f kubernetes/kafka/kafka-persistent-single.yaml

For production, use the `kafka-persistent-multiple.yaml` file, it deploys a multi broker kafka cluster.

Create Kafka topic using the command

    kubectl apply -f kubernetes/kafka/kafka-topic.yaml

On minikube, enable ingress

    minikube addons enable ingress

Deploy all other kubernetes objects like, deployments for different microservices, cluster IP services, ingress using the command

    kubectl apply -f kubernetes

get the ip address of minikube using

    minikube ip

Send `POST` request to `http://<minikube-ip>/student-data-form/` to submit a form
