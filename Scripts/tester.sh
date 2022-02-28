#!/bin/bash
# $1 - Name of file containing wordlist of domain names. Do not include path. Should be under "DomainNames" Directory.
# $2 - Name of file containing wordlist of domain extensions. Do not include path. Should be under "DomainExtensions" Directory.
# Example "./tester.sh SAMPLENAMES.txt SAMPLEEXTENSIONS.txt"

# Setting variables
domainnamefilename=$1
domainextensionsfilename=$2
domainnamefilenamenoextension=${domainnamefilename::-4}

# Checking if Result directory is setup
if [ ! -d "../Results" ] 
then
    mkdir "../Results"
fi

# Checking if extension directories are setup
while read extension
do
    if [ ! -d "../Results/$extension" ] 
    then
        mkdir "../Results/$extension"
    fi

    if [ ! -d "../Results/$extension/$domainnamefilenamenoextension" ] 
    then
        mkdir "../Results/$extension/$domainnamefilenamenoextension"
        mkdir "../Results/$extension/$domainnamefilenamenoextension/DomainError"
        mkdir "../Results/$extension/$domainnamefilenamenoextension/DomainFree"
        mkdir "../Results/$extension/$domainnamefilenamenoextension/DomainTaken"
    fi

    if [ ! -d "./FreeTakenGetDate/$extension" ] 
    then
        mkdir "./FreeTakenGetDate/$extension"
        cp "./FreeTakenGetDate/free_taken.sh" "./FreeTakenGetDate/$extension/free_taken.sh"
        cp "./FreeTakenGetDate/get_date.sh" "./FreeTakenGetDate/$extension/get_date.sh"
        # These are used as a reference to adapt the free_taken.sh and get_date.sh scripts. 
        whois A.$extension > "./FreeTakenGetDate/$extension/whois_taken.txt"
        whois ASDFKASDKFAKJSLDFKASDJFAKSLDJFKNENSDFASDFASD.$extension > "./FreeTakenGetDate/$extension/whois_free.txt"
    fi
done < ../DomainExtensions/$domainextensionsfilename




# Main loop running whois command
whoiscounter=0
TIME="$(date +%Y_%m_%d_%H_%M_%S)"
truncate -s 0 full_list_temp.txt

while read extension || [ -n "$extension" ]
do
    while read domain || [ -n "$domain" ]
    do
        whoiscounter=$((whoiscounter+1))
        echo $whoiscounter $domain.$extension >> full_list_temp.txt
    done < ../DomainNames/$domainnamefilename
done < ../DomainExtensions/$domainextensionsfilename

cat full_list_temp.txt | parallel ./Helper/whois_parallel.sh {} $domainnamefilenamenoextension $TIME
