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

