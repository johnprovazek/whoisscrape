# whoisscrape

## Description

This project was initially created to find the smallest possible domain name I could purchase. This script works by running the whois command on a loop with a domain name wordlist and domain extension wordlist. I have rewritten this project as a template that can be run with any domain name wordlist and domain extension wordlist of your choice. This is a helpful project if you would like to quickly query the avaliablity of a specific list of domain names.

## Installation

This is a Bash script. This script will need to be ran on a terminal that supports Bash. 

## Usage

Start by adding your wordlist to the directory [DomainNames](./DomainNames). This list should be a list of domain names you would like to query. This list should not include any extensions. Here is an example with the contents of the [SAMPLENAMES.txt](./DomainNames/SAMPLENAMES.txt) wordlist: 
```
cooldomainname
google
johnprovazek
```
Next add a list of domain extensions you would like to query to the directory [DomainExtensions](./DomainExtensions). Here is an example with the contents of the [SAMPLEEXTENSIONS.txt](./DomainExtensions/SAMPLEEXTENSIONS.txt) wordlist:
```
com
net
us
```
Navigate to the [Scripts](./Scripts) directory and run the script [parse.sh](./Scripts/parse.sh). The first argument should be the name of the domain name wordlist. The second argument should be the name of the domain extension wordlist. You do not need to add the full path if your script is in the [DomainNames](./DomainNames) and [DomainExtensions](./DomainExtensions) directories. For example:
```
./parse.sh SAMPLENAMES.txt SAMPLEEXTENSIONS.txt
```
This will run the whois command on the following domain names:
```
cooldomainname.com
google.com
johnprovazek.com
cooldomainname.net
google.net
johnprovazek.net
cooldomainname.us
google.us
johnprovazek.us
```
The results will be stored in the [Results](./Results) directory. There will be a directory for each extension provided. Under that there will be a directory that corresponds with the domain name wordlist provided. Under that there will be the directories DomainError, DomainFree, and DomainTaken. Each will contain a *.txt* file that details the results of the whois command.

The last steps you may need to take are modifying the *free_taken.sh* and *get_date.sh* scripts for each extension. Under the [FreeTakenGetDate](./Scripts/FreeTakenGetDate/) directory there should be a directory for each extension. Each extension directory should have a free_taken.sh and get_date.sh script. Unfortunately, whois results do not follow a convention so these scripts are needed to parse the results.



## Bugs & Features
- Additionally output the results to a json file.
- Parallelize parse.sh to speed up script.
- Spend some time working on free_taken.sh scripts for popular extensions.
- Automate this for popular wordlists and extensions. Create a simple website to display the results.

## License

No License for now until I have a better understanding of this. Would like this to be free for non commercial use.