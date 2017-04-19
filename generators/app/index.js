'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const manifestOptions = require('./manifestOptions');

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(
      'Welcome to the grand ' + chalk.red('Web Extension') + ' generator!'
    ));

    const prompts = [{
      name: 'name',
      message: 'How would you like to name your web extension?',
      default: (this.appname) ? this.appname : 'myWebExtension'
    },
    {
      name: 'description',
      message: 'Give a description for your web extension',
    },
    {
      name: 'destinationFolder',
      message: 'Do you want to scaffold your web extension in the current folder?',
      type: 'confirm',
      default: true
    },
    {
      name: 'popup',
      message: 'Would you like to use a popup?',
      type: 'confirm',
      default: true
    },
    {
      name: 'content_script',
      message: 'Would you like to use a content script?',
      type: 'confirm',
      default: false
    },
    {
      name: 'background',
      message: 'Would you like to use a background script?',
      type: 'confirm',
      default: false
    },
    {
      type: 'checkbox',
      name: 'permissions',
      message: 'Would you like to set permissions?',
      choices: manifestOptions.permissionChoices
    }];

    return this.prompt(prompts).then(answers => {
      this.appname = answers.name;
      this.locale = {
        name: this.appname,
        description: answers.description
      }
      this.destinationFolder = answers.destinationFolder;
      this.permissions = answers.permissions;
    });
  }

  destinationFolder() {
    if (!this.destinationFolder) {
      mkdirp(this.appname);
      this.destinationRoot(this.destinationPath(this.appname));
    }
  }

  packageJSON() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        appname: this.appname 
      }
    );
  }

  manifest() {
    this.fs.copyTpl(
      this.templatePath('_manifest.json'),
      this.destinationPath('extension/manifest.json')
    );
    if (this.permissions.length > 0) {
      this.fs.extendJSON(this.destinationPath('extension/manifest.json'), {
        permissions: this.permissions
      })
    }
  }

  extensionDirectory() {
    mkdirp('extension');
  }

  locales() {
    this.fs.copyTpl(
      this.templatePath('_locales/en/messages.json'),
      this.destinationPath('extension/_locales/en/messages.json'),
      this.locale
    );
  }

  install() {
    if (!this.options['skip-install']) {
      this.installDependencies({bower: false});
    }
  }
};
