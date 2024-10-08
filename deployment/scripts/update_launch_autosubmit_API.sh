#####################################################################################################
# This script will kill the current running instance of Autosubmit API (Python 2) and run it again.
# Note the importante of the variables imported from the .bashrc file.
# It is recommended to be ran with the root user to be able to kill processes.
#
# Usage Example:
# [rocky@vm ~]$ bash update_launch_autosubmit_API.sh
#
# Author: Autosubmit Team, BSC
######################################################################################################

#!/bin/bash
. ~/.bashrc

# PVE_PATH is an env var defined in the .bashrc for the virtual environment to be loaded for the API
# VM environment /var/www/html/autosubmitapi/venv27/bin/activate
PVE=${PVE_PATH}
LOG_PATH=${PLOG}
UPDATE=false

while getopts ":e:u" opt; do
  case "$opt" in
    e)  PVE=$OPTARG;
      ;;
    u)  UPDATE=true;
      ;;
   esac
done

source ${PVE}

# Stop current instance of unicorn
pstree -ap | grep gunicorn | awk -F',' '{print $2}' | head -n -1 | xargs -r kill
# ps aux | grep gunicorn | awk '{print $2}' | xargs -r kill
ps aux | grep gunicorn 

# if update to a new version we install it from pip
if [ "${UPDATE}" = true ]; then
   pip install autosubmit_api --upgrade
fi

# prepare to launch
echo "Set SECRET KEY"
export SECRET_KEY='c&X=<dFoz^ym}_^{jvma'
echo "Set CAS LOGIN URL"
export CAS_LOGIN_URL='https://cas.bsc.es/cas/login'
echo "Set CAS VERIFY URL"
export CAS_VERIFY_URL='https://cas.bsc.es/cas/serviceValidate'
echo "Gunicorn starting in 3 seconds..."
sleep 3
LOG_NAME="$(date '+%Y%m%d%H%M')logunicorn.txt"
echo "${LOG_PATH}/${LOG_NAME}"
gunicorn --error-logfile ${LOG_PATH}/${LOG_NAME} --timeout 600 -b 0.0.0.0:8081 -w 6 autosubmit_api.app:app --preload --daemon
