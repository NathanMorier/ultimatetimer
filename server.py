#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
from pathlib import Path

# Configuration
PORT = 8080
DIRECTORY = "build" if os.path.exists("build") else "public"

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    # Check if build directory exists, if not, create a simple index.html
    if not os.path.exists(DIRECTORY):
        os.makedirs(DIRECTORY, exist_ok=True)
        with open(os.path.join(DIRECTORY, "index.html"), "w") as f:
            f.write("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ultimate LocalStorage Timer</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background-color: #2a2a2a;
            color: white;
        }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #4CAF50; }
        .instructions { 
            background: #333; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0;
            text-align: left;
        }
        .command { 
            background: #4CAF50; 
            color: white; 
            padding: 10px; 
            border-radius: 4px; 
            font-family: monospace;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Ultimate LocalStorage Timer</h1>
        <div class="instructions">
                         <h3>To run the React development server:</h3>
             <div class="command">npm start</div>
             <p>This will start the development server on port 3001</p>
            
            <h3>To build and serve the production version:</h3>
            <div class="command">npm run build</div>
            <div class="command">python server.py</div>
            <p>This will serve the built app on port 8080</p>
        </div>
    </div>
</body>
</html>
            """)

    print(f"Starting server on port {PORT}")
    print(f"Serving files from: {os.path.abspath(DIRECTORY)}")
    print(f"Open your browser and go to: http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"Port {PORT} is already in use. Please try a different port or stop the process using this port.")
        else:
            print(f"Error starting server: {e}")

if __name__ == "__main__":
    main()


