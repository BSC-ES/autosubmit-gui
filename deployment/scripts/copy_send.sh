#!/bin/sh

exp_id=$1

rm -rf /tmp/TO_SEND/*

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

path="/tmp/TO_SEND/"

scp -r ${path}conf ${path}pkl ${path}plot ${path}status ${path}tmp rocky@bscesautosubmitdev01.bsc.es:/home/rocky/development/autosubmit/${exp_id}/
scp -r ${path}job_data_${exp_id}.db rocky@bscesautosubmitdev01.bsc.es:/home/rocky/development/autosubmit/as_metadata/data/
scp -r ${path}graph_data_${exp_id}.db rocky@bscesautosubmitdev01.bsc.es:/home/rocky/development/autosubmit/as_metadata/graph/
scp -r ${path}${exp_id}_log.txt rocky@bscesautosubmitdev01.bsc.es:/home/rocky/development/autosubmit/as_metadata/logs/
scp -r ${path}structure_${exp_id}.db rocky@bscesautosubmitdev01.bsc.es:/home/rocky/development/autosubmit/as_metadata/structures/
