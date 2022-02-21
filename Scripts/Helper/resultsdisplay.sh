#!/bin/bash

cd ..
cd Results
echo '-------------------------'
while read domain;
do
    echo $domain
    cd $domain
    head whois_pass
    cd ..
    echo '--------------------------'
    #mkdir $domain
    #cd $domain
    #whois a.$domain > whois_pass
    #whois asdfkasdkfakjsldfkasdjfaksldjfknensdfasdfasd.$domain > whois_fail
    #cd ..
done < $1


