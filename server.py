#!/usr/bin/env python3
"""
Plain HTTP server for Wireshark credential-capture demo.

Usage:
    python3 server.py [port]          # default port 8080

Open http://localhost:8080/login.html in a browser, submit the form,
then inspect the captured HTTP POST in Wireshark to see credentials
transmitted in plaintext.

Wireshark filter to isolate the traffic:
    tcp.port == 8080 && http

Look for a POST /login packet; follow the TCP stream to read the body:
    username=<value>&password=<value>
"""

import http.server
import urllib.parse
import sys
import os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
ROOT = os.path.dirname(os.path.abspath(__file__))


class LoginHandler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_POST(self):
        if self.path != "/login":
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode()
        params = urllib.parse.parse_qs(body)

        username = params.get("username", [""])[0]
        password = params.get("password", [""])[0]

        # Print to server console so you can see the captured data server-side too
        print(f"\n[LOGIN ATTEMPT]  username={username!r}  password={password!r}\n")

        # Respond with a simple page
        response = f"""\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Login received</title>
  <link rel="stylesheet" href="/css/styles.css"/>
  <style>
    body{{display:flex;align-items:center;justify-content:center;min-height:100vh;}}
    .box{{background:#fff;border:1px solid rgba(60,74,90,.12);border-radius:14px;
          box-shadow:0 8px 40px rgba(60,74,90,.14);padding:3rem 2.5rem;
          max-width:420px;text-align:center;}}
    h2{{font-family:'Cormorant Garamond',serif;color:#3C4A5A;font-size:2rem;margin-bottom:1rem;}}
    p{{color:#4E5E70;margin-bottom:.5rem;}}
    .creds{{background:rgba(229,154,60,.08);border-left:3px solid #E59A3C;
            border-radius:4px;padding:.75rem 1rem;text-align:left;
            font-family:monospace;font-size:.9rem;margin:1.5rem 0;}}
    a{{color:#E59A3C;font-weight:600;}}
  </style>
</head>
<body>
  <div class="box">
    <h2>Credentials received</h2>
    <p>The server received your POST over plain HTTP.</p>
    <p>Wireshark can see the same data in the packet capture.</p>
    <div class="creds">
      username: <strong>{username}</strong><br/>
      password: <strong>{password}</strong>
    </div>
    <a href="/login.html">← Try again</a>
  </div>
</body>
</html>""".encode()

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(response)))
        self.end_headers()
        self.wfile.write(response)

    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} — {fmt % args}")


if __name__ == "__main__":
    server = http.server.HTTPServer(("0.0.0.0", PORT), LoginHandler)
    print(f"HTTP server running on http://0.0.0.0:{PORT}")
    print(f"  Login page : http://localhost:{PORT}/login.html")
    print(f"  Wireshark  : tcp.port == {PORT} && http")
    print("Press Ctrl-C to stop.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
