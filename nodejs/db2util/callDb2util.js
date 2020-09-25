const { Client } = require('ssh2');

function callDb2util(config, done) {
    const {
      verbose = false,
    } = config;
  
    const client = new Client();
    const command = `/QOpenSys/pkgs/bin/db2util '${config.query}'`;
  
    let output = '';

    client.on('error', (error) => {
      if (verbose) {
        console.log('SSH CLIENT ERROR: ', error);
      }
      client.end();
      client.destroy();
      done(error, null);
    });

    client.on('close', () => {
      if (verbose) {
        console.log('SSH Client has closed');
      }
    });
  
    client.on('end', () => {
      if (verbose) {
        console.log('SSH Client has ended');
      }
    });
  
    client.on('ready', () => {
      if (verbose) {
        console.log('SSH Client is ready');
      }
      client.exec(command, (error, stream) => {
        if (error) {
          if (verbose) {
            console.log('Exec error: ', error);
          }
          client.emit('error', error);
          return;
        }
        stream.on('exit', (code, signal, didCoreDump, description) => {
          if (verbose) {
            console.log(`Stream exit code: ${code}`);
            if (signal) {
              console.log(`Signal: ${signal}, Description: ${description}`);
            }
          }

          if (signal) {
            client.emit('error', new Error(`db2util was signaled with: ${signal}`));
            done(new Error(`db2util was signaled with: ${signal}`), null)
            return;
          }
  
          if (code !== 0) {
            client.emit('error', new Error(`db2util exited abnormally with code: ${code}`));
            done(new Error(`db2util exited abnormally with code: ${code}`), null);
            return;
          }
          client.end();
          client.destroy();
          done(null, output);
        });

        stream.stdin.on('end', () => {
          if (verbose) {
            console.log('stdin has ended');
          }
        });
  
        stream.stdout.on('end', () => {
          if (verbose) {
            console.log('stdout has ended');
          }
        });
  
        stream.stdout.on('data', (data) => {
          output += data.toString();
          if (verbose) {
            console.log(`STDOUT:\n${data}`);
          }
        });
  
        stream.stderr.on('data', (data) => {
          if (verbose) {
            console.log(`STDERR:\n${data}`);
          }
        });
      });
    });
  
    client.connect(config);
  }
  
  module.exports = callDb2util;
