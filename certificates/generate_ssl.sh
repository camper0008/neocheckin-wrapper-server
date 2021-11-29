#!/bin/bash

# This script generates local temporary SSL key and certificate

# Run this script inside the certificates folder

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -subj "/C=US/ST=Chicago/L=Geleen/O=Bruh bruh/OU=Development/CN=localhost/emailAddress=bruh@yahoo.com"
