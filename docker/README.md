# Tsundoku-Docker

This directory houses the project needed to set up the Tsundoku stack with Docker and Docker Compose.

## Upgrading

### Backend

If the backend is updated, you simply need to run the `./update.sh` script.

### Appwrite

If Appwrite is updated (following the documentation from Appwrite), the `docker-compose.yml` file will be modified.

Once you've reviewed the changes to the stack, run `docker compose exec appwrite migrate` to migrate the database.

As per the Appwrite documentation, keep in mind that migrations must be done between consecutive minor versions (so for example, 1.4.2 -> 1.5.3 is okay, but 1.4.2 -> 1.6.0 is not).
