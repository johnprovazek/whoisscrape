#!/bin/bash

STR=`cat $1 | head -n 1 | cut -c 1-9`
if [ "$STR" == "Domain Na" ]
then
    echo "taken"
elif [[ "$STR" == "Domain no" || "$STR" == "This prem" || "$STR" == "This plat" ]];
then
    echo "free"
else
    echo "error"
fi
