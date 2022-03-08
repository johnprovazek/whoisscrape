#!/bin/bash
# This is meant to run in parallel from parse.sh script
# $1 - Line Number of domain followed by Formatted Domain eg: "1 cooldomainname.com"
# $2 - Name of DomainName wordlist eg: "SAMPLENAMES"
# $3 - Time variable. eg: "2022_02_27_20_56_40"

# Parsing the script input
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

# Running the whois command
DATA=$(whois $DOMAINNAME | ./responseparsescripts/$EXTENSION/freetaken.sh)
echo $LINENUMBER: $DOMAIN.$EXTENSION - $DATA
if [ "$DATA" == "free" ]
then
    echo $DOMAIN >> ../results/$EXTENSION/$DOMAINLISTNAME/domainfree/free$TIME.txt
elif [ "$DATA" == "taken" ]
then
    # DATE=$(cat tempfile.txt | ./responseparsescripts/$EXTENSION/getdate.sh)
    # echo $DOMAIN $DATE >> ../results/$EXTENSION/$DOMAINLISTNAME/DomainTaken/taken$TIME.txt
    echo $DOMAIN >> ../results/$EXTENSION/$DOMAINLISTNAME/domaintaken/taken$TIME.txt
else
    echo $DOMAIN >> ../results/$EXTENSION/$DOMAINLISTNAME/domainerror/error$TIME.txt
fi