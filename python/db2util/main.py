"""
Module Docstring
"""

import paramiko
import os


def main(args):
    client = paramiko.SSHClient()
    # The default policy is to reject the key and raise an SSHException
    # if server’s hostname is not found in either set of host keys
    # We adjust to use AutoAddPolicy to automatically add the hostname and
    # new host key to the local HostKeys object.
    # Adjust your policy as needed
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, **args)
    query = "SELECT AUTHORIZATION_NAME as USER FROM QSYS2.USER_INFO WHERE SPECIAL_AUTHORITIES LIKE '%*ALLOBJ%'"
    print(f"SQL Query: {query}")
    stdin, stdout, stderr = client.exec_command(f'db2util -o json "{query}"')
    stdin.close()
    print(stdout.read().decode('utf8'))
    client.close()


if __name__ == "__main__":
    HOST = os.getenv("SSH_HOST")
    USER = os.getenv("SSH_USER")
    PASSWORD = os.getenv("SSH_PASSWORD")
    KEY_FILENAME = os.getenv("SSH_PRIVATE_KEY")
    PASSPHRASE = os.getenv("SSH_PASSPHRASE")

    args = {"username": USER}

    if PASSWORD:
        args["password"] = PASSWORD

    if KEY_FILENAME:
        args["key_filename"] = KEY_FILENAME

    if PASSPHRASE:
        args["passphrase"] = PASSPHRASE

    main(args)
