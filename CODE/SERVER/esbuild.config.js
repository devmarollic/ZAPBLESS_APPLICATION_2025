const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  sourcemap: true,
  external: [
    'fluent-ffmpeg',
    'ffmpeg-static',
    'whatsapp-web.js',
    'qrcode-terminal',
    'socket.io',
    'fastify',
    '@fastify/*',
    'jsonwebtoken',
    'pagarme',
    'senselogic-gist',
    'zod',
    '@supabase/*'
  ],
  target: 'node18'
}).catch(() => process.exit(1)); 