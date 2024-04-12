from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import subprocess
import hashlib
import hmac
import requests
import atexit
import threading


PORT = 8987
SECRET_TOKEN = ""
DISCORD_WEBHOOK_URL = ""


def verify_signature(payload_body, signature_header):
    """
    Verifies that the payload received was from GitHub
    """
    if not signature_header:
        return False
    hash_object = hmac.new(
        SECRET_TOKEN.encode("utf-8"), msg=payload_body, digestmod=hashlib.sha256
    )
    expected_signature = "sha256=" + hash_object.hexdigest()
    if not hmac.compare_digest(expected_signature, signature_header):
        return False
    return True


def notify_discord(message):
    data = {"content": message}
    requests.post(
        DISCORD_WEBHOOK_URL,
        data=json.dumps(data),
        headers={"Content-Type": "application/json"},
    )


class BackgroundUpdate(threading.Thread):
    def run(self, *args, **kwargs):
        subprocess.run(["bash", "update.sh"])
        notify_discord("Backend has been deployed!")


class WebhookHandler(BaseHTTPRequestHandler):
    def _set_response(self, status_code=200, content_type="text/plain"):
        self.send_response(status_code)
        self.send_header("Content-type", content_type)
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)

        if not verify_signature(post_data, self.headers.get("x-hub-signature-256")):
            print("Received a payload with an invalid signature. Ignoring.")
            return

        if self.headers.get("X-GitHub-Event") == "package":
            payload = json.loads(post_data.decode("utf-8"))

            # Verify package details
            if (
                payload["action"] == "published"
                and payload["package"]["name"] == "tsundoku-backend"
                and payload["package"]["package_version"]["container_metadata"]["tag"][
                    "name"
                ]
                == "latest"
            ):
                t = BackgroundUpdate()
                t.start()
                self._set_response(status_code=200, content_type="application/json")
                self.wfile.write(json.dumps({"message": "Thank you"}).encode())
                return

        self._set_response(status_code=200, content_type="application/json")
        self.wfile.write(json.dumps({"message": "Received but uninterested"}).encode())


def run_server():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, WebhookHandler)
    print(f"Server listening on port {PORT}")
    httpd.serve_forever()


def exit_handler():
    notify_discord(
        "Backend deploy bot terminated. Please check the server for more information."
    )


if __name__ == "__main__":
    atexit.register(exit_handler)
    notify_discord("Backend deploy bot is starting up...")
    run_server()
