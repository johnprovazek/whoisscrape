#!/bin/bash
# This is meant to run in parallel from parse.sh script
# $1 - Line Number of domain followed by Formatted Domain eg: "1 cooldomainname.com"
# $2 - Name of DomainName wordlist eg: "SAMPLENAMES"
# $3 - Time variable. eg: "2022_02_27_20_56_40"

IFS=' '
read -a strarr <<< $1
LINENUMBER=${strarr[0]}
DOMAINNAME=${strarr[1]}
IFS='.'
read -a strarr_other <<< $DOMAINNAME
DOMAIN=${strarr_other[0]}
EXTENSION=${strarr_other[1]}
IFS=' '
DOMAINNAME=$DOMAIN.$EXTENSION
DOMAINLISTNAME=$2
TIME=$3

# echo $LINENUMBER
# echo $DOMAIN
# echo $EXTENSION
# echo $DOMAINNAME
# echo $DOMAINLISTNAME
# echo $TIME

# WHOISRESPONSE=$(whois "${DOMAINNAME}")
# DATA=$(echo $DOMAINNAME | ./FreeTakenGetDate/$EXTENSION/free_taken.sh)

DATA=$(whois $DOMAINNAME | ./FreeTakenGetDate/$EXTENSION/free_taken.sh)
echo $LINENUMBER: $DOMAIN.$EXTENSION - $DATA
if [ "$DATA" == "free" ]
then
    echo $DOMAIN >> ../Results/$EXTENSION/$DOMAINLISTNAME/DomainFree/free_$TIME.txt
elif [ "$DATA" == "taken" ]
then
    # DATE=$(cat tempfile.txt | ./FreeTakenGetDate/$EXTENSION/get_date.sh)
    # echo $DOMAIN $DATE >> ../Results/$EXTENSION/$DOMAINLISTNAME/DomainTaken/taken_$TIME.txt
    echo $DOMAIN >> ../Results/$EXTENSION/$DOMAINLISTNAME/DomainTaken/taken_$TIME.txt
else
    echo $DOMAIN >> ../Results/$EXTENSION/$DOMAINLISTNAME/DomainError/error_$TIME.txt
fi