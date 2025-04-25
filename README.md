# whoisscrape

## Description

This project was initially created with the intention to find the smallest possible domain name available for purchase.
This project was built with Bash and Python scripts.
The scripts work by running the _whois_ command on an input of a domain name word list and domain extension word list.
This project is helpful if you would like to quickly query the availability of a specific list of domain names and domain extensions.
To see select results from this script you can view them at [johnprovazek.com/whoisscrape](https://www.johnprovazek.com/whoisscrape/).

One of the discoveries upon building this project is that different domain extensions have different formatting for their _whois_ results.
This requires implementing parsing for many different domain extensions to determine if domains are available for purchase.

Upon updating this project, a similar [python project](https://github.com/richardpenman/whois) by [richardpenman](https://github.com/richardpenman) was discovered with wide user adoption and parsing setup for many different domain extensions.
Due to this discovery, this project will be placed on hold.
This project may be adapted in the future in favor of building off the community support found in that project.
For the time being this project will exist as it was and will not receive any further enhancements.

Built using Bash scripts. Project site developed using vanilla JavaScript.

<div align="center">
  <picture>
    <img src="https://repository-images.githubusercontent.com/461345312/e619a27f-2e34-4761-bb55-c4f29203fc08" width="830px">
  </picture>
</div>

## Installation

This project is built using Bash and Python scripts and will need to be run on a computer that supports running these types of scripts.

## Usage

You will need to create a domain name word list file and a domain extension word list file to utilize the [whoisscrape.sh](./scripts/whoisscrape.sh) script.

Start by adding your domain name word list file to the directory [domainnames](./domainnames).
This domain name word list file should be a list of domain names you would like to query.
This list should not include any extensions.
Here is an example of the contents of the domain name word list file [samplenames.txt](./domainnames/samplenames.txt):

```
cooldomainname
google
johnprovazek
```

Next add your domain extension word list file to the directory [domainextensions](./domainextensions).
This domain extension word list file should be a list of domain extensions you would like to query.
Here is an example of the contents of the domain extension word list file [sampleextensions.txt](./domainextensions/sampleextensions.txt):

```
com
net
us
```

The script [whoisscrape.sh](./scripts/whoisscrape.sh) is used to query the domain and extension word lists together. The following table is a list of arguments that the script will accept.

| Argument | Required/Optional | Description                                                                                                                     |
| -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| -d       | Required          | Name of the word list file containing a list of domain names.                                                                   |
| -e       | Required          | Name of the word list file containing a list of domain extensions.                                                              |
| -p       | Optional          | Set this to "true" if you would like to run the script in parallel.                                                             |
| -j       | Optional          | Set this to "true" if you would like to gather the latest results and format them into a JSON file under the results directory. |

Example script usage:

```bash
./whoisscrape.sh -d samplenames.txt -e sampleextensions.txt -p true -j true
```

This will run the _whois_ command on the following domain names:

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

The results of this script will be stored in the [results](./results) directory.

### Limitations

Many extensions will resolve to a _whois_ server that will impose a quota on the number of queries allowed in an alloted time.
If you would like to use these extensions you will need to add waiting logic to the scripts in this project.
Many extensions will also resolve to a _whois_ server that will have out of date or incomplete data.
In my research, **.com**, **.net**, and **.io** were the few extensions that wouldn't impose a quota and also kept their data mostly up to date.

The last step you may need to take is modifying the [parseoutput.sh](./scripts/parseoutput.sh) script for each new extension you're querying.
Unfortunately, _whois_ responses do not follow the same format for every extension.
The [parseoutput.sh](./scripts/parseoutput.sh) script is needed to parse the _whois_ responses to determine if the domain is free or taken.
The extensions that are currently accounted for in [parseoutput.sh](./scripts/parseoutput.sh) are **.com**, **.info**, **.io**, **.mx**, **.net**, **.tv**, **.uk**, and **.us**.
If you would like to query an extension outside of theses extensions you will need to add the parsing logic for that extension to the [parseoutput.sh](./scripts/parseoutput.sh) script.

## Bugs & Improvements

- Adapt this project to build off of the logic found in the [richardpenman/whois](https://github.com/richardpenman/whois) project.
- Setup a script to periodically run this project and update the website with the latest results.
