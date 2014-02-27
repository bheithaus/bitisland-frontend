includeG = (module) -> 
  require 'gulp-' + module

# Requires
gulp = require 'gulp'
nodemon = require 'nodemon'
jade = includeG 'jade'
coffee = includeG 'coffee'
concat = includeG 'concat'
stylus = includeG 'stylus'

uglify = includeG 'uglify'
gutil = includeG 'util'
concat = includeG 'concat'
rest = require 'unirest'

# Paths
vendor_js = 
  bower:
    base: './bower_components/'
    dependencies: [
      'angular/angular.js'
      'angular-ui-router/release/angular-ui-router.js'
      'angular-cookies/angular-cookies.js'
      'angular-resource/angular-resource.js'

      'jquery/dist/jquery.min.js'
      # 'bootstrap/dist/js/bootstrap.js'
      'lodash/dist/lodash.js'
      'socket.io/socket.io.js"'
    ]

  # third party JS with no bower installer
  vendor:
    base: './public/vendor/'
    dependencies: [
      'highstock.js'
      'ui-bootstrap-tpls-0.10.0.js'
    ]

# prepend base
for namespace, obj of vendor_js
  for lib, i in obj.dependencies
    obj.dependencies[i] = "#{ obj.base }#{ lib }"

client_base = './client/coffeescripts/'
path = 
  scripts: 
    src: {
      client:[
        client_base + 'config/*.coffee'
        client_base + 'library/controllers/*.coffee'
        client_base + 'library/services/*.coffee'
        client_base + 'library/*.coffee'
        client_base + '*.coffee'
      ]
      server: './**.coffee'
    }

    dest: './public/javascripts'

  styles:
    src: 'client/stylesheets/**/*.styl'
    dest: 'public/stylesheets'

# Functions
scripts = () ->
  gulp.src path.scripts.src.client
    .pipe coffee({ bare: true })
    .on 'error', gutil.log 
    .pipe concat 'index.js'
    .pipe gulp.dest(path.scripts.dest)

  gulp.src vendor_js.bower.dependencies.concat vendor_js.vendor.dependencies
    .pipe concat('vendor.js')
    .pipe gulp.dest(path.scripts.dest)

styles = () ->
  console.log 'compiling stylesheets..'
  
  gulp.src path.styles.src
    .pipe stylus({ use: ['nib'] })
    .pipe concat('style.css') 
    .pipe gulp.dest(path.styles.dest)

cdn = () ->
  console.log 'run cdn upload'
  # needs API integration
  # rest.put 'https://storage101.dfw1.clouddrive.com/v1/CF_xer7_343/'
  #   .headers 
  #     "ETag": "805120e285a7ed28f74024422fe3594"
  #     "Content-Type": "image/jpeg"
  #     "X-Auth-Token": "fc81aaa6-98a1-9ab0-94ba-aba9a89aa9ae"
  #     "X-Object-Meta-Screenie": "Hello World"
  #   .attach 'file', 'path/to/file'
  #   .end (data) ->
  #     console.log 'result', data


# Tasks
gulp.task 'scripts', scripts
gulp.task 'styles', styles
gulp.task 'cdn', cdn

gulp.task 'watch', () ->
  gulp.watch path.styles.src, () ->
    styles()

gulp.task 'cdn'


gulp.task 'default', ['scripts', 'styles', 'cdn', 'watch']


# You can minify your Jade Templates here
# 
# gulp.task 'jade', ->
#   gulp.src './views/*.jade'
#     .pipe(jade())
#     .pipe(gulp.dest('./build/minified_templates'))


nodemon(
  script: 'app.coffee'
).on('restart', ->
  scripts()
  styles()
)
