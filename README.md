# whoisscrape

## Description

This project was initially created with the intention to find the smallest possible domain name that I could purchase. This project is a few Bash scripts that work by running the *whois* command on a loop with domain name and domain extension wordlists. This project is helpful if you would like to quickly query the avaliablity of a specific list of domain names and domain extensions. To see select results from the script you can view my website [johnprovazek.com/whoisscrape](https://www.johnprovazek.com/whoisscrape/).

Built using Bash scripts.

## Installation

This project is build using Bash scripts and will need to be run on a terminal that supports running Bash scripts. When running this on a Windows machine you may need to use the command *dos2unix* to format the *.txt* and *.sh* files to get them to work. If you would like to convert all *.txt* and *.sh* files with the *dos2unix* command here is a command you could run on the root directory:
```
find . -type f \( -iname "*.txt" -o -iname "*.sh" \) -exec dos2unix {} +
```

## Usage

Start by adding your wordlist to the directory [domainnames](./domainnames). This wordlist should be a list of domain names you would like to query. This list should not include any extensions. Here is an example of the wordlist [samplenames.txt](./domainnames/samplenames.txt): 
```
cooldomainname
google
johnprovazek
```
Next add a list of domain extensions you would like to query to the directory [domainextensions](./domainextensions). Here is an example of the wordlist [sampleextensions.txt](./domainextensions/sampleextensions.txt):
```
com
net
us
```

Many extensions will resolve to a whois server that will impose a quota on the number of queries allowed in an alloted time. If you would like to use these extensions you will need to add waiting logic to my scripts. Many extensions will also resolve to a whois server that will have out of date data. In my research **.com**, **.net**, and **.io** were the few extensions that would allow an unlimited amount of queries and kept their data mostly up to date.

The last steps you may need to take are modifying the *freetaken.sh* and *getdate.sh* scripts for each extension. Under the [responseparsescripts](./scripts/responseparsescripts/) directory there should be a directory for each extension that will contain these scripts. Unfortuntaly, whois responses do not follow the same format for every extension. The *freetaken.sh* script is needed to parse the whois responses to determine if the domain is free or taken. The *getdate.sh* script is needed to parse the whois responses of taken domains to find the date the domain was registered. Each extension directory should have a *freetaken.sh* and *getdate.sh* script. If the main script [parse.sh](./scripts/parse.sh) is ran on an unfamiliar extension it will create the directory structure and use starter *freetaken.sh* and *getdate.sh* scripts that will likely need to be modified.

To run the main script navigate to the [scripts](./scripts) directory and run the script [parse.sh](./scripts/parse.sh). The first argument should be the name of the domain name wordlist. The second argument should be the name of the domain extension wordlist. You don't need to add the full path if your script is in the [domainnames](./domainnames) and [domainextensions](./domainextensions) directories. Include the string *parallel* in the third agument postion if you would like to run this in parallel. For example:
```
./parse.sh samplenames.txt sampleextensions.txt parallel
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
The results will be stored in the [results](./results) directory. 

In the [helperscripts](./scripts/helperscripts) directory I have also included the script [json_convert.py](./scripts/helperscripts/json_convert.py) if you would like to gather the latest results and format them into a JSON file.

## Bugs & Improvements
- Handle extensions that impose a quota
- Code assumes *.txt* files, make this available for files without extensions
- Code assumes wordlists are in the correct directory, make code work with direct paths to wordlists.

## License

No License for now until I have a better understanding of this. Would like this to be free for non commercial use.
