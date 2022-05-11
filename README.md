# whoisscrape

## Description

This project was initially created with the intention to find the smallest possible domain name that I could purchase. This project is mostly written using Bash scripts. The scripts work by running the *whois* command on a loop with an input of a domain name wordlist and domain extension wordlist. This project is helpful if you would like to quickly query the availability of a specific list of domain names and domain extensions. To see select results from this script you can view them at [johnprovazek.com/whoisscrape](https://www.johnprovazek.com/whoisscrape/).

Built using Bash scripts. A Python script for formatting data into JSON format. Project site is developed using vanilla JavaScript.

## Installation

This project is build using Bash and Python scripts and will need to be run on a terminal that supports running these types of scripts. When running this on a Windows machine you may need to use the command *dos2unix* to format the *.txt* and *.sh* files to get them to work. If you would like to convert all *.txt* and *.sh* files with the *dos2unix* command, run this command on the project's root directory:
```
find . -type f \( -iname "*.txt" -o -iname "*.sh" \) -exec dos2unix {} +
```

## Usage

Start by adding your domain name wordlist file to the directory [domainnames](./domainnames). This domain name wordlist file should be a list of domain names you would like to query. This list should not include any extensions. Here is an example of the contents of the domain name wordlist file [samplenames.txt](./domainnames/samplenames.txt): 
```
cooldomainname
google
johnprovazek
```
Next add your domain extension wordlist file to the directory [domainextensions](./domainextensions). This domain extension wordlist file should be a list of domain extensions you would like to query. Here is an example of the contents of the domain extension wordlist file [sampleextensions.txt](./domainextensions/sampleextensions.txt):
```
com
net
us
```

Many extensions will resolve to a *whois* server that will impose a quota on the number of queries allowed in an alloted time. If you would like to use these extensions you may need to add waiting logic to my scripts. Many extensions will also resolve to a *whois* server that will have out of date or incomplete data. In my research **.com**, **.net**, and **.io** were the few extensions that would allow an unlimited amount of queries and also kept their data mostly up to date.

The last step you may need to take is modifying the [parseoutput.sh](./scripts/parseoutput.sh) script for each new extension you're querying. Unfortunately, *whois* responses do not follow the same format for every extension. The [parseoutput.sh](./scripts/parseoutput.sh) script is needed to parse the *whois* responses to determine if the domain is free or taken.

To query your wordlists run the main script [whoisscrape.sh](./scripts/whoisscrape.sh). The following table is a list of the arguments the script will accept.

| Argument | Required/Optional | Description |
| ----------- | ----------- | ----|
| -d | Required | Name of the wordlist file containing a list of domain names. This script will first look under the domainnames directory for the file, next it will look at the full path. |
| -e | Required | Name of the wordlist file containing a list of domain extensions. This script will first look under the domainextensions directory for the file, next it will look at the full path. |
| -p | Optional |Set this to "true" if you would like to run in parallel. |
| -j | Optional |Set this to "true" if you would like to gather the latest results and format them into a JSON file under the results directory. |

Here is an example usage:
```
./whoisscrape.sh -d samplenames.txt -e sampleextensions.txt -p true -j true
```
This will run the *whois* command on the following domain names:
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
- Use a linter and a style guide

## Device Tests

| Device                  | Browser       | Viewport Width | Viewport Height | Screen Width | Screen Height | DPR  | Default View | Alt View                         | Notes                                                |
|-------------------------|---------------|----------------|-----------------|--------------|---------------|------|--------------|----------------------------------|------------------------------------------------------|
| Windows 10              | Chrome 101    | 2560           | 1329            | 2560         | 1440          | 1.00 | 5/11/2022     | null                             |                                                      |
| Windows 10              | Edge 101      | 2560           | 1329            | 2560         | 2560          | 1.00 | 5/11/2022     | null                             |                                                      |
| Windows 10              | Firefox 99    | 2560           | 1315            | 2560         | 2560          | 1.00 | 5/11/2022     | null                             |                                                      |
| iPad Pro 11inch 3rd Gen | Safari iOS 15 | 834            | 1075            | 834          | 1194          | 2.00 | 5/11/2022     | 5/11/2022                         |                                                      |
| iPad Pro 11inch 3rd Gen | Chrome 101    | 834            | 1087            | 834          | 1194          | 2.00 | 5/11/2022     | 5/11/2022                         |                                                      |
| Pixel 3                 | Chrome 101    | 393            | 654             | 393          | 786           | 2.75 | 5/11/2022     | 5/11/2022                         |                                                      |
| iPhone 13               | Chrome 101    | 414            | 720             | 414          | 896           | 2.00 | 5/11/2022     | 5/11/2022                         |                                                      |
| iPhone 13               | Safari iOS 15 | 414            | 714             | 414          | 896           | 2.00 | 5/11/2022     | 5/11/2022                         |                                                      |