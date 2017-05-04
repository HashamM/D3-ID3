import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import path from 'path';

export default class TextEditor extends Component {
  constructor(props) {
    super();
    this.state = {
      url: path.resolve(__dirname, 'app/components/temp/temp.html'),
    }
  }

  componentDidMount() {
    let amdRequire = global.require('monaco-editor/min/vs/loader.js').require;
    // var path = require('path');
    const fs = require('fs');

    function uriFromPath(_path) {
      var pathName = path.resolve(_path).replace(/\\/g, '/');
      if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
      }
      return encodeURI('file://' + pathName);
    }

    // uriFromPath needs to take in a path including the main folder
    // __dirname doesn't reach ID3-React
    amdRequire.config({
      baseUrl: uriFromPath(path.resolve(__dirname, 'node_modules/monaco-editor/min/'))
    });

    // workaround monaco-css not understanding the environment
    self.module = undefined;
    // workaround monaco-typescript not understanding the environment
    self.process.browser = true;
    var editor;

    amdRequire(['vs/editor/editor.main'], () => {
      editor = monaco.editor.create(document.getElementById('one'), {
        value: [
					'//code here'
				].join('\n'),
        language: 'javascript',
        theme: "vs-dark",
        wrappingColumn: 0,
        scrollBeyondLastLine: false,
        wrappingIndent: "indent",
      });

      window.onresize = () => {
        editor.layout();
      }

      setInterval(function(){
        fs.writeFile(path.resolve(__dirname, 'app/components/temp/temp.html'), editor.getValue(), (err) => {
          if (err) throw err;
          // console.log('The file has been saved!');
        })
      }, 300);


      setInterval(function(){
        const webview = document.querySelector('webview');
        webview.reload();
      }, 300);
    });

  }

  render() {
    return (
      <div>
        <div
          id="one"
          style={{ height: '45vh' }}
        >
        </div>
        <webview src={this.state.url} style={{height: '50vh'}}>
        </webview>
      </div>
    );
  }
}