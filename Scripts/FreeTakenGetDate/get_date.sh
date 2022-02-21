#!/bin/bash
# DIFFERENT

STR=`cat $1 | awk 'NR==6' | grep -oP '(?<=: ).*?(?=T)'`
echo $STR
