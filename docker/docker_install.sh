#!/usr/bin/env bash

set -eo pipefail

#
# Как установить и использовать Docker в Ubuntu 18.04
# https://www.digitalocean.com/community/tutorials/docker-ubuntu-18-04-1-ru
#
# Введение
# Docker — это приложение, которое упрощает управление процессами приложения в контейнерах * *. Контейнеры позволяют запускать приложения в процессах с изолированием ресурсов. Они подобны виртуальным машинам, но являются при этом более портируемыми, менее требовательны к ресурсам, и больше зависят от операционной системы машины-хоста.
# Чтобы подробно ознакомиться с различными компонентами контейнеров Docker, рекомендуем прочитать статью Экосистема Docker: Введение в часто используемые компоненты.
#
# Данная инструкция описывает, как установить и использовать Docker Community Edition (CE) в Ubuntu 18.04. Вы научитесь устанавливать Docker, работать с контейнерами и образами и загружать образы в Docker-репозиторий.
#
# Необходимые условия
# Чтобы следовать приведенным инструкциям, вам потребуются:
# Один сервер Ubuntu 18.04, настроенный по руководству по настройке сервера Ubuntu 18.04 initial server setup guide, а также не-рутовый пользователь sudo и файрвол.
# Учетная запись на Docker Hub, если необходимо создавать собственные образы и отправлять их в Docker Hub, как показано в шагах 7 и 8.
#
# Шаг 1 — Установка Docker
# Дистрибутив Docker, доступный в официальном репозитории Ubuntu, не всегда является последней версией программы. Лучше установить последнюю версию Docker, загрузив ее из официального репозитория Docker. Для этого добавляем новый источник дистрибутива, вводим ключ GPG из репозитория Docker, чтобы убедиться, действительна ли загруженная версия, а затем устанавливаем дистрибутив.
#
# Сначала обновляем существующий перечень пакетов:
sudo apt-get update
# Затем устанавливаем необходимые пакеты, которые позволяют apt использовать пакеты по HTTPS:
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
# Затем добавляем в свою систему ключ GPG официального репозитория Docker:
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
# Добавляем репозиторий Docker в список источников пакетов APT:
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
# Затем обновим базу данных пакетов информацией о пакетах Docker из вновь добавленного репозитория:
sudo apt-get update
#
# Следует убедиться, что мы устанавливаем Docker из репозитория Docker, а не из репозитория по умолчанию Ubuntu:
#apt-cache policy docker-ce
# Вывод получится приблизительно следующий. Номер версии Docker может быть иным:
# Output of apt-cache policy docker-ce
#docker-ce:
#  Installed: (none)
#  Candidate: 18.03.1~ce~3-0~ubuntu
#  Version table:
#     18.03.1~ce~3-0~ubuntu 500
#        500 https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
# Обратите внимание, что docker-ce не устанавливается, но для установки будет использован репозиторий Docker для Ubuntu 18.04 (bionic).
#
# Далее устанавливаем Docker:
sudo apt-get install -y docker-ce
#
# Install Compose on Linux systems
# On Linux, you can download the Docker Compose binary from the Compose repository release page on GitHub. Follow the instructions from the link, which involve running the curl command in your terminal to download the binaries. These step-by-step instructions are also included below.
# For alpine, the following dependency packages are needed: py-pip, python-dev, libffi-dev, openssl-dev, gcc, libc-dev, and make.
# Run this command to download the current stable release of Docker Compose:
sudo curl -L https://github.com/docker/compose/releases/download/1.26.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
# To install a different version of Compose, substitute 1.24.1 with the version of Compose you want to use.
# If you have problems installing with curl, see Alternative Install Options tab above.
# Apply executable permissions to the binary:
sudo chmod +x /usr/local/bin/docker-compose
#
# Теперь Docker установлен, демон запущен, и процесс будет запускаться при загрузке системы.  Убедимся, что процесс запущен:
#sudo systemctl status docker
# Вывод должен быть похож на представленный ниже, сервис должен быть запущен и активен:
#Output
#● docker.service - Docker Application Container Engine
#   Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
#   Active: active (running) since Thu 2018-07-05 15:08:39 UTC; 2min 55s ago
#     Docs: https://docs.docker.com
# Main PID: 10096 (dockerd)
#    Tasks: 16
#   CGroup: /system.slice/docker.service
#           ├─10096 /usr/bin/dockerd -H fd://
#           └─10113 docker-containerd --config /var/run/docker/containerd/containerd.toml
# При установке Docker мы получаем не только сервис (демон) Docker, но и утилиту командной строки docker или клиент Docker. Использование утилиты командной строки docker рассмотрено ниже.
#
# Шаг 2 — Использование команды Docker без sudo (опционально)
# По умолчанию, запуск команды docker требует привилегий пользователя root или пользователя группы docker, которая автоматически создается при установке Docker. При попытке запуска команды docker пользователем без привилегий sudo или пользователем, не входящим в группу docker, выводные данные будут выглядеть следующим образом:
#Output
#docker: Cannot connect to the Docker daemon. Is the docker daemon running on this host?.
#See 'docker run --help'.
#
# Чтобы не вводить sudo каждый раз при запуске команды docker, добавьте имя своего пользователя в группу docker:
sudo usermod -aG docker ${USER}
# Для применения этих изменений в составе группы необходимо разлогиниться и снова залогиниться на сервере или задать следующую команду:
#su - ${USER}
# Для продолжения работы необходимо ввести пароль пользователя.
# Убедиться, что пользователь добавлен в группу docker можно следующим образом:S
#id -nG
#Output
#sammy sudo docker
# Если вы хотите добавить произвольного пользователя в группу docker, можно указать конкретное имя пользователя:
#sudo usermod -aG docker username
# Далее в этой статье предполагается, что вы используете команду docker как пользователь, находящийся в группе docker. Если вы не хотите добавлять своего пользователя в группу docker, в начало команд необходимо добавлять sudo.
#
# Теперь рассмотрим команду docker.
#
# ...
#
# Список всех контейнеров
#docker ps -a
# Принудительно удалить все контейнеры
#docker rm -f $(docker ps -a)
# Список всех Docker-образов
#docker images -a
# Принудительно удалить все Docker-образы:
#docker rmi -f $(docker images -a)
#
sudo shutdown -r now
