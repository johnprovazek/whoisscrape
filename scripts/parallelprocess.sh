#!/bin/bash
# Helper script.
# This is meant to be run in parallel from whoisscrape.sh script.
# $1 : Formatted Domain. example: "cooldomainname.com"
# $2 : Name of domainname wordlist. example: "samplenames"
# $3 : Time. example: "2022_02_27_20_56_40"
# Example run: "./parallelprocess.sh cooldomainname.com samplenames 2022_02_27_20_56_40"

# Parsing the script input.
fulldomain=$1
extension=$(cut -d "." -f2- <<< $fulldomain)
domainwordlistname=$2
time=$3

# Running the whois command.
data=$(./parseoutput.sh <(whois $fulldomain) $extension)
echo $fulldomain: $data
if [ "$data" == "free" ]
then
    echo $fulldomain >> ../results/$extension/$domainwordlistname/domainfree/free$time.txt
elif [ "$data" == "taken" ]
then
    echo $fulldomain >> ../results/$extension/$domainwordlistname/domaintaken/taken$time.txt
else
    echo $fulldomain >> ../results/$extension/$domainwordlistname/domainerror/error$time.txt
fi