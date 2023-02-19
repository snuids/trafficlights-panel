module.exports = (grunt) => {
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({

    clean: ['dist'],

    copy: {
      src_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.js', '!**/*.scss', '!img/**/*'],
        dest: 'dist'
      },
      pluginDef: {
        expand: true,
        src: ['plugin.json', 'README.md','LICENSE'],
        dest: 'dist',
      },
      img_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['img/**/*'],
        dest: 'dist/src/'
      }
    },

    watch: {
      rebuild_all: {
        files: ['src/**/*', 'plugin.json'],
        tasks: ['default'],
        options: {spawn: false}
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
        plugins: ['transform-es2015-modules-systemjs', 'transform-es2015-for-of'],
      },
      dist: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['*.js'],
          dest: 'dist',
          ext: '.js'
        }]
      },
    },
    
    shell: {      
      deletezip: 'rm *.zip',      
      duplicate: 'cp -r dist snuids-trafficlights-panel',
      exportversion: 'export zipversion2=`cat src/plugin.json | grep "version" | cut -d \':\' -f2 | cut -d \'"\' -f2`',
      createzip: 'zip -r snuids-trafficlights-panel-v${zipversion2}.zip snuids-trafficlights-panel',
      deletetarget: 'rm -r snuids-trafficlights-panel'
    }

  });

  grunt.registerTask('default', ['clean','shell:deletezip','shell:deletetarget', 'copy:src_to_dist', 'copy:pluginDef'
      , 'copy:img_to_dist', 'babel','shell:exportversion','shell:duplicate','shell:createzip','shell:deletetarget']);
};
