#!/bin/bash
# $1 - Name of file containing list of domain extensions. Do not include path. Should be under "DomainExtensions" Directory.
# $2 - Name of file containing list of domain names. Do not include path. Should be user "DomainNames" Directory.
# Example "./parse.sh COM.txt ALPHA1.txt"

domainextensionsfilename=$1
domainnamefilename=$2
DNFN_NoExtension=${domainnamefilename::-4}

counter=0
TIME="$(date +%Y_%m_%d_%H_%M_%S)"
while read extension
do
    while read domain
    do
        counter=$((counter+1))
        whois $domain.$extension > tempfile.txt
        DATA=$(cat tempfile.txt | ../Results/$extension/Scripts/free_taken_script.sh)
        echo $counter: $domain.$extension
        if [ "$DATA" == "free" ]
        then
            echo $domain >> ../Results/$extension/DomainFree/$DNFN_NoExtension/free$TIME.txt
        elif [ "$DATA" == "taken" ]
        then
            DATE=$(cat tempfile.txt | ../Results/$extension/Scripts/get_date_script.sh)
            echo $domain $DATE >> ../Results/$extension/DomainTaken/$DNFN_NoExtension/taken$TIME.txt
        else
            echo $domain >> ../Results/$extension/DomainError/$DNFN_NoExtension/error$TIME.txt
        fi
    done < ../DomainNames/$domainnamefilename
done < ../DomainExtensions/$domainextensionsfilename
