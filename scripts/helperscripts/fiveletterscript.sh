#!/bin/bash
# Script used to generate a 5 letter words list in the pattern (Constant,Vowel,Constant,Vowel,Constant)
# Leaving here incase other Domain Name lists will be generated in the future

for c1 in {b,c,d,f,g,h,j,k,l,m,n,p,q,r,s,t,v,w,x,y,z}
do  
    for c2 in {a,e,i,o,u}
    do
        for c3 in {b,c,d,f,g,h,j,k,l,m,n,p,q,r,s,t,v,w,x,y,z}
        do
            for c4 in {a,e,i,o,u}
            do
                for c5 in {b,c,d,f,g,h,j,k,l,m,n,p,q,r,s,t,v,w,x,y,z}
                do
                    printf "%s\n" "$c1$c2$c3$c4$c5" >> AZAZA
                done
            done
        done
    done
done
