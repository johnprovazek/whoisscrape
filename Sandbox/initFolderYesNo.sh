#!/bin/bash

cd ..
mkdir Results
cd Results
while read domain;
do
    echo $domain
    mkdir $domain
    cd $domain
    whois hello.$domain > whois_taken
    whois asdfkasdkfakjsldfkasdjfaksldjfknensdfasdfasd.$domain > whois_free
    cd ..
done < $1


