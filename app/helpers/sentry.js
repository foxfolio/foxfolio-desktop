/* eslint-disable import/extensions */
// @flow
import Raven from 'raven-js';

export function configureSentry() {
  if (process.env.SENTRY_DSN) {
    Raven.config(process.env.SENTRY_DSN, {
      release: process.env.RELEASE_HASH || '',
      dataCallback(data) {
        const normalizedData = data;
        if (normalizedData.culprit) {
          normalizedData.culprit = '/renderer.prod.js';
        }

        const stacktrace =
          normalizedData.stacktrace || (normalizedData.exception && normalizedData.exception.values[0].stacktrace);
        if (stacktrace) {
          stacktrace.frames = stacktrace.frames.map(frame => ({ ...frame, filename: '/renderer.prod.js', }));
        }

        return data;
      },
    }).install();
  }
}

export function getRaven() {
  return Raven;
}
