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
    }
    
    
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask("default", ["ts", "browserify"]);
};
