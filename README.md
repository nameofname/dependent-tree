# Dependent Tree

CLI utility which builds a dependent tree for your package to find out where it is used.
The 'dependent tree' is the inverse of a package's dependency tree - it's a tree of all packages depending on a given package.
This utility works on a per-organization basis : it doesn't search all of npm, just your organization.

Note* : this util uses the github API which by default only searches master branches of repositories. I currently don't have a way to modify this in any way, but I'm accepting PRs :)

## Steps :

- get an oauth token from github so dependent-tree can access the github api
- set up your environment variables
- clone all the package jsons for your organization (WARNING! this takes a second if you have a lot of packages)
- update package jsons as needed
- query dependent-tree for a given package
- dependent-tree will output a pretty-printed tree describing all the places your package is installed

## Setup :

```
yarn global add dependent-tree
npm install dependent-tree --global
```

As I mentioned above, you need to head to github and generate an oauth token for yourself :
https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
Once you've done that, configure the following settings in your .env file.
The .env file lives at the root of the dependent-tree project...

```
DEPENDENT_TREE_ORG=my_org
DEPENDENT_TREE_OAUTH=github_personal_access_token_goes_here
LOG_LEVEL=info
```

... Alternately you can export these from a global config (like your .profile or .bash_profile) like :

```
export DEPENDENT_TREE_ORG=my_org
```

## Usage :

```
dependent-tree -u
```
Update the dependent tree package list. You should use this command sporadically to ensure you have up to date info on each of your packages.
WARNING! This step can take a second!

```
dependent-tree -p package-name
```
Build the dependent tree for a given package. This will not work if you haven't run the update command first (see below).


## log levels

- error
- warn
- info
- trace

Trace has the highest amount of output, it's actually handy for the update command and will show you every request being made.


## To-do :

- make it more clear what that version number is
- make it more clear with a circular dependency is present. 
- .env is using current working dir - pass the dir to dotenv() instead
- update the readme - the GH pw and user name are both not required. 
- remove the allRepos.json file.