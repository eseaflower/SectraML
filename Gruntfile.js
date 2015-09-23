module.exports = function(grunt) {  
  grunt.initConfig({
    ts: {
      compile: {
        files: [
          {            
            src: ["./**/*.ts","./**/*.tsx", "!./typings/**/*.ts" ,"!./node_modules/**/*.ts", "!./node_modules/**/*.tsx"]
          }
        ],        
		    options:{
          target: "ES5",		    
          module: "commonjs",
          additionalFlags: "--jsx react",
          sourceMap: false,
          compiler: "node_modules/typescript/bin/tsc",
          verbose: true,
          fast: "never"         
        }
      }
    },
    browserify: {
      bundle: {
        files: {
          "dist/bundle.js": ["components/Main.js"]
        },
      options: {
          require: ["./components/Main.js:main"]
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            src: "node_modules/bootstrap/dist/css/*.min.css",
            dest: "dist/css/",
            flatten: true
          },
          {
            expand: true,
            src: "node_modules/bootstrap/dist/js/*.min.js",
            dest: "dist/js/",
            flatten: true
          },
          {
            expand: true,
            src: "node_modules/jquery/dist/*.min.js",
            dest: "dist/js/",
            flatten: true                        
          }            
        ]
      }      
    }
    
    
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-copy")
  grunt.registerTask("default", ["ts", "browserify", "copy"]);
};
