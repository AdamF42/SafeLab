#/bin/bash

function cerror {
    echo "${RED}${UNDERLINE}[ERROR] ${RESET}$1"
}

function trap_handler() {
        MYSELF="$0"
        LASTLINE="$1"
        LASTERR="$2"
        cerror "${MYSELF}: line ${LASTLINE}: exit status of last command: ${LASTERR}"
}

function command_exists() {
    # check if command exists and fail otherwise
    command -v "$1" >/dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        cerror "$1 is required but it's not installed. Abort."
        exit 1
    fi
}

function wait-for-url() {
    echo "Testing $1"
    timeout -s TERM 45 bash -c \
    'while [[ "$(curl -s -o /dev/null -L -w ''%{http_code}'' ${0})" != "200" ]];\
    do echo "Waiting for ${0}" && sleep 2;\
    done' ${1}
    echo "OK!"
    curl -I $1
}

set -e

trap 'trap_handler ${LINENO} $?' ERR

######## COLORS ########
BLUE=`tput setaf 4`
RED=`tput setaf 1`
UNDERLINE=`tput smul`
RESET=`tput sgr0`
######## END COLORS ########

# check arguments
if [[ $# -ne 4 ]]
  then
    echo "Missing params. Usage: start.sh pata/to/data/folder influx_release  bot_token chat_id"
    exit 1
fi

DATA_DIR=$1
INFLUX_RELEASE=$2
INFLUX_DIR="./Influx"
TOKEN=$3
CHAT_ID=$4
GRAFANA_USER_ID=$(id -u)

INFLUX_VOLUME="${DATA_DIR}/influx"
GRAFANA_VOLUME="${DATA_DIR}/grafana"
MOZILLA_IOT_VOLUME="${DATA_DIR}/mozilla-iot"


# check docker installation
for COMMAND in "docker" "docker-compose"; do
    command_exists "${COMMAND}"
done

# create a lib folder for InfluxDB and Docker
sudo mkdir -p $INFLUX_VOLUME && sudo chown -R $USER:$USER $INFLUX_VOLUME
sudo mkdir -p $GRAFANA_VOLUME && sudo chown -R $USER:$USER $GRAFANA_VOLUME 
sudo mkdir -p $MOZILLA_IOT_VOLUME && sudo chown -R $USER:$USER $MOZILLA_IOT_VOLUME


############################# INFLUX #############################
# chek if influxdb folder is empty
[[ "$(ls -A $INFLUX_VOLUME)" ]] && { cerror "$INFLUX_VOLUME should be empty. Exiting"; exit 1 ; } 
cp $INFLUX_DIR/influx_setup $INFLUX_VOLUME/influx_setup
cp $INFLUX_DIR/install.sh $INFLUX_VOLUME/install.sh

docker build  --build-arg RELEASE=$INFLUX_RELEASE --tag=influx $INFLUX_DIR

# create/update the InfluxDB meta database
docker container run  -d --name influxdb \
    -v $INFLUX_VOLUME:/root/.influxdbv2 \
    -p 9999:9999 influx > /dev/null

wait-for-url http://localhost:9999

docker exec -it \
        influxdb \
        bash -c "cd /root/.influxdbv2/ && ./install.sh; exit"

docker stop influxdb && docker rm influxdb

sudo rm $INFLUX_VOLUME/influx_setup $INFLUX_VOLUME/install.sh

############################# GRAFANA #############################

docker container run -d --name grafana \
    -v=$GRAFANA_VOLUME:/var/lib/grafana \
    -p 3000:3000 \
    grafana/grafana:7.1.0 \

wait-for-url http://localhost:3000

docker exec -it \
        grafana \
        bash -c "grafana-cli plugins install grafana-influxdb-flux-datasource"

docker stop grafana && docker rm grafana


############################# MOZILLA IOT #############################

cd InfluxBridge && ./package.sh
cd ../
cp -r InfluxBridge/ $MOZILLA_IOT_VOLUME/addons/InfluxBridge

# create environment file for docker-compose
sudo tee .env << END
INFLUX_VOLUME=$INFLUX_VOLUME
GRAFANA_VOLUME=$GRAFANA_VOLUME
MOZILLA_IOT_VOLUME=$MOZILLA_IOT_VOLUME
TELEGRAM_TOKEN=$TELEGRAM_TOKEN
CHAT_ID=$CHAT_ID
GRAFANA_USER_ID=$GRAFANA_USER_ID
END

docker-compose up -d --build