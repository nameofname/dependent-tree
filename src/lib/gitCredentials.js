"use strict";


const cloneOptions = {
    fetchOpts: {
        callbacks: {
            credentials: () => Git.Cred.userpassPlaintextNew(process.env.GIT_USER, process.env.GIT_PW)
        }
    }
};

const authCloneUrl = (projectName) => {
    const user = process.env.GIT_USER;
    const pass = process.env.GIT_PW;
    return `https://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@github.com/${projectName}.git`;
};


module.exports = {
    cloneOptions,
    authCloneUrl
};
