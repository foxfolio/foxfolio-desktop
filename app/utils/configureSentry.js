const Raven = require('raven-js');

export function configureSentry() {
  if (process.env.SENTRY_URL) {
    Raven.config(process.env.SENTRY_URL, {
      release: process.env.RELEASE,
    }).install();
  }
}
