# Kubernetes Setup

Link to Kubernetes Installation and Demo - [youtube video](https://youtu.be/UOz46btrXO0)

Install [minikube](https://v1-18.docs.kubernetes.io/docs/tasks/tools/install-minikube/) on local environment of setup a kubernetes cluster on a cloud platform

Start minikube with the following command

    minikube start --vm=true --driver=hyperkit

Install [Helm](https://helm.sh/docs/intro/install/)

This project uses the [strimzi](https://strimzi.io/) operator to manage the kafka cluster, install it using the commands below

    helm repo add strimzi https://strimzi.io/charts/
    helm install my-release strimzi/strimzi-kafka-operator

Deploy the kafka cluster and zookeeper with the following command

    kubectl apply -f kubernetes/kafka/kafka-persistent-single.yaml

For production, use the `kafka-persistent-multiple.yaml` file, it deploys a multi broker kafka cluster.

Create Kafka topic using the command

    kubectl apply -f kubernetes/kafka/student-data-form-kafka-topic.yaml
    kubectl apply -f kubernetes/kafka/demo-form-kafka-topic.yaml

On minikube, enable ingress

    minikube addons enable ingress

Deploy all other kubernetes objects like, deployments for different microservices, cluster IP services, ingress using the command

    kubectl apply -f kubernetes

get the ip address of minikube using

    minikube ip

Send `POST` request to `http://<minikube-ip>/student-data-form/` to submit a form

    {
        "name": "Saurabh raj",
        "roll": "99999",
        "university": "BCE",
        "cgpa": "8.04",
        "gender": "F",
        "age": "10.11",
        "email": "kumarsaurabhraj.sr@gmail.com",
        "mobile": "7004465984"
    }