# server.py
import http.server
import os
import urllib.parse

PORT = 4000
HOST = "localhost"
INDEXFILE = 'index.html'

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        url = urllib.parse.urlparse(self.path)

        if os.access('.' + os.sep + url.path, os.R_OK):
            http.server.SimpleHTTPRequestHandler.do_GET(self)
        else:
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')  
            self.end_headers()
            with open(INDEXFILE, 'rb') as fin:
                self.copyfile(fin, self.wfile)

    
# Start the server
with http.server.HTTPServer((HOST, PORT), Handler) as httpd:
    print(f"Serving at http://{HOST}:{PORT}")
    httpd.serve_forever()
