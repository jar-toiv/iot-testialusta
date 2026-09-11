## Part 1 Import and data structure

### Planning and pseudo divided into multiple parts in case there is a lot of documentation.

* Goal is to learn use of child_process so we can poll the EM111 with mbpoll and learn about registers usage and values.

>### Thoughts 
>
>- Use child_process with mbpoll to poll ME111, `figure out the payload for the meter`.
>- Meaby we need loop to read all registers into an object with K / V pair.
>- Do I need fs or something to write register values into JSON ?
>- Start with poll test to see what we get and how to strip it

`mbpoll 192.168.50.46 -a 1 -r 1 -c 2 -p 502 -t 4 -x -1` Works only on windows

`mbpoll 192.168.50.46 -a 1 -r 1 -c 2 -p 502 -t 4 -1` Works on Rasperry Pi (Hexa needs to be asked differently: removed -x flag)

` poll | ip | address | rekisteri (korjattu +1) | c= 2 rekisteriä INT32 | portti | formaatti 04 | hexat | pollaa kerran |`

| Modicom adr | Phys add | Len | Var | Format| Weight |
|---|---|---|---|---|---|
| 300001 | 0000h | 2 | V L-N | INT32 Value | Volt*10 |
| 300003 | 0002h | 2 | A | INT32 | Ampere*1000 |


**FROM MDN**
| child_process.exec() | child_process.execFile() | child_process.fork() | child_process.execSync() | child_process.execFileSync() |
|---|---|---|---|---|
| spawns a shell and runs a command within that shell, passing the stdout and stderr to a callback function when complete. | similar to child_process.exec() except that it spawns the command directly without first spawning a shell by default. | spawns a new Node.js process and invokes a specified module with an IPC communication channel established that allows sending messages between parent and child. | synchronous version of child_process.exec() that will block the Node.js event loop. | synchronous version of child_process.execFile() that will block the Node.js event loop. |

The child_process.exec() and child_process.execFile() methods additionally allow for an optional callback function to be specified that is invoked when the child process terminates

**FROM MDN**
| Options-kenttä | Tyyppi | Oletus | Selitys |
|---|---|---|---|
| `cwd` | string \| URL | `process.cwd()` | Lapsiprosessin työhakemisto |
| `env` | Object | `process.env` | Ympäristömuuttujat key-value-pareina |
| `encoding` | string | `'utf8'` | Merkistökoodaus |
| `shell` | string | `/bin/sh` (Unix) / `process.env.ComSpec` (Windows) | Millä shellillä komento ajetaan |
| `signal` | AbortSignal | — | Mahdollistaa prosessin keskeyttämisen |
| `timeout` | number | `0` | Aikakatkaisu millisekunteina (0 = ei rajaa) |
| `maxBuffer` | number | `1024 * 1024` (1 MB) | Max tavumäärä stdout/stderr:lle, ylitys katkaisee prosessin ja tulosteen |
| `killSignal` | string \| integer | `'SIGTERM'` | Millä signaalilla prosessi tapetaan timeoutissa/maxBufferissa |
| `uid` | number | — | Käyttäjän identiteetti (Unix) |
| `gid` | number | — | Ryhmän identiteetti (Unix) |
| `windowsHide` | boolean | `false` | Piilottaako lapsiprosessin konsoli-ikkunan Windowsilla |

| Callback-parametri | Tyyppi | Selitys |
|---|---|---|
| `error` | Error | Virhe, jos prosessi epäonnistui |
| `stdout` | string \| Buffer | Prosessin vakiotuloste |
| `stderr` | string \| Buffer | Prosessin virhetuloste |

### ENCODING
The stdout and stderr arguments passed to the callback will contain the stdout and stderr output of the child process. By default, Node.js will decode the output as UTF-8 and pass strings to the callback. The encoding option can be used to specify the character encoding used to decode the stdout and stderr output. If encoding is 'buffer', or an unrecognized character encoding, Buffer objects will be passed to the callback instead.

# Pseudo

```
IMPORT NODE.js PROCESS
Import child_process.execFile()
import fs ( file stream varmaan jsonin kanssa en ole varma älä vielä noteeraa kun ei ole palautuva data edes hanskattu)

CREATE OBJECT registers

const registers = {
    name: "V L-N",
    physicalAdress: "0x000h",
    mbpollAdress: 1,
    dataFormat: "int32",
    weight: 10,
    status: "pending",
    success: {
        raw:[]
        //tänne se tuleva key value pair tai raakadata mitä saadaan kun ajetaan child process. emme tiedä vielä miten se tulee.
    },
    error: {
        msg: ""
        //Tänne key value errorit kun saadaan
    }
}
 ```