#!/bin/bash
# $1 - Name of file containing wordlist of domain names. Do not include path. Should be under "domainnames" Directory.
# $2 - Name of file containing wordlist of domain extensions. Do not include path. Should be under "domainextensions" Directory.
# $3 - If the thrid argument is "parallel" the script will be run in parallel.
# Example "./parse.sh SAMPLENAMES.txt SAMPLEEXTENSIONS.txt parallel"

# Setting variables
domainnamefilename=$1
domainextensionsfilename=$2
domainnamefilenamenoextension=${domainnamefilename::-4}

# Checking if Result directory is setup
if [ ! -d "../results" ] 
then
    mkdir "../results"
fi

# Checking if extension directories are setup
while read extension || [ -n "$extension" ]
do
    if [ ! -d "../results/$extension" ] 
    then
        mkdir "../results/$extension"
    fi

    if [ ! -d "../results/$extension/$domainnamefilenamenoextension" ] 
    then
        
        mkdir "../results/$extension/$domainnamefilenamenoextension"
        mkdir "../results/$extension/$domainnamefilenamenoextension/domainerror"
        mkdir "../results/$extension/$domainnamefilenamenoextension/domainfree"
        mkdir "../results/$extension/$domainnamefilenamenoextension/domaintaken"
    fi

    if [ ! -d "./responseparse/$extension" ] 
    then
        mkdir "./responseparse/$extension"
        cp "./responseparse/freetaken.sh" "./responseparse/$extension/freetaken.sh"
        cp "./responseparse/getdate.sh" "./responseparse/$extension/getdate.sh"
        # These are used as a reference to adapt the freetaken.sh and getdate.sh scripts. 
        whois A.$extension > "./responseparse/$extension/whoistaken.txt"
        whois ASDFKASDKFAKJSLDFKASDJFAKSLDJFKNENSDFASDFASD.$extension > "./responseparse/$extension/whoisfree.txt"
    fi
done < ../DomainExtensions/$domainextensionsfilename




# Main loop running whois command
whoiscounter=0
TIME="$(date +%Y_%m_%d_%H_%M_%S)"
truncate -s 0 fulllisttemp.txt

while read extension || [ -n "$extension" ]
do
    while read domain || [ -n "$domain" ]
    do
        if [ "$3" == "parallel" ]
        then
            whoiscounter=$((whoiscounter+1))
            echo $whoiscounter $domain.$extension >> fulllisttemp.txt
        else
            whoiscounter=$((whoiscounter+1))
            whois $domain.$extension > whoistemp.txt
            DATA=$(cat whoistemp.txt | ./responseparse/$extension/freetaken.sh)
            echo $whoiscounter: $domain.$extension
            if [ "$DATA" == "free" ]
            then
                echo $domain >> ../results/$extension/$domainnamefilenamenoextension/domainfree/free$TIME.txt
            elif [ "$DATA" == "taken" ]
            then
                DATE=$(cat whoistemp.txt | ./responseparse/$extension/getdate.sh)
                echo $domain $DATE >> ../results/$extension/$domainnamefilenamenoextension/domaintaken/taken$TIME.txt
            else
                echo $domain >> ../results/$extension/$domainnamefilenamenoextension/domainerror/error$TIME.txt
            fi
        fi
    done < ../DomainNames/$domainnamefilename
done < ../DomainExtensions/$domainextensionsfilename

if [ "$3" == "parallel" ]
then
    cat fulllisttemp.txt | parallel ./helperscripts/whoisparallel.sh {} $domainnamefilenamenoextension $TIME
fi