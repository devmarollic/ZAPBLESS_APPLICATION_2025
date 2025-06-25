import * as esbuild from 'esbuild';

await esbuild.build({
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
  target: 'node22',
  format: 'esm'
}).catch(() => process.exit(1)); 