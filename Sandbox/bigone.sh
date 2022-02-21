#!/bin/bash
# $1 - Domain Extentions File
# $2 - Domains Names File

TIME="$(date +%Y%m%d%H%M%S)"
while read domain;
do
    echo $domain
    # whois $domain.com > tempfile
    # DATA=`cat tempfile | ../Results/com/Scripts/free_taken_script`
    # echo $domain $DATA
    # if [ "$DATA" == "free" ]
    # then
    #   echo $domain >> ../Results/com/DomainFree/free$TIME
    # elif [ "$DATA" == "taken" ]
    # then
    #   DATE=`cat tempfile | ../Results/com/Scripts/get_date_script`
    #   echo $domain $DATE >> ../Results/com/DomainTaken/taken$TIME
    # else
    #   echo $domain >> ../Results/com/DomainError/error$TIME
    # fi
done < $1
