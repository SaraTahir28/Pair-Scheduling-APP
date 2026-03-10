from pathlib import Path
import json

from google_auth_oauthlib.flow import InstalledAppFlow

# Full calendar access is needed to create events, add attendees,
# and generate Google Meet links.
SCOPES = ["https://www.googleapis.com/auth/calendar"]

BASE_DIR = Path(__file__).resolve().parent
CLIENT_SECRET_FILE = BASE_DIR / "oauth_client_secret.json"
TOKEN_FILE = BASE_DIR / "oauth_token.json"


def main():
    # Starting the local OAuth flow in the browser and authorizes
    # the project Google account for Calendar access.
    flow = InstalledAppFlow.from_client_secrets_file(
        str(CLIENT_SECRET_FILE),
        SCOPES,
    )

    credentials = flow.run_local_server(port=0)

    # Save the access/refresh token so the backend can reuse it
    # without asking for login on every request.
    TOKEN_FILE.write_text(credentials.to_json())
    print(f"Saved OAuth token to {TOKEN_FILE}")


if __name__ == "__main__":
    main()