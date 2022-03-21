#!/bin/bash
# Helper script.
# This script processes the whois output to determine if domain is free, taken, or the whois quota has been reached
# $1 : Whois output. This is the results from a whois query.
# $2 : Domain Extension. example: "com"
# Return: taken, free, error
# Example run: "./parseoutput.sh *whoisoutput* com"

# Parsing the script input.
whoisoutput=$1
extension=$2

# Parsing the whois output
if [ $extension == "com" ]
then
    str=`cat $whoisoutput | head -n 1 | cut -c 1-9`
    if [ "$str" == "   Domain" ]
    then
        echo "taken"
    elif [ "$str" == "No match " ]
    then
        echo "free"
    else
        echo "error"
    fi
elif [ $extension == "info" ]
then
    str=`cat $whoisoutput | head -n 1 | cut -c 1-9`
    if [ "$str" == "Domain Na" ] || [ "$str" == "This name" ]
    then
        echo "taken"
    elif [ "$str" == "No match " ] || [ "$str" == "Domain no" ] 
    then
        echo "free"
    else
        echo "error"
    fi
elif [ $extension == "io" ]
then
    str=`cat $whoisoutput | head -n 1 | cut -c 1-9`
    if [ "$str" == "Domain Na" ]
    then
        echo "taken"
    elif [ "$str" == "NOT FOUND" ] || [ "$str" == "Domain no" ]
    then
        echo "free"
    else
        echo "error"
    fi
elif [ $extension == "mx" ]
then
    str=`cat $whoisoutput | sed -n 2p | cut -c 1-9`
    echo $str
    if [ "$str" == "Domain Na" ]
    then
        echo "taken"
    elif [ "$str" == "No_Se_Enc" ]
    then
        echo "free"
    else
        echo "error"
    fi
elif [ $extension == "net" ]
then
    str=`cat $whoisoutput | head -n 1 | cut -c 1-9`
    if [ "$str" == "   Domain" ]
    then
        echo "taken"
    elif [ "$str" == "No match " ]
    then
        echo "free"
    else
        echo "error"
    fi
elif [ $extension == "tv" ]
then
    str=`cat $whoisoutput | head -n 1 | cut -c 1-9`
    if [ "$str" == "   Domain" ]
    then
        echo "taken"
    elif [ "$str" == "No match " ]
    then
        echo "free"
    else
        echo "error"
    fi
elif [ $extension == "uk" ]
then
    str=`cat $whoisoutput | sed -n '2p' | cut -c 5-14`
    str2=`cat $whoisoutput | cut -c 1-9`
    if [ "$str" ==   "Domain nam" ]
    then
        echo "taken"
    elif [ "$str" == "No match f" ]
    then
        echo "free"
    elif [ "$str2" == "Error for" ]
    then
        echo "quota"
    else
        echo "error"
    fi
elif [ $extension == "us" ]
then
    str=`cat $whoisoutput | head -n 1 | cut -c 1-9`
    if [ "$str" == "Domain Na" ]
    then
        echo "taken"
    elif [ "$str" == "No Data F" ]
    then
        echo "free"
    else
        echo "error"
    fi
else
    str=`cat $whoisoutput | head -n 1 | cut -c 1-9`
    if [ "$str" == "   Domain" ]
    then
        echo "taken"
    elif [ "$str" == "No match " ]
    then
        echo "free"
    else
        echo "error"
    fi
fi

