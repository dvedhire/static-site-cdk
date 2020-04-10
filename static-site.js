#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudfront = require("@aws-cdk/aws-cloudfront");
const route53 = require("@aws-cdk/aws-route53");
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const acm = require("@aws-cdk/aws-certificatemanager");
const cdk = require("@aws-cdk/core");
const targets = require("@aws-cdk/aws-route53-targets/lib");
const core_1 = require("@aws-cdk/core");
/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
class StaticSite extends core_1.Construct {
    constructor(parent, name, props) {
        super(parent, name);
        const zone = new route53.HostedZone(this, "Zone", {
            zoneName: props.domainName
        });
        // const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });
        const siteDomain = props.siteSubDomain + '.' + props.domainName;
        new cdk.CfnOutput(this, 'Site', { value: 'https://' + siteDomain });
        // Content bucket
        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            bucketName: siteDomain,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html',
            publicReadAccess: true,
            // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
            // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
            // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });
        // TLS certificate
        const certificateArn = new acm.DnsValidatedCertificate(this, 'SiteCertificate', {
            domainName: siteDomain,
            hostedZone: zone
        }).certificateArn;
        new cdk.CfnOutput(this, 'Certificate', { value: certificateArn });
        // CloudFront distribution that provides HTTPS
        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
            aliasConfiguration: {
                acmCertRef: certificateArn,
                names: [siteDomain],
                sslMethod: cloudfront.SSLMethod.SNI,
                securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
            },
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: siteBucket
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                }
            ]
        });
        new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
        // Route53 alias record for the CloudFront distribution
        new route53.ARecord(this, 'SiteAliasRecord', {
            recordName: siteDomain,
            target: route53.AddressRecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            zone
        });
        // Deploy site contents to S3 bucket
        new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [s3deploy.Source.asset('./site-contents')],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'],
        });
    }
}
exports.StaticSite = StaticSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzREFBdUQ7QUFDdkQsZ0RBQWlEO0FBQ2pELHNDQUF1QztBQUN2Qyx1REFBd0Q7QUFDeEQsdURBQXdEO0FBQ3hELHFDQUFzQztBQUN0Qyw0REFBNkQ7QUFDN0Qsd0NBQTBDO0FBTzFDOzs7OztHQUtHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsZ0JBQVM7SUFDckMsWUFBWSxNQUFpQixFQUFFLElBQVksRUFBRSxLQUFzQjtRQUMvRCxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXBCLE1BQU0sSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQzlDLFFBQVEsRUFBRSxLQUFLLENBQUMsVUFBVTtTQUM3QixDQUFDLENBQUM7UUFFSCw4RkFBOEY7UUFDOUYsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLGFBQWEsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNoRSxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEdBQUcsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUVwRSxpQkFBaUI7UUFDakIsTUFBTSxVQUFVLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDakQsVUFBVSxFQUFFLFVBQVU7WUFDdEIsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLGdCQUFnQixFQUFFLElBQUk7WUFFdEIsZ0dBQWdHO1lBQ2hHLHNHQUFzRztZQUN0RyxxR0FBcUc7WUFDckcsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUMzQyxDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUVwRSxrQkFBa0I7UUFDbEIsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQzVFLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLFVBQVUsRUFBRSxJQUFJO1NBQ25CLENBQUMsQ0FBQyxjQUFjLENBQUM7UUFDbEIsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUVsRSw4Q0FBOEM7UUFDOUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ3BGLGtCQUFrQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsY0FBYztnQkFDMUIsS0FBSyxFQUFFLENBQUUsVUFBVSxDQUFFO2dCQUNyQixTQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHO2dCQUNuQyxjQUFjLEVBQUUsVUFBVSxDQUFDLHNCQUFzQixDQUFDLGFBQWE7YUFDbEU7WUFDRCxhQUFhLEVBQUU7Z0JBQ1g7b0JBQ0ksY0FBYyxFQUFFO3dCQUNaLGNBQWMsRUFBRSxVQUFVO3FCQUM3QjtvQkFDRCxTQUFTLEVBQUcsQ0FBRSxFQUFDLGlCQUFpQixFQUFFLElBQUksRUFBQyxDQUFDO2lCQUMzQzthQUNKO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEtBQUssRUFBRSxZQUFZLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUVsRix1REFBdUQ7UUFDdkQsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN6QyxVQUFVLEVBQUUsVUFBVTtZQUN0QixNQUFNLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6RixJQUFJO1NBQ1AsQ0FBQyxDQUFDO1FBRUgsb0NBQW9DO1FBQ3BDLElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUMxRCxPQUFPLEVBQUUsQ0FBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFFO1lBQ3JELGlCQUFpQixFQUFFLFVBQVU7WUFDN0IsWUFBWTtZQUNaLGlCQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDO1NBQzFCLENBQUMsQ0FBQztJQUNULENBQUM7Q0FDSjtBQW5FRCxnQ0FtRUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgY2xvdWRmcm9udCA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1jbG91ZGZyb250Jyk7XG5pbXBvcnQgcm91dGU1MyA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJyk7XG5pbXBvcnQgczMgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtczMnKTtcbmltcG9ydCBzM2RlcGxveSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1zMy1kZXBsb3ltZW50Jyk7XG5pbXBvcnQgYWNtID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWNlcnRpZmljYXRlbWFuYWdlcicpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NvcmUnKTtcbmltcG9ydCB0YXJnZXRzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXJvdXRlNTMtdGFyZ2V0cy9saWInKTtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRpY1NpdGVQcm9wcyB7XG4gICAgZG9tYWluTmFtZTogc3RyaW5nO1xuICAgIHNpdGVTdWJEb21haW46IHN0cmluZztcbn1cblxuLyoqXG4gKiBTdGF0aWMgc2l0ZSBpbmZyYXN0cnVjdHVyZSwgd2hpY2ggZGVwbG95cyBzaXRlIGNvbnRlbnQgdG8gYW4gUzMgYnVja2V0LlxuICpcbiAqIFRoZSBzaXRlIHJlZGlyZWN0cyBmcm9tIEhUVFAgdG8gSFRUUFMsIHVzaW5nIGEgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24sXG4gKiBSb3V0ZTUzIGFsaWFzIHJlY29yZCwgYW5kIEFDTSBjZXJ0aWZpY2F0ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRpY1NpdGUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogQ29uc3RydWN0LCBuYW1lOiBzdHJpbmcsIHByb3BzOiBTdGF0aWNTaXRlUHJvcHMpIHtcbiAgICAgICAgc3VwZXIocGFyZW50LCBuYW1lKTtcblxuICAgICAgICBjb25zdCB6b25lID0gbmV3IHJvdXRlNTMuSG9zdGVkWm9uZSh0aGlzLCBcIlpvbmVcIiwge1xuICAgICAgICAgICAgem9uZU5hbWU6IHByb3BzLmRvbWFpbk5hbWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY29uc3Qgem9uZSA9IHJvdXRlNTMuSG9zdGVkWm9uZS5mcm9tTG9va3VwKHRoaXMsICdab25lJywgeyBkb21haW5OYW1lOiBwcm9wcy5kb21haW5OYW1lIH0pO1xuICAgICAgICBjb25zdCBzaXRlRG9tYWluID0gcHJvcHMuc2l0ZVN1YkRvbWFpbiArICcuJyArIHByb3BzLmRvbWFpbk5hbWU7XG4gICAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdTaXRlJywgeyB2YWx1ZTogJ2h0dHBzOi8vJyArIHNpdGVEb21haW4gfSk7XG5cbiAgICAgICAgLy8gQ29udGVudCBidWNrZXRcbiAgICAgICAgY29uc3Qgc2l0ZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1NpdGVCdWNrZXQnLCB7XG4gICAgICAgICAgICBidWNrZXROYW1lOiBzaXRlRG9tYWluLFxuICAgICAgICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6ICdpbmRleC5odG1sJyxcbiAgICAgICAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiAnZXJyb3IuaHRtbCcsXG4gICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiB0cnVlLFxuXG4gICAgICAgICAgICAvLyBUaGUgZGVmYXVsdCByZW1vdmFsIHBvbGljeSBpcyBSRVRBSU4sIHdoaWNoIG1lYW5zIHRoYXQgY2RrIGRlc3Ryb3kgd2lsbCBub3QgYXR0ZW1wdCB0byBkZWxldGVcbiAgICAgICAgICAgIC8vIHRoZSBuZXcgYnVja2V0LCBhbmQgaXQgd2lsbCByZW1haW4gaW4geW91ciBhY2NvdW50IHVudGlsIG1hbnVhbGx5IGRlbGV0ZWQuIEJ5IHNldHRpbmcgdGhlIHBvbGljeSB0b1xuICAgICAgICAgICAgLy8gREVTVFJPWSwgY2RrIGRlc3Ryb3kgd2lsbCBhdHRlbXB0IHRvIGRlbGV0ZSB0aGUgYnVja2V0LCBidXQgd2lsbCBlcnJvciBpZiB0aGUgYnVja2V0IGlzIG5vdCBlbXB0eS5cbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIE5PVCByZWNvbW1lbmRlZCBmb3IgcHJvZHVjdGlvbiBjb2RlXG4gICAgICAgIH0pO1xuICAgICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQnVja2V0JywgeyB2YWx1ZTogc2l0ZUJ1Y2tldC5idWNrZXROYW1lIH0pO1xuXG4gICAgICAgIC8vIFRMUyBjZXJ0aWZpY2F0ZVxuICAgICAgICBjb25zdCBjZXJ0aWZpY2F0ZUFybiA9IG5ldyBhY20uRG5zVmFsaWRhdGVkQ2VydGlmaWNhdGUodGhpcywgJ1NpdGVDZXJ0aWZpY2F0ZScsIHtcbiAgICAgICAgICAgIGRvbWFpbk5hbWU6IHNpdGVEb21haW4sXG4gICAgICAgICAgICBob3N0ZWRab25lOiB6b25lXG4gICAgICAgIH0pLmNlcnRpZmljYXRlQXJuO1xuICAgICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQ2VydGlmaWNhdGUnLCB7IHZhbHVlOiBjZXJ0aWZpY2F0ZUFybiB9KTtcblxuICAgICAgICAvLyBDbG91ZEZyb250IGRpc3RyaWJ1dGlvbiB0aGF0IHByb3ZpZGVzIEhUVFBTXG4gICAgICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24odGhpcywgJ1NpdGVEaXN0cmlidXRpb24nLCB7XG4gICAgICAgICAgICBhbGlhc0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgICBhY21DZXJ0UmVmOiBjZXJ0aWZpY2F0ZUFybixcbiAgICAgICAgICAgICAgICBuYW1lczogWyBzaXRlRG9tYWluIF0sXG4gICAgICAgICAgICAgICAgc3NsTWV0aG9kOiBjbG91ZGZyb250LlNTTE1ldGhvZC5TTkksXG4gICAgICAgICAgICAgICAgc2VjdXJpdHlQb2xpY3k6IGNsb3VkZnJvbnQuU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMV8yMDE2LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzM0J1Y2tldFNvdXJjZTogc2l0ZUJ1Y2tldFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcnMgOiBbIHtpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZX1dLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdEaXN0cmlidXRpb25JZCcsIHsgdmFsdWU6IGRpc3RyaWJ1dGlvbi5kaXN0cmlidXRpb25JZCB9KTtcblxuICAgICAgICAvLyBSb3V0ZTUzIGFsaWFzIHJlY29yZCBmb3IgdGhlIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uXG4gICAgICAgIG5ldyByb3V0ZTUzLkFSZWNvcmQodGhpcywgJ1NpdGVBbGlhc1JlY29yZCcsIHtcbiAgICAgICAgICAgIHJlY29yZE5hbWU6IHNpdGVEb21haW4sXG4gICAgICAgICAgICB0YXJnZXQ6IHJvdXRlNTMuQWRkcmVzc1JlY29yZFRhcmdldC5mcm9tQWxpYXMobmV3IHRhcmdldHMuQ2xvdWRGcm9udFRhcmdldChkaXN0cmlidXRpb24pKSxcbiAgICAgICAgICAgIHpvbmVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGVwbG95IHNpdGUgY29udGVudHMgdG8gUzMgYnVja2V0XG4gICAgICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdEZXBsb3lXaXRoSW52YWxpZGF0aW9uJywge1xuICAgICAgICAgICAgc291cmNlczogWyBzM2RlcGxveS5Tb3VyY2UuYXNzZXQoJy4vc2l0ZS1jb250ZW50cycpIF0sXG4gICAgICAgICAgICBkZXN0aW5hdGlvbkJ1Y2tldDogc2l0ZUJ1Y2tldCxcbiAgICAgICAgICAgIGRpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgIGRpc3RyaWJ1dGlvblBhdGhzOiBbJy8qJ10sXG4gICAgICAgICAgfSk7XG4gICAgfVxufVxuIl19