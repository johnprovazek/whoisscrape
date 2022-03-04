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
echo "Creating directory structure if necessary"
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

    if [ ! -d "./responseparsescripts/$extension" ] 
    then
        mkdir "./responseparsescripts/$extension"
        cp "./responseparsescripts/freetaken.sh" "./responseparsescripts/$extension/freetaken.sh"
        cp "./responseparsescripts/getdate.sh" "./responseparsescripts/$extension/getdate.sh"
        # These are used as a reference to adapt the freetaken.sh and getdate.sh scripts. 
        whois A.$extension > "./responseparsescripts/$extension/whoistaken.txt"
        whois ASDFKASDKFAKJSLDFKASDJFAKSLDJFKNENSDFASDFASD.$extension > "./responseparsescripts/$extension/whoisfree.txt"
    fi
done < ../DomainExtensions/$domainextensionsfilename

# Main loop running whois command
whoiscounter=0
TIME="$(date +%Y_%m_%d_%H_%M_%S)"

if [ "$3" == "parallel" ]
then
    truncate -s 0 fulllisttemp.txt
    while read extension || [ -n "$extension" ]
    do
        while read domain || [ -n "$domain" ]
        do
            whoiscounter=$((whoiscounter+1))
            echo $whoiscounter $domain.$extension
        done < ../DomainNames/$domainnamefilename
    done < ../DomainExtensions/$domainextensionsfilename  >> fulllisttemp.txt
    echo "Running whois command loop:"
    cat fulllisttemp.txt | parallel  ./helperscripts/whoisparallel.sh {} $domainnamefilenamenoextension $TIME
    echo "Sorting output files"
    while read extension || [ -n "$extension" ]
    do
        TAKENFILE="../results/$extension/$domainnamefilenamenoextension/domaintaken/taken$TIME.txt"
        if [ -f $TAKENFILE ] 
        then
            sort $TAKENFILE -o $TAKENFILE
        fi

        FREEFILE="../results/$extension/$domainnamefilenamenoextension/domainfree/free$TIME.txt"
        if [ -f $FREEFILE ] 
        then
            sort $FREEFILE  -o $FREEFILE 
        fi

        ERRORFILE="../results/$extension/$domainnamefilenamenoextension/domainerror/error$TIME.txt"
        if [ -f $ERRORFILE ] 
        then
            sort $ERRORFILE  -o $ERRORFILE 
        fi
    done < ../DomainExtensions/$domainextensionsfilename
    echo "Deleting temp file"
    rm fulllisttemp.txt
    echo "Done"
else
    echo "Running whois command loop:"
    while read extension || [ -n "$extension" ]
    do
        while read domain || [ -n "$domain" ]
        do
            whoiscounter=$((whoiscounter+1))
            whois $domain.$extension > whoistemp.txt
            DATA=$(cat whoistemp.txt | ./responseparsescripts/$extension/freetaken.sh)
            echo $whoiscounter: $domain.$extension
            if [ "$DATA" == "free" ]
            then
                echo $domain >> ../results/$extension/$domainnamefilenamenoextension/domainfree/free$TIME.txt
            elif [ "$DATA" == "taken" ]
            then
                DATE=$(cat whoistemp.txt | ./responseparsescripts/$extension/getdate.sh)
                echo $domain $DATE >> ../results/$extension/$domainnamefilenamenoextension/domaintaken/taken$TIME.txt
            else
                echo $domain >> ../results/$extension/$domainnamefilenamenoextension/domainerror/error$TIME.txt
            fi
        done < ../DomainNames/$domainnamefilename
    done < ../DomainExtensions/$domainextensionsfilename
    echo "Deleting temp file"
    rm whoistemp.txt
    echo "Done"
fi