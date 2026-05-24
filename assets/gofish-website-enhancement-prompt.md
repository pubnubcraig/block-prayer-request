Copy this into Claude Code:

```text
Create a detailed implementation plan to enhance the existing free Prayer Request website:
https://block-prayer-request.vercel.app/

Context:
The current website is a simple SPA that provides free prayer request services. :contentReference[oaicite:0]{index=0}

Business goals:
- Keep the core prayer request service free for the masses.
- Monetize through targeted, Christian-community-aligned advertising.
- Add optional donations to keep the service running and growing.
- Leave room for future paid plans with enhanced features.

Monetization model:
1. Targeted ads
   - Ad categories may include Christian books, services, events, weekend retreats, marriage programs, addiction recovery programs, mental health programs, seminary schools, Bible study programs, churches, ministries, Christian counseling, and related services.
   - Ads should feel respectful, non-intrusive, and aligned with the spiritual purpose of the site.
   - 10% of ad revenue should be donated to YouVersion:
     https://help.youversion.com/l/en/article/y48di4dqbu-when-you-give

2. Donations
   - Add a donation flow for visitors who want to support the service.
   - Donation split:
     - 50% to YouVersion
     - 50% to GoFish
   - Clearly explain the split before donation.

Operating costs to support:
- Hosting: Vercel / AWS
- OpenAI token usage
- Continued feature development
- Maintenance and bug fixing
- Customer support
- Accounting
- Administrative staff
- General business operations

Please create a comprehensive product and technical plan that includes:

1. Current-state assessment
   - Review the existing app structure and user flow.
   - Identify where ads and donation calls-to-action can be added without hurting trust or usability.

2. Product strategy
   - Define free core features.
   - Define future paid-plan opportunities.
   - Recommend ethical ad placement rules.
   - Recommend donation messaging and placement.

3. UX/UI plan
   - Design ad placements that are subtle and respectful.
   - Add donation CTAs after meaningful moments, such as after submitting a prayer request.
   - Include copy suggestions for donation messaging.
   - Preserve a clean, prayer-focused experience.

4. Advertising system plan
   - Propose a basic advertiser model.
   - Include advertiser categories, approval workflow, campaign management, targeting options, and reporting.
   - Include a simple admin dashboard concept.
   - Include rules for rejecting inappropriate ads.

5. Donation system plan
   - Recommend donation provider options such as Stripe.
   - Explain how to record donations, calculate the 50/50 split, and generate basic donation reporting.
   - Include transparency messaging for users.

6. Revenue-sharing and reporting
   - Track ad revenue.
   - Calculate 10% ad revenue donation to YouVersion.
   - Track direct donations and split them 50/50.
   - Create admin reports for monthly totals.

7. Technical architecture
   - Recommend database schema changes.
   - Include tables/models for advertisers, ads, campaigns, donations, revenue reports, expenses, and admin users.
   - Include API routes/server actions needed.
   - Include security and privacy considerations.

8. Compliance and trust
   - Add privacy policy updates.
   - Add donation disclosure language.
   - Add advertiser disclosure language.
   - Add financial transparency page recommendation.
   - Avoid implying official partnership with YouVersion unless legally confirmed.

9. Implementation phases
   - Phase 1: donation CTA and donation tracking
   - Phase 2: static/sponsored ad placements
   - Phase 3: advertiser dashboard and campaign management
   - Phase 4: reporting, transparency page, and future paid features

10. Deliverables
   - Prioritized backlog
   - Data model
   - Route/API plan
   - UI component plan
   - Admin dashboard plan
   - Suggested copy
   - Risks and mitigations
   - Testing checklist

Important constraints:
- Keep the service free.
- Keep monetization tasteful and ministry-aligned.
- Do not overload the prayer experience with ads.
- Be transparent about where money goes.
- Make the plan practical for implementation in the existing codebase.
```
