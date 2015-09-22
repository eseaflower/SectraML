module.exports = function(grunt) {  
  grunt.initConfig({
    ts: {
      compile: {
        files: [
          {            
            expand: true,
            flatten: true,
            cwd: "./",
            src: ["./**/*.ts","./**/*.tsx", "!./typings/**/*.ts" ,"!./node_modules/**/*.ts", "!./node_modules/**/*.tsx"],
            dest: "./",            
            rename: function(dest, src) {
              return "sd";
            }
          }
        ],        
		    options:{
          target: "ES5",		    
          module: "commonjs",
          additionalFlags: "--jsx react",
          sourceMap: false,
          compiler: "E:\\Program\\NodeJS\\npm_global\\node_modules\\typescript\\bin\\tsc",
          verbose: true,
          fast: "never"         
        }
      }
    },
    browserify: {
      bundle: {
        files: {
          "bundle.js": ["Main.js"]
        },
      options: {
          require: [["./Main.js", {expose:"main"}]]
        }
      }
    }
    
    
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask("default", ["ts", "browserify"]);
};
