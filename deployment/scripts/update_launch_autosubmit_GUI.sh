cd autosubmitreact/
echo "deleting old build folder"
rm -rf build
npm run build
echo "stopping Apache"
systemctl stop httpd
echo "updating sources"
rm -rf /var/www/html/autosubmitapp/*
cp -rf build/* /var/www/html/autosubmitapp/
echo "starting Apache"
systemctl start httpd
echo "GUI update completed"
