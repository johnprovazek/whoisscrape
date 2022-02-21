#!/bin/bash

succ=1
fail=1
while read domain;
do
    STR=`whois $domain.com | head -n 1 | cut -c 1-9`
    if [ "$STR" == "   Domain" ]
    then
        echo "$domain.com - in use"
    fi
    if [ "$STR" == "No match " ]
    then
        echo "$succ/$fail - $domain"
        echo "$domain" >> AZAZAwebsites
        ((succ=succ+1))
    fi
    ((fail=fail+1))
done < $1
