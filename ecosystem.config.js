module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : "APP",
      script    : "./bin/www",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV: "production",
        PORT: "3001"
      }
    },

    // Second application
    {
      name      : "GATEWAY",
      script    : "./bin/www",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV: "production",
        PORT: "4001"
      }
    },

  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : "pi",
      host : "172.17.60.148",
      ref  : "origin/master",
      repo : "https://github.com/gjz22cn/cloud_server.git",
      path : "/home/pi/www/production",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env production"
    },
    dev : {
      user : "pi",
      host : "172.17.60.148",
      ref  : "origin/master",
      repo : "https://github.com/gjz22cn/cloud_server.git",
      path : "/home/pi/www/development",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env dev",
      env  : {
        NODE_ENV: "dev"
      }
    }
  }
}
