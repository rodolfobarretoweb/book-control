module.exports = function(grunt) {
  'use strict';

  var gruntConfig = {
    pkg: grunt.file.readJSON('package.json'),

    concat : {
      libraries : {
        src : [
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/bootstrap/dist/js/bootstrap.min.js',
        ],

        dest : 'assets/dist/js/libraries.min.js'
      }
    },

    cssmin : {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },

      combine : {
        files : {
          'assets/dist/css/all.min.css': [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'assets/css/style.css'
          ]
        }
      },

      merge : {
        files : [{
          expand : true,
          cwd    : 'assets/dist/css/',
          src    : ['all.min.css'],
          dest   : 'assets/dist/css/',
          ext    : '.min.css'
        }]
      }
    },

    uglify: {
      js: {
        files: {
          'assets/dist/js/libraries.min.js'  : ['assets/dist/js/libraries.min.js']
        }
      }
    },

    copy : {
      main: {
        files: [
          {
            expand :true,
            cwd    : 'node_modules/bootstrap/fonts/',
            src    : ['**'],
            dest   : 'assets/dist/fonts/'
          }
        ]
      }
    }
  };

  grunt.initConfig(gruntConfig);

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // tasks
  grunt.registerTask('default', ['copy', 'concat', 'cssmin']);
  grunt.registerTask('production', ['concat', 'uglify', 'cssmin']);
};
