# Python 3 server example
from http.server import BaseHTTPRequestHandler, HTTPServer
import webbrowser

hostName = "localhost"
serverPort = 8000


class CategorizerServer(BaseHTTPRequestHandler):

    def do_GET(self):
        content = ""
        for _ in range(3):
            try:
                content = open(self.path[1:]).read()
                self.send_response(200)

                if self.path.endswith(".html"):
                    contentType = "text/html"
                elif self.path.endswith(".css"):
                    contentType = "text/css"
                elif self.path.endswith(".js"):
                    contentType = "application/javascript"
                elif self.path.endswith(".svg"):
                    contentType = "image/svg+xml"
                else:
                    contentType = "text/plain"

                self.send_header("Content-type", contentType)

                break
            except:
                self.path = "/index.html"

        if (content == ""):
            self.send_response(404)
            content = "File not found"

        self.end_headers()
        self.wfile.write(bytes(content, "utf-8"))

    def do_POST(self):
        print("In do_POST")
        content_len = int(self.headers.get("content-length", 0))
        post_body = self.rfile.read(content_len)
        print(str(post_body, "utf-8"))
        print(self.path)

        self.send_response(200)
        self.end_headers()

    # def do_PUT(self):
    #     print("In do_PUT")
    #     content_len = int(self.headers.get("content-length", 0))
    #     post_body = self.rfile.read(content_len)
    #     print(str(post_body, "utf-8"))
    #     print(self.path)

    #     self.send_response(200)
    #     self.end_headers()


if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), CategorizerServer)
    address = "http://%s:%s" % (hostName, serverPort)
    print("Server started %s" % address)
    webbrowser.open_new_tab(address)

    try:
        webServer.serve_forever()
    except:
        pass

    webServer.server_close()
    print("Server stopped.")
