# Dependent Tree

CLI utility which builds a dependent tree for your package to find out where it is used. 
Works on a per-organization basis : it doesn't search all of npm, just your organization. 

## Steps : 

- get an oauth token from github so dependent-tree can access the github api
- set up your .env file
- clone all the package jsons for your organization
- update package jsons as needed
- query dependent-tree for a given package
- dependent-tree will output a pretty-printed tree describing all the places your package is installed

## Setup : 

As I mentioned above, you need to head to github and generate an oauth token for yourself : 
https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
Once you've done that, configure the following settings in your .env file :

```
DEPENDENT_TREE_ORG=my_org
DEPENDENT_TREE_OAUTH=xxx
GIT_USER=its_me
GIT_PW=something_secret
LOG_LEVEL=info
```

## Usage : 

See below for setup


## log levels 

- error
- warn
- info
- trace

Trace has the highest amount of output, it's actually handy for the step where you are 
