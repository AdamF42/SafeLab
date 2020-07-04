./compile.sh

TOKEN="SgkJrJmf3mznDnNOJDdpaeNL0btrXqhm6eOCH_dA3sdBI1uQqgUKmTSBxxdZjv5puBYDz1PB7CuFQGmtoxFsbA=="
ADDRESS="http://localhost:9999/api/v2"
ORGNAME="SuperCicci"
USERNAME="Ciccione"
BUCKETNAME="BucketCicci"
EXPIRETIME="55032940"
AUTHNAME="Auth4Cicci"

ORGID="05f15a1de9a89000"
USERID="05f15a1df4a89000"
TASKNAME="TaskForCiccio"
TASKDESC="Monitoring_temperature"
TIMEINTERVAL="30s"
START="2h"
VALUE="temp"
TIMEAGGREGATE="15s"
CRITICVAL="30"
TYPETHRESHOLD="greater"

node testExistence.js ${TOKEN} ${ADDRESS} ${ORGNAME} ${USERNAME} ${BUCKETNAME} ${TASKNAME}
ID=$(node createEnv.js ${TOKEN} ${ADDRESS} ${ORGNAME} ${USERNAME} ${BUCKETNAME} ${EXPIRETIME} ${AUTHNAME})
IDLIST=$(echo $ID)
IFS=' ' # space is set as delimiter
read -ra ADDR <<< "$IDLIST" # str is read into an array as tokens separated by IFS
ORGID=${ADDR[2]}
USERID=${ADDR[5]}
BUCKETID=${ADDR[8]}
AUTHID=${ADDR[11]}
echo "VARS"
echo ${ORGID}
echo ${USERID}
echo ${BUCKETID}
echo ${AUTHID}

node createAlert.js ${TOKEN} ${ADDRESS} ${ORGID} ${USERID} ${BUCKETNAME} ${TASKNAME} ${TASKDESC} ${TIMEINTERVAL} ${START} ${VALUE} ${TIMEAGGREGATE} ${CRITICVAL} ${TYPETHRESHOLD}