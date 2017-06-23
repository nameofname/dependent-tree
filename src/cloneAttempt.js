"use strict";

const Git = require("nodegit");
const path = require('path');

const dir = path.resolve(`${__dirname}/../repos/nodegit`);
Git.Clone("https://github.com/nodegit/nodegit", dir)
// Look up this known commit.
    .then(function(repo) {
        // Use a known commit sha from this repository.
        console.log('I GIT IT!')
        return repo.getCommit("59b20b8d5c6ff8d09518454d4dd8b7b30f095ab5");
    })
    .catch(err => {
        console.log('nooooooooo....')
        console.log(err);
    });
