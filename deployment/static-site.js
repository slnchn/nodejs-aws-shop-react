const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const iam = require("@aws-cdk/aws-iam");
const { Construct, Stack } = require("@aws-cdk/core");

class StaticSite extends Construct {
  constructor(parent, name) {
    super(parent, name);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "NodejsAwsShopReactSlnchnOAI"
    );

    const siteBucket = new s3.Bucket(this, "NodejsAwsShopReactSlnchnBucket", {
      bucketName: "nodejs-aws-shop-react-slnchn-bucket",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "NodejsAwsShopReactSlnchnDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: cloudfrontOAI,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    new s3deploy.BucketDeployment(this, "NodejsAwsShopReactSlnchnDeployment", {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}

module.exports = { StaticSite };
