# [smtp2bash](https://github.com/black-roland/smtp2bash)
Simple SMTP-server that executes a specific script for each incoming message.

## Installation
Node.js and npm is required. [Download latest version](https://github.com/black-roland/smtp2bash/archive/master.tar.gz) from GitHub and extract it:
```
tar -x -z -f smtp2bash-master.tar.gz
```
Run:
```
cd smtp2bash-master
npm install
```

## Configuring
Copy `defaults.json` as `config.json` and customize.

Available options:
* `listen` — address and port on which listen to.
* `exec` — script or program to execute.
* `exec_arguments` — array of script/program arguments. Set `[]` if arguments are not required.

`exec` and `exec_arguments` uses all power of [lodash templates](https://lodash.com/docs#template). For example, you can pass e-mail recepient address as script argument:
```
{
  "exec": "/usr/local/bin/awesome.sh",
  "exec_arguments": [ "<%= to[0] %>" ]
}
```
As a result `/usr/local/bin/awesome.sh mail@example.com` will be executed.

Available variables:
* `from` — e-mail from address.
* `to` — array of recepient e-mail addreses.
* `remoteAddress` — IP address of SMTP-client.

## Usage
Simply start daemon `bin/smtp2bash`.

## Usage examples
### Sending [Monit](http://mmonit.com/monit/) alerts using SSMTP and Jabber

`config.json`:

```
{
  "exec": "/usr/local/bin/<%= to[0].split('@').shift() %>",
  "exec_arguments": []
}
```

`monitrc`:

```
set mailserver localhost with port 2525
set alert monit-sendmail@bin.local.usr { connection }
set alert monit-sendxmpp@bin.local.usr
```

`/usr/local/bin/monit-sendmail`:

```
#!/bin/sh
exec ssmtp mail@example.com
```

`/usr/local/bin/monit-sendxmpp`:

Script for Prosody [mod_post_msg](https://code.google.com/p/prosody-modules/wiki/mod_post_msg).

```
#!/bin/sh

TO="xmpp@example.com"
SERVER="example.com"
AUTH_USER="monit"
AUTH_PASSWORD="secret"

exec curl "http://${SERVER}:5280/msg/${TO}" -u "${AUTH_USER}@${SERVER}:${AUTH_PASSWORD}" -H "Content-Type: text/plain" -X POST --data-binary @-
```
On every Monit alert `/usr/local/bin/monit-sendxmpp` wil be excuted. For `connection` alerts will be executed `/usr/local/bin/monit-sendmail`.
