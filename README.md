# whoisscrape

## Description

This project was initially created with the intention to find the smallest possible domain name that I could purchase. This project is mostly written using Bash scripts. They work by running the *whois* command on a loop with an input of a domain name wordlist and domain extension wordlist. This project is helpful if you would like to quickly query the avaliablity of a specific list of domain names and domain extensions. To see select results from this script you can view them at [johnprovazek.com/whoisscrape](https://www.johnprovazek.com/whoisscrape/).

Main whois loop is built using Bash scripts. A Python script is used to format the data into a JSON file. Website is developed using vanilla JavaScript.

## Installation

This project is build using Bash and Python scripts and will need to be run on a terminal that supports running these types of scripts. When running this on a Windows machine you may need to use the command *dos2unix* to format the *.txt* and *.sh* files to get them to work. If you would like to convert all *.txt* and *.sh* files with the *dos2unix* command here is a command you could run on the root directory:
```
find . -type f \( -iname "*.txt" -o -iname "*.sh" \) -exec dos2unix {} +
```

## Usage

Start by adding your domain name wordlist file to the directory [domainnames](./domainnames). This domain name wordlist file should be a list of domain names you would like to query. This list should not include any extensions. Here is an example of the contents of the domain names wordlist file [samplenames.txt](./domainnames/samplenames.txt): 
```
cooldomainname
google
johnprovazek
```
Next add your domain extension wordlist file to the directory [domainextensions](./domainextensions). This domain extension wordlist file should be a list of domain extensions you would like to query along with your domain names. Here is an example of the contents of the domain extensions wordlist file [sampleextensions.txt](./domainextensions/sampleextensions.txt):
```
com
net
us
```

Many extensions will resolve to a whois server that will impose a quota on the number of queries allowed in an alloted time. If you would like to use these extensions you may need to add waiting logic into my scripts. Many extensions will also resolve to a whois server that will have out of date or incomplete data. In my research **.com**, **.net**, and **.io** were the few extensions that would allow an unlimited amount of queries and also kept their data mostly up to date.

The last steps you may need to take are modifying the *freetaken.sh* and *getdate.sh* scripts for each extension. Under the [responseparsescripts](./scripts/responseparsescripts/) directory there should be a directory for each extension that will contain these scripts. Unfortuntaly, whois responses do not follow the same format for every extension. The *freetaken.sh* script is needed to parse the whois responses to determine if the domain is free or taken. The *getdate.sh* script is needed to parse the whois responses of taken domains to find the date the domain was registered. Each extension directory should have a *freetaken.sh* and *getdate.sh* script. If the main script [parse.sh](./scripts/parse.sh) is ran on an unfamiliar extension it will create the directory structure and use starter *freetaken.sh* and *getdate.sh* scripts that will likely need to be modified.

To run the main script navigate to the [scripts](./scripts) directory and run the script [parse.sh](./scripts/parse.sh). The following table is a list of the arguments the script will accept.

| Argument | Required/Optional | Description |
| ----------- | ----------- | ----|
| -d | Required | Name of the wordlist file containing a list of domain names. This scripts will first look under the domainnames directory for the file, next it will look at the full path. |
| -e | Required | Name of the wordlist file containing a list of domain extensions. This scripts will first look under the domainextensions directory for the file, next it will look at the full path. |
| -p | Optional |Set this to "true" if you would like to run in parallel. |
| -j | Optional |Set this to "true" if you would like to gather the latest results and format them into a JSON file under the results directory. |

Here is an example usage:
```
./parse.sh -d samplenames.txt -e sampleextensions.txt -p true -j true
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

## Bugs & Improvements
- Add logic to handle extensions that impose a quota

## License

No License for now until I have a better understanding of this. Would like this to be free for non commercial use.
