import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

const IT_REVIEW_MARKDOWN = String.raw`
## Technical Architecture

### Platform
Web application with PWA support, and a native mobile app for iOS and Android.

### Technology stack
End-to-end TypeScript Monorepo. [Nextjs](https://nextjs.org/) app for web, [Expo/React Native](https://expo.dev/) for mobile, including [Expo Application Services (EAS)](https://expo.dev/eas) for iOS and Android app-store delivery. [Convex](https://www.convex.dev/) for backend/database.

### Hosting
The web application runs on [Vercel](https://vercel.com/) and the backend and database run on [Convex cloud](https://www.convex.dev). The mobile application is built and delivered through [Expo Application Services (EAS)](https://expo.dev/eas) for the Apple App Store and Google Play. Vercel and Convex both use AWS-backed infrastructure. Recommended deployment regions are AWS \`us-east-1\` and \`eu-west-1\`, with the application tier and data tier placed in the same geography to keep latency low.

### Scalability
Convex does not frame capacity in terms of named users. It measures backend capacity in terms of function executions, including concurrent queries and mutations. In that model, 500-1000 users is a modest planning case rather than an upper boundary. Capacity can be increased further on higher service tiers if the workload profile requires it.

[Convex function execution limits](https://docs.convex.dev/production/state/limits#concurrent-function-executions)

### API availability
Yes. [Convex HTTP Actions](https://docs.convex.dev/functions/http-actions) allow external integrations, webhooks, and API-style endpoints to be exposed later. This is the planned mechanism for the future Factorial HR integration, and it also keeps the door open for other internal systems afterward.

## Security

### Authentication and SSO
Authentication is planned through WorkOS. Standard authentication is supported, and Single Sign-On can be enabled for enterprise identity providers when required. Although SSO was not part of the initial plan, it can be included without additional development cost. The additional vendor cost for SSO is [\$125 / month for a typical single-client setup](https://workos.com/pricing), with volume discounts available if that model changes later.

### User access control
The application includes role-based access control with support for Admin, Manager, and Trainee roles. Multiple roles can be assigned to the same user where required, for example a manager who is also enrolled as a trainee for specific modules. Access can also be scoped across one or more restaurant locations through the CMS / web application, for example where one person oversees multiple restaurants.

### Data security and compliance
Traffic is served over HTTPS in transit. All data stored in Convex is encrypted at rest. Security and compliance details for the underlying platforms are documented by Convex and Vercel in the references below.

[Convex security](https://www.convex.dev/security)  
[Vercel security and compliance](https://vercel.com/docs/security/compliance)

### Security testing
Managed platform security is covered by Vercel and Convex for their underlying infrastructure. Application-specific penetration testing and vulnerability scanning are not included by default in the current scope, but can be added as a separate paid security workstream if required by the client IT or compliance process.

### Backups
Convex supports periodic daily and weekly backups. Daily backups are stored for 7 days and weekly backups are stored for 14 days. Backup scope covers stored table data and can include file storage.

### Disaster recovery
Recovery is based on redeploying the application from the GitHub repository to Vercel and restoring the backend from a known-good Convex backup if required. For a standard application failure scenario, a reasonable recovery target is within a few hours, and typically the same business day, depending on the nature of the incident and whether data restore is required. This assumes normal availability of the underlying managed platforms and AWS infrastructure; a broader regional cloud incident would depend on provider recovery timelines.

## Ownership & Intellectual Property

### Source code ownership
Upon full payment, the client receives the full application source code and the right to use and maintain it for internal business purposes. Reusable Provider Materials remain the service provider's property, with a perpetual, worldwide, non-exclusive, royalty-free licence for the client to use them as incorporated in the application for its internal business purposes and operation.

### Full source code access
Yes. The client will receive the full project source code and can appoint any developer or agency to maintain it. The licence is for the client's own internal use and operation of the application, not for resale or commercial distribution outside the client organization.

### Maintainability if developer changes
Yes. Another developer or agency can maintain the application after handover. Developer sourcing is straightforward because the application is built on widely adopted modern technologies such as React and TypeScript, and widely used frameworks such as Next.js, Expo, and Convex.

### Third-party software and services
Open-source and commercial third-party materials remain licensed under their own applicable licences or terms of service and are not transferred as client-owned IP. Where the application depends on paid third-party services, the service provider provisions and maintains those subscriptions as part of infrastructure costs unless otherwise stated in the commercial appendices.

## Maintenance

### Who maintains the system
Day-to-day maintenance can be provided by [SBKL Limited](https://www.sbkl.ltd) as part of the ongoing monthly cost shown in the Quote section, or transitioned to the client team / another vendor after handover.

### What happens if there is a bug
Bug fixing, support, and ongoing updates sit under the maintenance arrangement rather than the one-time project delivery scope.

### SLA for support
Support terms and SLA should be agreed as part of the ongoing maintenance arrangement. In practice, urgent production issues would be handled first, typically with same-business-day response, followed by high-priority issues on the next business day, with lower-priority fixes scheduled accordingly. The quote section separates one-time project cost from ongoing monthly cost for maintenance and support.

## Cost Structure Justification

Please refer to the Quote section. It provides a reasonable cost range based on the current understanding of the application scope and expected variation in third-party service usage, and it is not expected to go beyond that range under the current assumptions. A more detailed cost breakdown can be provided once the application design is finalized.

## Performance

### Simultaneous access
Please refer to the Scalability section above. Platform capacity is measured in terms of backend function executions rather than named users, and 500-1000 users is a modest planning case rather than an upper boundary.

## Further Expansion

### New restaurants
Yes. The architecture is suitable for multi-restaurant rollout provided tenant, location, and permissions models are designed correctly from the start.

### Future AI assistant
The application can support a defined set of AI agents as part of the overall product design, with scope to customize their behaviour and answers. However, each agent is tied to specific workflows, responsibilities, and underlying data structures, so introducing entirely new agents would require additional development.

### Future VR training modules
Potentially yes, but that would be a separate product capability with additional UX, device, and content requirements. The current architecture does not block future expansion, but VR is outside the current application scope.

## Documentation Required

### Architecture and system documentation
Documentation can be provided upon app completion. This can include architecture notes, schema overview where relevant, API notes where relevant, deployment notes, and concise handover guidance.
`;

type ItReviewPageProps = {
  className?: string;
};

export function ItReviewPage({ className }: ItReviewPageProps) {
  return (
    <section className={cn("mx-auto w-full max-w-7xl space-y-4", className)}>
      <div className="rounded-[12px] border border-border/70 bg-[radial-gradient(circle_at_top,oklch(0.97_0.02_32),transparent_50%),radial-gradient(circle_at_top_right,oklch(0.6489_0.1708_28.21/0.1),transparent_45%),linear-gradient(oklch(0.99_0.004_95),oklch(0.97_0.012_80))] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          IT Review Q&amp;A
        </p>
        <h2 className="mt-2 text-xl sm:text-2xl">IT questions and answers.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Answers to the main architecture, security, operations, and ownership
          questions.
        </p>

        <div className="mt-6 border border-border/70 bg-background/82 p-5 sm:p-6">
          <article className="mx-auto max-w-4xl">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h3 className="mt-8 border-b border-border/70 pb-2.5 text-xl leading-tight first:mt-0">
                    {children}
                  </h3>
                ),
                h3: ({ children }) => (
                  <h4 className="mt-4 text-base font-medium leading-snug text-foreground">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="mt-1.5 text-sm leading-7 text-muted-foreground sm:text-[15px]">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mt-2.5 list-disc space-y-1.5 pl-6 text-sm leading-7 text-muted-foreground sm:text-[15px]">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mt-2.5 list-decimal space-y-1.5 pl-6 text-sm leading-7 text-muted-foreground sm:text-[15px]">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li>{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-medium text-foreground">
                    {children}
                  </strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-sm text-muted-foreground underline decoration-border underline-offset-2"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-6 border-border/70" />,
                code: ({ children }) => (
                  <code className="rounded-sm bg-muted/45 px-1.5 py-0.5 text-[0.92em] text-foreground">
                    {children}
                  </code>
                ),
              }}
            >
              {IT_REVIEW_MARKDOWN}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </section>
  );
}
