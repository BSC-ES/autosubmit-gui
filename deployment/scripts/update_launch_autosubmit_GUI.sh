#####################################################################################################
# This script will remove the currrent npm build of the and generate a new one.
#
# Usage Example:
# [root@vm ~]$ bash update_launch_autosubmit_GUI.sh
#
# Author: Autosubmit Team, BSC
######################################################################################################

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
