#####################################################################################################
# This script is for grabbing real experiments from /esarchive/ and deploy them into Autosubmit's developer environment.
# It MUST be executed locally from your machine and it will create a subdirectory in the /tmp/ partition.
# Check out the Autosubmit Developers Guide under the section `Deploy Real Experiments to the Dev Machine`.
# The Host address `rocky@bscesautosubmitdev01.bsc.es` should be configured as SSH passwordless. Check out the Autosubmit Developers Guide under the Introduction section for more.
#
# Usage Example:
# (before this command we should execute `createDir.sh a49k` at the dev env.
# cgutierr@bsces108127:~$ bash copy_send.sh a49k
#
# Author: Cristian Gutiérrez, BSC
######################################################################################################


#!/bin/sh

exp_id=$1

rm -rf /tmp/TO_SEND/*
mkdir -p /tmp/TO_SEND

scp -r \
    bscesautosubmit01:/esarchive/autosubmit/as_metadata/data/job_data_${exp_id}.db \
    bscesautosubmit01:/esarchive/autosubmit/as_metadata/graph/graph_data_${exp_id}.db \
    bscesautosubmit01:/esarchive/autosubmit/as_metadata/structures/structure_${exp_id}.db \
    bscesautosubmit01:/esarchive/autosubmit/${exp_id}/conf \
    bscesautosubmit01:/esarchive/autosubmit/${exp_id}/pkl \
    bscesautosubmit01:/esarchive/autosubmit/${exp_id}/plot \
    bscesautosubmit01:/esarchive/autosubmit/${exp_id}/status \
    bscesautosubmit01:/esarchive/autosubmit/${exp_id}/tmp\
    /tmp/TO_SEND/

path="/tmp/TO_SEND/."

scp -r ${path}conf ${path}pkl ${path}plot ${path}status ${path}tmp rocky@bscesautosubmitdev01.bsc.es:/home/rocky/development/autosubmit/${exp_id}/
scp -r ${path}job_data_${exp_id}.db rocky@bscesautosubmitdev01.bsc.es:/home/rocky/development/autosubmit/as_metadata/data/
scp -r ${path}graph_data_${exp_id}.db rocky@bscesautosubmitdev01.bsc.es:/home/rocky/development/autosubmit/as_metadata/graph/
scp -r ${path}${exp_id}_log.txt rocky@bscesautosubmitdev01.bsc.es:/home/rocky/development/autosubmit/as_metadata/logs/
scp -r ${path}structure_${exp_id}.db rocky@bscesautosubmitdev01.bsc.es:/home/rocky/development/autosubmit/as_metadata/structures/
