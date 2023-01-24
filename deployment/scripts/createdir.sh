#####################################################################################################
# This script is intended to be used in /autosubmit/ path where the experiments are stored.
# It will create a new experiment folder with the default set of folders needed for Autosubmit 3.14.0 experiments.
# Doesn't supports Autosubmit 4 custom extensions.
#
# Usage Example:
# [rocky@vm ~]$ bash createdir.sh <expid>
#
# Author: Cristian Gutiérrez, BSC
######################################################################################################

#!/bin/sh

dir=$1
mkdir /home/rocky/development/autosubmit/${dir}
mkdir /home/rocky/development/autosubmit/${dir}/conf
mkdir /home/rocky/development/autosubmit/${dir}/plot
mkdir /home/rocky/development/autosubmit/${dir}/pkl
mkdir /home/rocky/development/autosubmit/${dir}/tmp
mkdir /home/rocky/development/autosubmit/${dir}/status
mkdir /home/rocky/development/autosubmit/${dir}/proj
chmod -R 777 /home/rocky/development/autosubmit/${dir}

