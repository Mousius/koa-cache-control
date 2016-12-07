module.exports = function (defaults) {
  return function cacheControl(ctx, next) {
    return next().then(function () {
      var options = ctx.cacheControl || defaults || {};
      var cacheControl = [];

      if (options.private) {
        cacheControl.push('private');
      } else if (options.public) {
        cacheControl.push('public');
      }

      if (options.noStore) {
        options.noCache = true;
        cacheControl.push('no-store');
      }

      if (options.noCache) {
        options.maxAge = 0;
        delete options.sMaxAge;
        cacheControl.push('no-cache');
      }

      if (options.noTransform) {
        cacheControl.push('no-transform');
      }

      if (options.proxyRevalidate) {
        cacheControl.push('proxy-revalidate');
      }

      if (options.mustRevalidate) {
        cacheControl.push('must-revalidate');
      } else if (!options.noCache) {
        if (options.staleIfError) {
          cacheControl.push(`stale-if-error=${options.staleIfError}`);
        }

        if (options.staleWhileRevalidate) {
          cacheControl.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
        }
      }

      if (Number.isInteger(options.maxAge)) {
        cacheControl.push(`max-age=${options.maxAge}`);
      }

      if (Number.isInteger(options.sMaxAge)) {
        cacheControl.push(`s-maxage=${options.sMaxAge}`);
      }

      if (cacheControl.length) {
        ctx.set('Cache-Control', cacheControl.join(','));
      }
    });
  }
}
