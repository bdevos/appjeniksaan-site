import { serveDir, serveFile } from 'jsr:@std/http/file-server'

Deno.serve((req) =>
  serveDir(req, {
    fsRoot: 'dist',
  }).then((res) => {
    if (res.status === 404) {
      return serveFile(req, 'dist/404.html')
    }
    return res
  }),
)
