######################################################################################################
# This script will insert an experiment into `ecearth.db/experiment` and `as_times.db/experiment` tables so that they can be visualized in the GUI.
# To set the experiment as active it will insert it into `as_times.db/experiment_times` as well as `as_times.db/experiment_status`!
# It is intended to be used in an environment with Autosubmit data.
# 
# Usage Example:
# [rocky@vm ~]$ bash insertNewExperiment <expid> <as_version> <desc> <total_jobs> <completed_jobs>
# [rocky@vm ~]$ bash insertNewExperiment a49s 3.14.0 "Hello World" 10 2
# 
# Author: Cristian Gutiérrez, BSC
######################################################################################################

#!/bin/sh

exp_id=$1
vers=$2
desc=$3
total_jobs=$4
jobs=$5

if [[ -n "$exp_id" && -n "$vers" && -n "$desc" && -n "$total_jobs" && -n "$jobs" ]]; then
    echo ""
else
    echo "ERROR: Use it as follows... insertNewExperiment.sh <expid> <as_version> <description> <total_jobs> <jobs>"
    exit 1
fi

# we delete possible other records of the experiment to avoid duplicated entries
sqlite3 ecearth.db "DELETE FROM experiment WHERE name='${exp_id}';";

# ecearth.db
echo "ecearth.db"
last_id_ecearth=$(($(sqlite3 ecearth.db "SELECT id FROM experiment ORDER BY id DESC LIMIT 1;";)+1))
echo "Adding ${exp_id} as a new experiment with id: ${last_id_ecearth} into ecearth.db..."
sqlite3 ecearth.db "INSERT INTO experiment(id,name,autosubmit_version,description) VALUES(${last_id_ecearth}, '${exp_id}','${as_vers}','${desc}');";
echo ""

# as_times.db
echo "as_times.db"
last_id_as_times=$(($(sqlite3 as_times.db "SELECT id FROM experiment ORDER BY id DESC LIMIT 1;";)+1))
echo "Adding ${exp_id} as a new experiment with id: ${last_id_as_times} into as_times.db..."
sqlite3 as_times.db "INSERT INTO experiment(id, name,autosubmit_version,description) VALUES(${last_id_as_times}, '${exp_id}','${as_vers}','${desc}');";
echo ""
echo "Setting the experiment as active..."

sqlite3 as_times.db "INSERT INTO experiment_status(exp_id, name, status,seconds_diff,modified) VALUES(${last_id_as_times}, '${exp_id}', 'RUNNING','','2022-04-11-15:55:06');";
sqlite3 as_times.db "INSERT INTO experiment_times(exp_id, name,created,modified,total_jobs,completed_jobs) VALUES(${last_id_as_times}, '${exp_id}','1649682868','1649685493',${total_jobs},${jobs});";

echo ""
echo "DONE"
