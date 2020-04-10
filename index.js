#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const static_site_1 = require("./static-site");
/**
 * This stack relies on getting the domain name from CDK context.
 * Use 'cdk synth -c domain=mystaticsite.com -c subdomain=www'
 * Or add the following to cdk.json:
 * {
 *   "context": {
 *     "domain": "mystaticsite.com",
 *     "subdomain": "www"
 *   }
 * }
**/
class MyStaticSiteStack extends cdk.Stack {
    constructor(parent, name) {
        super(parent, name);
        new static_site_1.StaticSite(this, 'StaticSite', {
            domainName: this.node.tryGetContext('domain'),
            siteSubDomain: this.node.tryGetContext('subdomain'),
        });
    }
}
const app = new cdk.App();
new MyStaticSiteStack(app, 'MyStaticSite');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBc0M7QUFDdEMsK0NBQTJDO0FBRTNDOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3JDLFlBQVksTUFBZSxFQUFFLElBQVk7UUFDckMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVwQixJQUFJLHdCQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUMvQixVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO1lBQzdDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7U0FDdEQsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztDQUNIO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFFM0MsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NvcmUnKTtcbmltcG9ydCB7IFN0YXRpY1NpdGUgfSBmcm9tICcuL3N0YXRpYy1zaXRlJztcblxuLyoqXG4gKiBUaGlzIHN0YWNrIHJlbGllcyBvbiBnZXR0aW5nIHRoZSBkb21haW4gbmFtZSBmcm9tIENESyBjb250ZXh0LlxuICogVXNlICdjZGsgc3ludGggLWMgZG9tYWluPW15c3RhdGljc2l0ZS5jb20gLWMgc3ViZG9tYWluPXd3dydcbiAqIE9yIGFkZCB0aGUgZm9sbG93aW5nIHRvIGNkay5qc29uOlxuICoge1xuICogICBcImNvbnRleHRcIjoge1xuICogICAgIFwiZG9tYWluXCI6IFwibXlzdGF0aWNzaXRlLmNvbVwiLFxuICogICAgIFwic3ViZG9tYWluXCI6IFwid3d3XCJcbiAqICAgfVxuICogfVxuKiovXG5jbGFzcyBNeVN0YXRpY1NpdGVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgY29uc3RydWN0b3IocGFyZW50OiBjZGsuQXBwLCBuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIocGFyZW50LCBuYW1lKTtcblxuICAgICAgICBuZXcgU3RhdGljU2l0ZSh0aGlzLCAnU3RhdGljU2l0ZScsIHtcbiAgICAgICAgICAgIGRvbWFpbk5hbWU6IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdkb21haW4nKSxcbiAgICAgICAgICAgIHNpdGVTdWJEb21haW46IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdzdWJkb21haW4nKSxcbiAgICAgICAgfSk7XG4gICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbm5ldyBNeVN0YXRpY1NpdGVTdGFjayhhcHAsICdNeVN0YXRpY1NpdGUnKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=