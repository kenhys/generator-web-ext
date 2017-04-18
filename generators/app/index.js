'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

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
    }];

    return this.prompt(prompts).then(answers => {
      this.appname = answers.name;
      this.locale = {
        name: this.appname,
        description: answers.description
      }
    });
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
    this.installDependencies();
  }
};
