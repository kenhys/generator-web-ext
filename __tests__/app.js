'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

function run(prompts, done) {
  helpers.run(path.join(__dirname, '../generators/app'))
    .withOptions({
      'skip-install': true
    })
    .withPrompts(prompts)
    .on('end', done)
    .catch(e => {
      console.log(e);
    });
}

describe('generator-web-ext:app', () => {
  it('creates files', done => {
    run({name: 'someName'}, () => {
      assert.file([
        'package.json',
        'extension/manifest.json',
        'extension/_locales/en/messages.json'
      ]);
      done();
    });
  });

  it('set name in locales', done => {
    run({
      name: 'noPopup'
    }, () => {
      assert.fileContent('extension/_locales/en/messages.json', 'noPopup');
      done();
    });
  });

  it('allow no popup', done => {
    run({
      popup: false
    }, () => {
      assert.noFile('extension/popup/index.html');
      assert.noFileContent('extension/manifest.json', 'default_popup');
      done();
    });
  });

  it('set background', done => {
    run({
      background: true
    }, () => {
      assert.file('extension/background/index.js');
      assert.fileContent('extension/manifest.json', 'background');
      done();
    });
  });

  it('set permissions in manifest', done => {
    run({
      permissions: ['alarms', 'activeTab']
    }, () => {
      assert.fileContent([
          ['extension/manifest.json', 'permissions'],
          ['extension/manifest.json', 'alarms'],
          ['extension/manifest.json', 'activeTab']
      ]);
      done();
    });
  });
});
