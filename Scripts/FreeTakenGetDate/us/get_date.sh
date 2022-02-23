#!/bin/bash

STR=`cat $1 | awk 'NR==6' | grep -oP '(?<=: ).*?(?=T)'`
echo $STR
