#!/usr/bin/env python3
import socket
import subprocess
import sys

host = "ep-odd-fog-axpxauwj-pooler.c-4.us-east-2.aws.neon.tech"
print("resolving", host)
print(socket.getaddrinfo(host, 5432)[:2])

subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg[binary]", "-q"])
import psycopg

url = "postgresql://neondb_owner:npg_sBbQpif18vYl@ep-odd-fog-axpxauwj-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"
try:
    with psycopg.connect(url, connect_timeout=30) as c:
        with c.cursor() as cur:
            cur.execute("select current_database(), 1")
            print("WSL PSYCOPG OK", cur.fetchone())
except Exception as e:
    print("WSL FAIL", e)
    raise
