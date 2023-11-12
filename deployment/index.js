const cdk = require("@aws-cdk/core");

const { StaticSite } = require("./static-site");

class MyStaticSiteStack extends cdk.Stack {
  constructor(parent, name) {
    super(parent, name);

    new StaticSite(this, name);
  }
}

const app = new cdk.App();

new MyStaticSiteStack(app, "NodejsAwsShopReactSlnchnStack1");

app.synth();
