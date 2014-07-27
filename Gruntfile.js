module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      css: {
        src: ['public/css/bootstrap.min.css', 'public/css/ng-grid.min.css', 'public/css/quill.snow.css', 'public/css/toastr.css', 'public/css/home.css'],
        dest: 'public/dist/<%= pkg.name %>.css'
      },
      js : {
        src: ['public/lib/angular.min.js', 'public/lib/ui-bootstrap-tpls-0.11.0.min.js', 'public/lib/jquery.min.js', 'public/lib/bootstrap-3.1.1/js/bootstrap.min.js', 'public/lib/quill.min.js', 'public/lib/ng-grid/ng-grid-2.0.11.min.js', 'public/lib/toastr.min.js', 'public/lib/angular-local-storage.js', 'public/lib/spin.min.js', 'public/lib/ng-grid-flexible-height.js', 'public/js/home.js', 'public/js/serviceRequests.js'],
        dest: 'public/dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        mangle: false,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
        }
      }
    },
    // qunit: {
    //   files: ['public/*.html']
    // },
    jshint: {
      files: ['Gruntfile.js', 'public/js/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          angular: true,
          document: true
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/dist/<%= pkg.name %>.min.css': ['<%= concat.css.dest %>']
        }
      }
    },
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'public/index.html': 'public/views/index.html'     // 'destination': 'source'
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify', 'cssmin', 'htmlmin']);

};