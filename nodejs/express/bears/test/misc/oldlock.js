var EventEmitter = require('events').EventEmitter;

BearPool = function() {
  this.queue = new EventEmitter();
  this.locked = false;
  this.lock = function lock(fn) {
    if (this.locked) {
      this.queue.once('ready', function() { lock(fn); });
    } else {
      this.locked = true;
      fn();
    }
  };
  this.release = function release() {
    this.locked = false;
    this.queue.emit('ready');
  };
}
