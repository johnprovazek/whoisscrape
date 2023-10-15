#!/bin/bash
# Main Script.
# -d flag : Name of the wordlist file containing list of domain names. First will look under the "domainnames" directory, next will look at full path.
# -e flag : Name of the wordlist file containing list of domain extensions. First will look under the "domainextensions" directory, next will look at full path.
# -p flag : Set this to "true" if you would like to run in parallel. Set this to "false" or remove the flag to run serially.
# -j flag : Set this to "true" if you would like to gather the latest results and format them into a JSON file. Set to "false" or remove the flag to skip this.
# Example run: "./whoisscrape.sh -d samplenames.txt -e sampleextensions.txt -p true -j true"

# Parsing in command line input.
while getopts d:e:p:j: flag
do
    case "${flag}" in
        d) domainfileinput=${OPTARG};;
        e) extensionfileinput=${OPTARG};;
        p) parallelinput=${OPTARG};;
        j) jsoninput=${OPTARG};;
    esac
done

# Handling errors in command line input.
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

# Setting the correct paths for domain and extension wordlist files.
if [ -f ../domainnames/$domainfileinput ]
then
    domainfileinput="../domainnames/$domainfileinput"
fi
if [ -f ../domainextensions/$extensionfileinput ]
then
    extensionfileinput="../domainextensions/$extensionfileinput"
fi

# Removing path and extensions from domain wordlist input.
removedpath=${domainfileinput##*/}
domainwordlistname=${removedpath%%.*}

# Checking if Result directory is setup.
if [ ! -d "../results" ] 
then
    mkdir "../results"
fi

# Checking if extension directories are setup.
echo "Creating directory structure if necessary"
while read extension || [ -n "$extension" ]
do
    if [ ! -d "../results/$extension" ] 
    then
        mkdir "../results/$extension"
    fi
    if [ ! -d "../results/$extension/$domainwordlistname" ] 
    then
        mkdir "../results/$extension/$domainwordlistname"
        mkdir "../results/$extension/$domainwordlistname/domainerror"
        mkdir "../results/$extension/$domainwordlistname/domainfree"
        mkdir "../results/$extension/$domainwordlistname/domaintaken"
    fi
done < $extensionfileinput

# Main loop running whois command.
time="$(date +%Y_%m_%d_%H_%M_%S)"

if $parallelinput
then
    echo "Creating temp file of domains to be ran in parallel"
    truncate -s 0 fulllisttemp.txt
    while read extension || [ -n "$extension" ]
    do
        while read domain || [ -n "$domain" ]
        do
            echo $domain.$extension
        done < $domainfileinput
    done < $extensionfileinput  >> fulllisttemp.txt
    echo "Running whois command loop:"
    cat fulllisttemp.txt | parallel  ./parallelprocess.sh {} $domainwordlistname $time
    echo "Sorting output files"
    while read extension || [ -n "$extension" ]
    do
        takenfile="../results/$extension/$domainwordlistname/domaintaken/taken$time.txt"
        if [ -f $takenfile ] 
        then
            sort $takenfile -o $takenfile
        fi
        freefile="../results/$extension/$domainwordlistname/domainfree/free$time.txt"
        if [ -f $freefile ] 
        then
            sort $freefile  -o $freefile 
        fi
        errorfile="../results/$extension/$domainwordlistname/domainerror/error$time.txt"
        if [ -f $errorfile ] 
        then
            sort $errorfile  -o $errorfile 
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
            data=$(./parseoutput.sh <(whois $domain.$extension) $extension)
            echo $domain.$extension: $data
            if [ "$data" == "free" ]
            then
                echo $domain >> ../results/$extension/$domainwordlistname/domainfree/free$time.txt
            elif [ "$data" == "taken" ]
            then
                echo $domain >> ../results/$extension/$domainwordlistname/domaintaken/taken$time.txt
            else
                echo $domain >> ../results/$extension/$domainwordlistname/domainerror/error$time.txt
            fi
        done < $domainfileinput
    done < $extensionfileinput
fi

if $jsoninput
then
    echo "Formatting latest results into a JSON file"
    python3 ./json_convert.py
fi