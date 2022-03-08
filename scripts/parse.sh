#!/bin/bash
# -d flag : Name of the wordlist file containing list of domain names. First will look under the "domainnames" directory, next will look at full path.
# -e flag : Name of the wordlist file containing list of domain extensions. First will look under the "domainextensions" directory, next will look at full path.
# -p flag : Set this to "true" if you would like to run in parallel. Set to "false" or don't include the flag to run serially.
# -j flag : Set this to "true" if you would like to gather the latest results and format them into a JSON file. Set to "false" or don't include the flag to skip this.
# Example run: "./parse.sh -d samplenames.txt -e sampleextensions.txt -p true -j true"

# Parsing in command line input
while getopts d:e:p:j: flag
do
    case "${flag}" in
        d) domainfileinput=${OPTARG};;
        e) extensionfileinput=${OPTARG};;
        p) parallelinput=${OPTARG};;
        j) jsoninput=${OPTARG};;
    esac
done

# Handling errors in command line input
inputerror=false
if [ "$domainfileinput" == "" ]
then
    echo "-d flag wasn't provided. parse.sh needs a domain names wordlist input file"
    inputerror=true
elif [ ! -f ../domainnames/$domainfileinput ] && [ ! -f $domainfileinput ]
then
    echo "-d flag was provided with an invalid file"
    inputerror=true
fi
if [ "$extensionfileinput" == "" ]
then
    echo "-e flag wasn't provided. parse.sh parse.sh needs a domain extensions wordlist input file"
    inputerror=true
elif [ ! -f ../domainextensions/$extensionfileinput ] && [ ! -f $extensionfileinput ]
then
    echo "-e flag was provided an invalid file"
    inputerror=true
fi
if [ "$parallelinput" == "" ]
then
    parallelinput=false
elif [ $parallelinput != "true" ] && [ $parallelinput != "false" ]
then
    echo "-p flag input should be either \"true\" or \"false\""
    inputerror=true
elif [ $parallelinput == "true" ]
then
    parallelinput=true
elif [ $parallelinput == "false" ]
then
    parallelinput=false
fi
if [ "$jsoninput" == "" ]
then
    jsoninput=false
elif [ $jsoninput != "true" ] && [ $jsoninput != "false" ]
then
    echo "-j flag input should be either \"true\" or \"false\""
    inputerror=true
elif [ $jsoninput == "true" ]
then
    jsoninput=true
elif [ $jsoninput == "false" ]
then
    jsoninput=false
fi
if $inputerror
then
    exit
fi

# Setting the correct paths for domain and extension wordlist files
if [ -f ../domainnames/$domainfileinput ]
then
    domainfileinput="../domainnames/$domainfileinput"
fi
if [ -f ../domainextensions/$extensionfileinput ]
then
    extensionfileinput="../domainextensions/$extensionfileinput"
fi

# Removing path and extensions from domain wordlist input
removedpath=${domainfileinput##*/}
domainwordlist=${removedpath%%.*}

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

    if [ ! -d "../results/$extension/$domainwordlist" ] 
    then
        mkdir "../results/$extension/$domainwordlist"
        mkdir "../results/$extension/$domainwordlist/domainerror"
        mkdir "../results/$extension/$domainwordlist/domainfree"
        mkdir "../results/$extension/$domainwordlist/domaintaken"
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
done < $extensionfileinput

# Main loop running whois command
whoiscounter=0
TIME="$(date +%Y_%m_%d_%H_%M_%S)"

if $parallelinput
then
    truncate -s 0 fulllisttemp.txt
    while read extension || [ -n "$extension" ]
    do
        while read domain || [ -n "$domain" ]
        do
            whoiscounter=$((whoiscounter+1))
            echo $whoiscounter $domain.$extension
        done < $domainfileinput
    done < $extensionfileinput  >> fulllisttemp.txt
    echo "Running whois command loop:"
    cat fulllisttemp.txt | parallel  ./helperscripts/whoisparallel.sh {} $domainwordlist $TIME
    echo "Sorting output files"
    while read extension || [ -n "$extension" ]
    do
        TAKENFILE="../results/$extension/$domainwordlist/domaintaken/taken$TIME.txt"
        if [ -f $TAKENFILE ] 
        then
            sort $TAKENFILE -o $TAKENFILE
        fi

        FREEFILE="../results/$extension/$domainwordlist/domainfree/free$TIME.txt"
        if [ -f $FREEFILE ] 
        then
            sort $FREEFILE  -o $FREEFILE 
        fi

        ERRORFILE="../results/$extension/$domainwordlist/domainerror/error$TIME.txt"
        if [ -f $ERRORFILE ] 
        then
            sort $ERRORFILE  -o $ERRORFILE 
        fi
    done < $extensionfileinput
    echo "Deleting temp file"
    rm fulllisttemp.txt
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
                echo $domain >> ../results/$extension/$domainwordlist/domainfree/free$TIME.txt
            elif [ "$DATA" == "taken" ]
            then
                DATE=$(cat whoistemp.txt | ./responseparsescripts/$extension/getdate.sh)
                echo $domain $DATE >> ../results/$extension/$domainwordlist/domaintaken/taken$TIME.txt
            else
                echo $domain >> ../results/$extension/$domainwordlist/domainerror/error$TIME.txt
            fi
        done < $domainfileinput
    done < $extensionfileinput
    echo "Deleting temp file"
    rm whoistemp.txt
fi

if $jsoninput
then
    echo "Formatting latest results into a JSON file"
    python ./helperscripts/json_convert.py
fi