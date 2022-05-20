source /srv/www/htdocs/AutosubmitAPI/venv27/bin/activate
cd ~
gunicorn --error-logfile ~/rebootGunicorn.txt --timeout 600 -b 0.0.0.0:8081 -w 4 autosubmitAPIwu.testAPI:app --daemon
