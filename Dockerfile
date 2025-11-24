FROM python:3.10.10-slim-bullseye

RUN apt update && apt install -y build-essential --no-install-recommends

RUN apt install -y git gnupg2 curl
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys  1646B01B86E50310 && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |  apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" |  tee /etc/apt/sources.list.d/yarn.list && apt update && apt  install yarn -y ca-certificates curl gnupg
RUN pip install --upgrade pip psycopg2-binary PyMySQL boto3  setuptools wheel  fastapi[all]==0.103.1 uvicorn==0.23.2
RUN mkdir -p /etc/apt/keyrings && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" |  tee /etc/apt/sources.list.d/nodesource.list && apt-get update && apt-get install nodejs -y

COPY . /mlflow

WORKDIR /mlflow/mlflow/server/js
RUN yarn install
RUN yarn build
WORKDIR  /mlflow
RUN pip install .[auth]
WORKDIR /
ENTRYPOINT ["mlflow", "server", "--host", "0.0.0.0"]
