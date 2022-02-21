#!/bin/bash
# $1 - Name of file containing list of domain extensions. Do not include path. Should be under "DomainExtensions" Directory. Assuming ".txt" extension.
# $2 - Name of file containing list of domain names. Do not include path. Should be user "DomainNames" Directory. Assuming ".txt" extension.
# Example "./parse.sh COM.txt ALPHA1.txt"

# Setting function variables
domainextensionsfilename=$1
domainnamefilename=$2
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
        mkdir "../Results/$extension/DomainError"
        mkdir "../Results/$extension/DomainFree"
        mkdir "../Results/$extension/DomainTaken"
        mkdir "../Results/$extension/Scripts"
        if [ -d "./FreeTakenGetDate/$extension" ] 
        then
            cp "./FreeTakenGetDate/$extension/free_taken.sh" "../Results/$extension/Scripts/free_taken.sh"
            cp "./FreeTakenGetDate/$extension/get_date.sh" "../Results/$extension/Scripts/get_date.sh"
        else
            cp "./FreeTakenGetDate/free_taken.sh" "../Results/$extension/Scripts/free_taken.sh"
            cp "./FreeTakenGetDate/get_date.sh" "../Results/$extension/Scripts/get_date.sh"
        fi

        # These are used as a reference to adapt the free_taken.sh and get_date.sh scripts. 
        whois A.$extension > "../Results/$extension/whois_taken.txt"
        whois ASDFKASDKFAKJSLDFKASDJFAKSLDJFKNENSDFASDFASD.$extension > "../Results/$extension/whois_free.txt"

        #Setting up domain name directories
        mkdir "../Results/$extension/DomainError/$domainnamefilenamenoextension"
        mkdir "../Results/$extension/DomainFree/$domainnamefilenamenoextension"
        mkdir "../Results/$extension/DomainTaken/$domainnamefilenamenoextension"
    fi
done < ../DomainExtensions/$domainextensionsfilename



# Main loop running whois command
whoiscounter=0
TIME="$(date +%Y_%m_%d_%H_%M_%S)"

while read extension
do
    while read domain
    do
        whoiscounter=$((whoiscounter+1))
        whois $domain.$extension > tempfile.txt
        DATA=$(cat tempfile.txt | ../Results/$extension/Scripts/free_taken.sh)
        echo $whoiscounter: $domain.$extension
        if [ "$DATA" == "free" ]
        then
            echo $domain >> ../Results/$extension/DomainFree/$domainnamefilenamenoextension/free_$TIME.txt
        elif [ "$DATA" == "taken" ]
        then
            DATE=$(cat tempfile.txt | ../Results/$extension/Scripts/get_date.sh)
            echo $domain $DATE >> ../Results/$extension/DomainTaken/$domainnamefilenamenoextension/taken_$TIME.txt
        else
            echo $domain >> ../Results/$extension/DomainError/$domainnamefilenamenoextension/error_$TIME.txt
        fi
    done < ../DomainNames/$domainnamefilename
done < ../DomainExtensions/$domainextensionsfilename
