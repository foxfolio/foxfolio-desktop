import Raven from 'raven-js';

export function configureSentry() {
  if (process.env.SENTRY_DSN) {
    Raven.config(process.env.SENTRY_DSN, {
      release: `v${process.env.VERSION || ''}`,
      dataCallback(data) {
        const normalizedData = data;
        if (normalizedData.culprit) {
          normalizedData.culprit = '/renderer.prod.js';
        }

        const stacktrace =
          normalizedData.stacktrace ||
          (normalizedData.exception && normalizedData.exception.values[0].stacktrace);
        if (stacktrace) {
          stacktrace.frames = stacktrace.frames.map((frame: object) => ({
            ...frame,
            filename: '/renderer.prod.js',
          }));
        }

        return data;
      },
    }).install();
  }
}

export function getRaven() {
  return Raven;
}
