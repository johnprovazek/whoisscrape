#!/bin/bash
STR=`cat $1 | sed -n '2p' | cut -c 5-15`
if [ "$STR" == "Domain name" ]
then
    echo "taken"
elif [ "$STR" == "No match fo" ]
then
    echo "free"
else
    echo "error"
fi
