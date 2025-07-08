import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  sourcemap: true,
  external: [
    // Node.js built-in modules
    'tty',
    'puppeteer',
    'html-pdf-node',
    'fs',
    'path',
    'events',
    'stream',
    'util',
    'url',
    'net',
    'tls',
    'crypto',
    'dns',
    'http',
    'https',
    'os',
    'zlib',
    'buffer',
    'string_decoder',
    'querystring',
    // Third-party modules
    'fluent-ffmpeg',
    'ffmpeg-static',
    'socket.io',
    'fastify',
    '@fastify/*',
    'jsonwebtoken',
    'pagarme',
    'senselogic-gist',
    'zod',
    '@supabase/*',
    'dotenv',
    'nodemailer'
  ],
  target: 'node22',
  format: 'esm'
}).catch(() => process.exit(1)); 