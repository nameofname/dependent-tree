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

## .env file : 

```
DEPENDENT_TREE_ORG=my_org
DEPENDENT_TREE_OAUTH=xxx
GIT_USER=its_me
GIT_PW=something_secret
LOG_LEVEL=info
```

## log levels 

- error
- warn
- info
- trace

Trace has the highest amount of output, it's actually handy for the step where you are 
