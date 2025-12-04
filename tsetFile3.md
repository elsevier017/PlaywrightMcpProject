You are a senior software engineer tasked with building a Playwright custom reporter named “SlackTeamsReporter” that automatically posts test results to Slack or Microsoft Teams. The reporter should collect test results during the run and, at the end, post a concise summary plus detailed failures and optional screenshots to either Slack or Teams depending on configuration. Follow the requirements below.

Goals

Automatically send Playwright test results (summary + failures + optional screenshots) to Slack or Microsoft Teams using a single, reusable custom reporter.
Support both Slack (via Webhook for simple messages and via Bot Token for uploading screenshots) and Teams (via Teams Webhook using a MessageCard).
Architecture

Flow: Playwright test suite → Custom Reporter → Build Summary → Post to Slack or Teams
Reporter should expose hooks: onBegin, onTestEnd, onEnd
Minimal reporter pattern: onTestEnd collects results; onEnd builds a summary and posts it
Key Reporter Hooks

onBegin: initialize state (start time, empty results container, config)
onTestEnd: capture each test’s result (name, status, duration, error message, optional screenshot path/URL)
onEnd: compute summary (Total, Passed, Failed, Skipped, Flaky, Duration, Top Failures, CI link, Screenshot links) and post to the configured destination
Data Model (for internal use)

TestResult:
title: string
status: 'passed' | 'failed' | 'skipped' | 'flaky'
durationMs: number
error?: string
screenshotPath?: string
screenshotUrl?: string (after upload, if applicable)
Summary:
total: number
passed: number
failed: number
skipped: number
flaky: number
durationMs: number
topFailures: Array<{ title: string; count: number; lastError?: string }>
ciLink?: string
screenshotLinks?: string[] (or mapping test title -> URL)
Slack and Teams integration details

Slack
Simple webhook: Slack Webhook URL, send a JSON payload with a concise message and a structured summary. No file uploads required.
Bot token path: Slack Bot Token allows uploading screenshots via chat.postMessage with files or files.upload, then include image URLs in the summary. Implement URL references to uploaded screenshots in the message.
Teams
Use a Teams Webhook URL and send a MessageCard payload (cards-based message) with sections for Summary, Failures, and Links. Include test results and optional screenshot links.
Summary to include

Total, Passed, Failed, Skipped, Flaky, Duration
Top Failures (grouped by test title with counts)
CI link (if available)
Screenshot links (if available)
Best Practices

Post only on the main branch to avoid noise; allow a toggle to disable on non-main branches.
Keep messages short and focused; summarize failures and provide quick links to details.
Use environment variables for secrets (SLACK_WEBHOOK, SLACK_BOT_TOKEN, TEAMS_WEBHOOK, CI_LINK).
Implement retry logic for transient network errors with exponential backoff.
Sanitize and truncate long error messages to fit message size limits.
Avoid leaking sensitive data in summaries or failure details.
Keep the reporter stateless across runs as much as possible; persist only as needed (e.g., in-memory per run, optional small cache).
Config and Usage

Provide a minimal usage example compatible with your Playwright config.
Suggested config snippet (as an array, matching your example style): [ ['list'], ['./reporters/slack-reporter.ts', { slackWebhookUrl: SLACK_WEBHOOK, teamsWebhookUrl: TEAMS_WEBHOOK, useBotToken: false, ciLink: process.env.CI_LINK, environment: process.env.ENV }] ]
Optional: a two-reporter setup to choose between Slack and Teams at runtime via config:
reporter: ['./reporters/slack-teams-reporter.ts', { target: 'slack', slackWebhookUrl: ..., teamsWebhookUrl: ... }]
or switch via environment variable REPORTER_TARGET=slack|teams
Build and Deliverables

A complete TypeScript Playwright reporter with:
Class SlackTeamsReporter that implements the Playwright Reporter interface
Internal data structures for TestResult and Summary
Helper utilities for:
Formatting short, readable messages
Uploading screenshots to Slack (optional, via bot token)
Building Slack Block Kit payloads or Teams MessageCard payloads
Posting with retry/backoff
Configuration-driven behavior (which platform to post to, webhook URLs or tokens)
Clear logging for debugging
Optional: small utility to extract top failures from results
Documentation/comments in code explaining:
How to configure environment variables
How to enable/disable screenshot uploads
How the summary is constructed
Known limits and troubleshooting tips
Troubleshooting and Troubleshooting Hints

Slack 400 = JSON issue: verify payload structure and required fields for the chosen webhook path.
Teams card invalid = schema issue: ensure the MessageCard payload conforms to Teams expectations (sections, potential potential fields).
No files = need bot token: if you rely on screenshot uploads, ensure a valid Slack Bot Token and correct scopes; otherwise skip uploads.
Network errors: implement a retry with exponential backoff; log failures if after max retries the post still fails.
Add-Ons (optional enhancements)

Screenshot upload: upload test failure screenshots to Slack (or a shared storage) and include links in the summary.
Threading: post results as a thread in Slack to avoid clutter.
CI re-run button: include a link or button to re-run tests in CI from the post.
Flaky report: detect flaky tests and surface them distinctly in the summary.
Build Steps (high-level)

Push reporter code to your repository
Create Slack/Teams webhooks and/or bot tokens
Add environment variables to CI secrets
Update Playwright config to load and use the reporter
Run tests in CI; verify that the reporter posts a summary with links and screenshots as configured
Iterate on formatting, thresholds, and top-failures thresholds based on feedback
Acceptance Criteria

The reporter collects per-test results via onTestEnd and posts a final summary via onEnd
The summary includes all requested fields and links
Screenshots upload correctly when configured, with links included in the message
Slack and Teams posting work as configured, with fallback behavior and clear error messages when misconfigured
The solution is maintainable, well-documented, and uses environment variables for secrets