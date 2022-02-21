#!/bin/bash
# $1 - Name of file containing list of domain extensions. Do not include path. Should be under "DomainExtensions" Directory.
# $2 - Name of file containing list of domain names. Do not include path. Should be user "DomainNames" Directory.
# Example "./parse COM ALPHA1"

domainextensionsfilename=$1
domainnamefilename=$2

counter=0
TIME="$(date +%Y_%m_%d_%H_%M_%S)"
while read extension
do
    while read domain
    do
        counter=$((counter+1))
        whois $domain.$extension > tempfile
        DATA=$(cat tempfile | ../Results/$extension/Scripts/free_taken_script)
        echo $counter: $domain.$extension
        if [ "$DATA" == "free" ]
        then
            echo $domain >> ../Results/$extension/DomainFree/$domainnamefilename/free$TIME
        elif [ "$DATA" == "taken" ]
        then
            DATE=$(cat tempfile | ../Results/$extension/Scripts/get_date_script)
            echo $domain $DATE >> ../Results/$extension/DomainTaken/$domainnamefilename/taken$TIME
        else
            echo $domain >> ../Results/$extension/DomainError/$domainnamefilename/error$TIME
        fi
    done < ../DomainNames/$domainnamefilename
done < ../DomainExtensions/$domainextensionsfilename

#TODO
# Paralellizing
# clean results
# website
# focus on com, net, org, us first
