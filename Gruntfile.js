/*global module:false*/
module.exports = function(grunt) {
  // Load grunt tasks automatically.
  require('load-grunt-tasks')(grunt);
  // Time how long tasks take.
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    
    // Project settings.
    config: {
        // Configurable paths.
        src: '.',
        build: 'build',
        dist: 'dist'
    },

    // Task configuration.
    clean: ['<%= config.dist %>/*', '<%= config.build %>/*'],
    
    // Checking JS, CSS, HTML for errors.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: '<%= config.src %>/Gruntfile.js'
      },
      dev: {
        src: ['<%= config.src %>/js/*.js']
      },
      dist: {
        src: ['<%= config.dist %>/js/**/*.js']
      }
    },
    csslint: {
      dist: {
        src: ['<%= config.dist %>/css/*.css']
      },
      dev: {
        options: {
          csslintrc: '.csslintrc'
        },
        src: ['<%= config.src %>/css/*.css']
      }
    },
    htmlhint: {
      dist: {
          options: {
              'tag-pair': true,
              'tagname-lowercase': true,
              'attr-lowercase': true,
              'attr-value-double-quotes': true,
              'doctype-first': true,
              'spec-char-escape': true,
              'id-unique': true,
              'head-script-disabled': true,
              'style-disabled': true,
              'img-alt-require': true,
              'doctype-html5': true,
              'attr-unsafe-chars': true
          },
          src: ['<%= config.dist %>/**/*.html']
      },
      dev: {
          options: {
              'tag-pair': true,
              'tagname-lowercase': true,
              'attr-lowercase': true,
              'attr-value-double-quotes': true,
              'doctype-first': true,
              'spec-char-escape': true,
              'id-unique': true,
              'head-script-disabled': true,
              'style-disabled': true,
              'img-alt-require': true,
              'doctype-html5': true,
              'attr-unsafe-chars': true
          },
          src: ['<%= config.src %>/**/*.html', '!<%= config.build %>/**', 
            '!<%= config.dist %>/**', '!<%= config.src %>/node_modules/**']
      }
    },

    // Processing images.
    imagemin: {
      build: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'img/',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'build/img'              // Destination path prefix
        }]
      },
    },

    // Processing CSS, JS, HTML.
    useminPrepare: {
      html: ['*.html', '!build/**', '!dist/**', '!node_modules/**'],
      options: {
        dest: 'build/',
        staging: 'build/.tmp'
      }
    },
    usemin: {
      html: ['build/**/*.html']
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,              // Enable dynamic expansion
          cwd: 'build/',             // Src matches are relative to this path
          src: ['**/*.html'],        // Actual patterns to match; should be taken from output of usemin
          dest: 'dist/'              // Destination path prefix
        }]
      }
    },

    // Building for distribution.
    copy: {
      build: {
        files: [{
          expand: true, 
          cwd: '<%= config.src %>/', 
          src: ['<%= config.src %>/**/*.html',
           '!<%= config.build %>/**', 
            '!<%= config.dist %>/**', '!<%= config.src %>/node_modules/**'], 
          dest: '<%= config.build %>/'
        }]
      },
      dist: {
        files: [
          {
            expand: true, 
            src: ['<%= config.src %>/_config.yml'], 
            dest: '<%= config.dist %>/', 
            filter: 'isFile'
          },
          {
            expand: true, 
            cwd: '<%= config.build %>/', 
            src: ['img/**'], 
            dest: '<%= config.dist %>/'
          },
          {
            expand: true,
            cwd: '<%= config.build %>/', 
            src: ['css/**'], 
            dest: '<%= config.dist %>/'
          },
          {
            expand: true, 
            cwd: '<%= config.build %>/', 
            src: ['js/**'], 
            dest: '<%= config.dist %>/'
          }
        ]
      }
    },

    // Other
    connect: {
      server: {
        options: {
          port: 8000,
          base: '<%= config.dist %>',
          keepalive: true
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 
    [
      // Preparing.
      'newer:imagemin', 
      'newer:useminPrepare',
      'newer:concat', 'newer:uglify', 'newer:cssmin', 
      'newer:copy:build',
      'newer:usemin',
      // Building dist.
      'newer:copy:dist',
      'newer:htmlmin:dist', 
      'connect:server'
      // 'newer:jshint:dist',
      // 'newer:csslint:dist',
      // 'newer:htmlhint:dist',
      // Deploying.
      // TBD
    ]
  );
  // Cleanup build and dist folders.
  grunt.registerTask('cleanup', ['clean']);
  // Check sources.
  grunt.registerTask('check', ['jshint:dev', 'csslint:dev', 'htmlhint:dev']);

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
        'connect:server',
        // 'connect:livereload',
        // 'watch'
        ]);
    });
};
