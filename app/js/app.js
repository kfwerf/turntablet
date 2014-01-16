// Generated by CoffeeScript 1.6.3
var config;

config = {
  baseUrl: "js",
  paths: {
    jquery: "vendor/jquery",
    radio: "vendor/radio"
  }
};

require.config(config);

requirejs(["jquery", "modules/turntable/turntable"], function($, Turntable) {
  console.debug("App init");
  return $(document).ready(function() {
    var objTurntable;
    objTurntable = new Turntable();
    return window.turntable = objTurntable;
  });
});