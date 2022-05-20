#!/bin/bash
echo "Launching autosubmit_api and restarting gunicorn"
source /srv/www/htdocs/AutosubmitAPI/venv27/bin/activate
ps aux | grep gunicorn | awk '{print $2}' | xargs -r kill
ps aux | grep gunicorn
echo "Set SECRET KEY"
export SECRET_KEY='c&X=<dFoz^ym}_^{jvma'
echo "Set CAS LOGIN URL"
export CAS_LOGIN_URL='https://cas.bsc.es/cas/login'
echo "Set CAS VERIFY URL"
export CAS_VERIFY_URL='https://cas.bsc.es/cas/serviceValidate'
echo "Gunicorn starting in 3 seconds..."
sleep 3
LOG_NAME="$(date '+%Y%m%d%H%M')logunicorn.txt"
echo "${LOG_NAME}"
gunicorn --error-logfile ~/${LOG_NAME} --timeout 600 -b 0.0.0.0:8081 -w 6 autosubmit_api.app:app --daemon
