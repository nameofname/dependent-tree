"use strict";

require('dotenv')();
const path = require('path');
const fs = require('fs');
const Git = require('nodegit');
let allRepos;
try {
    allRepos = require('../allRepos.json');
} catch (e) {
    console.log('PLEAS READ : allRepos.json file doesn\'t exist. Run "yarn updateRepoList"\n', e);
    throw e;
}
allRepos = allRepos.filter(o => !!o.clone_url); // filter out urls that are empty or undefined
const cloneOptions = {
    fetchOpts: {
        callbacks: {
            certificateCheck: () => 1,
            credentials: () => NodeGit.Cred.userpassPlaintextNew(process.env.GIT_USER, GIT_PW)
        }
    }
};

// const cloneOptions = {
//     remoteCallbacks: {
//         credentials: (url, userName) => {
//             return Git.Cred.sshKeyFromAgent(userName);
//         }
//     }
// };


// TODO ! This is for immediate safety :
allRepos.splice(3, allRepos.length);
// TODO ! This is for immediate safety :


const cloneThem = () => {
    const promises = [];

    allRepos.forEach(o => {
        const { clone_url, name } = o;
        const dir = path.resolve(`${__dirname}/../repos/${name}`);
        if (!fs.existsSync(dir)) {
            console.log(`cloning ${name} into ${dir} via ${clone_url}`);
            promises.push(Git.Clone(clone_url, dir, cloneOptions));
        } else {
            console.log(`skipping ${dir} - it already exists`);
        }
    });

    Promise.all(promises)
        .then(() => {
            console.log('All repos cloned');
        })
        .catch(e => {
            console.log("Error cloning repo");
            throw e;
        })
};

module.exports = cloneThem;
