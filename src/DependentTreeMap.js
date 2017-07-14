"use strict";


const path = require('path');
const fs = require('fs');
const log = require('./lib/logger');
const assert = require('assert');


class DependentLinkNode {
    constructor({type, version, packageNode}) {
        assert(packageNode instanceof PackageNode, 'packageNode must be an instance of PackageNode class.');
        assert(type && version);
        this.type = type;
        this.version = version;
        this.packageNode = packageNode;
    }
}

class PackageNode {
    constructor({name, version, packageJson}) {
        assert(name && version && packageJson);
        this.name = name;
        this.version = version;
        this.packageJson = packageJson;
        this._dependents = {};
    }

    addDependent(packageName, linkNode) {
        assert(linkNode instanceof DependentLinkNode);
        this._dependents[packageName] = linkNode;
    }

    iterateDependents(callback) {
        Object.keys(this._dependents).forEach(key => {
            callback(this._dependents[key], key);
        });
    }
}


class DependentTreeMap {

    constructor() {
        this.packageStore = {};
        this.multiPackageProjects = ['dibs-components', 'dibs-utils'];
        this.specialCases = {
            '1stdibs.com': '/dibs'
        };

        /**
         * Example structure :
         *      {
         *          "package-name-1": PackageNode({
         *              name,
         *              version,
         *              packageJson
         *              dependents: {
         *                  "package-name-2": PackageNode({ ... }),
         *                  "package-name-3": PackageNode({ ... }),
         *              },
         *          })
         *      }
         */
        this._buildPackageStore();
    }

    getDependentTree(packageName) {
        const packageNode = this.packageStore[packageName];
        if (!packageNode) {
            log.error(`Invalid package name, ${packageName} not found in dependent map`);
            return;
        }
        log.trace(packageNode);
        return this._buildTreeRecur(packageNode, {}, [packageName])
    }


    _buildTreeRecur(currNode, obj, pathToNode) {
        const occurrences = pathToNode.filter(n => n === currNode.name).length;
        if (occurrences > 1) {
            log.warn(`found circular dependency for ${currNode.name}, path : ${JSON.stringify(pathToNode)}`);
            return;
        } else {
            log.trace(`building dependent tree, path to ${currNode.name} = ${JSON.stringify(pathToNode)}`)
        }

        currNode.iterateDependents((linkNode, packageName) => {
            const {packageNode, type, version} = linkNode;
            obj[packageName] = {type, version, dependents: {}};
            return this._buildTreeRecur(packageNode, obj[packageName].dependents, [...pathToNode, packageName]);
        });

        return obj;
    }


    iteratePackageStore(callback) {
        Object.keys(this.packageStore).forEach(packageName => {
            callback(this.packageStore[packageName], packageName);
        });
    }

    _getRepoPath (folderArr) {
        return path.resolve(__dirname, `../repos/${folderArr ? folderArr.join('/') : ''}`);
    }

    _findPackJsonInDir (dirPath) {
        const jsonPath = `${dirPath}/package.json`;
        let packageJson;

        if (fs.existsSync(jsonPath)) {
            try {
                packageJson = require(jsonPath);

                const {name, version} = packageJson;
                this.packageStore[packageJson.name] = new PackageNode({
                    name, version, packageJson
                });
                log.trace(`Successfully required package.json from ${jsonPath}`);
            } catch (e) {
                log.error(`package.json exists for ${dirPath} but could not be required`);
            }
        } else {
            log.trace(`Skipping ${jsonPath}, no package.json found`);
        }
    }

    _buildPackageStore() {
        fs.readdirSync(this._getRepoPath())
            .forEach(path => {
                if (this.multiPackageProjects.includes(path)) {
                    fs.readdirSync(this._getRepoPath([path]))
                        .forEach(nestedPath => {
                            const fullNestedPath = this._getRepoPath([path, nestedPath]);
                            const isDir = fs.lstatSync(fullNestedPath).isDirectory();
                            if (isDir) {
                                this._findPackJsonInDir(fullNestedPath);
                            }
                        });
                } else {
                    let pathArr = [path];
                    if (this.specialCases[path]) {
                        pathArr.push(this.specialCases[path]);
                    }
                    this._findPackJsonInDir(this._getRepoPath(pathArr));
                }
            });


        this.iteratePackageStore((packageNode) => {
            const {dependencies = {}, devDependencies = {}, peerDependencies = {}} = packageNode.packageJson;
            this._addDependentsToPackage(packageNode, dependencies, 'dependencies');
            this._addDependentsToPackage(packageNode, devDependencies, 'devDependencies');
            this._addDependentsToPackage(packageNode, peerDependencies, 'peerDependencies');
        });

    }

    // packageName becomes a dependency of every entry in depObj - if it exists in the store.
    _addDependentsToPackage (packageNode, depObj, type) {
        Object.keys(depObj).forEach(dependencyName => {
            if (this.packageStore.hasOwnProperty(dependencyName)) {
                // packageNode has a dependency of dependencyName - therefore dependencyName is dependent on packageNode
                const dependentPackageNode = this.packageStore[dependencyName];
                const version = depObj[dependencyName];
                dependentPackageNode.addDependent(packageNode.name, new DependentLinkNode({
                    type, version, packageNode
                }));
            }
        });
    }
}

module.exports = DependentTreeMap;
