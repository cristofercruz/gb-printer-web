# Game Boy Printer Web

## Basic usage
* choose a [color palette](#/palettes)
* [paste your exports](#/dump) into a textfield (or simply drag and drop your dump(s) into this window)
* check your images [in the gallery](#/gallery)
* You can also try to drag/drop your cartridge dump into this window  

## Supported formats
* This Project is mainly built around the serial output of the original [GBP Emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator)
* Cart .SAV files are also supported experimentally  
Currently I assume the size is exactly `131072 bytes`, as this is the only sample of a cartridge dump I have.  
If it does not work, [please open an issue](https://github.com/HerrZatacke/gb-printer-web/issues) and attach your file.  


## ToDos
* Add filters/tags
* Edit palettes
* Allow rendering animated Gifs
* Select multiple palettes to download the gallery in.
* allow some gesture navigation on touch devices
* Export without frame
* Other blendmodes than multiply for RGB-Images

## Local Setup
You can run this app locally to directly use the gbp-emulator on your serial port 
* Install [node.js](https://nodejs.org/) if you haven't already.
* Check out/clone/download [this repository](https://github.com/HerrZatacke/gb-printer-web)
* Run `npm i` in the root directory via your commandline
* Add a `ports.config.json` in the root dir (see below)
* Run `npm start` via your commandline
* Open [localhost:3000](http://localhost:3000)
* Go to the 'Settings' page and change the 'Remote Socket URL' to `localhost:3001`
* Print something


## Serial Config with `ports.config.json`
Create a file `ports.config.json` in the root dir and configure it like the following example (multiple ports are supported):
``` json
[
  {
    "path": "COM19",
    "baudRate": 115200,
    "dataBits": 8,
    "stopBits": 1,
    "parity": "none",
    "retry": false
  },
  ...
]
```
you can set `retry` to a number of milliseconds after which a retry will be attempted to open the port.

## Future Plans
This tool is meant to be integrated into the [Websocket GBP Emulator](https://github.com/HerrZatacke/websocket-gbp-emulator)

## Links and research
* The source to this project is [available on GitHub](https://github.com/HerrZatacke/gb-printer-web)
* A basic version of this tool is avaliable [on GitHub-pages](https://herrzatacke.github.io/gb-printer-web/#/)  
* This project is meant to replace my [GB printer direct serial to gif converter](https://github.com/HerrZatacke/direct-serial-to-gif-converter)

### Research
* [Websockets on an ESP8266](https://tttapa.github.io/ESP8266/Chap14%20-%20WebSocket.html)
* [Programming a standalone ESP8266](https://www.instructables.com/id/3-Simple-Ways-of-Programming-an-ESP8266-12X-Module/)
* [Deploying your JS App to Github Pages the easy way (or not)](https://medium.com/linagora-engineering/1ef8c48424b7)
* [SSL WebSockets for the Arduino currently not supported](https://github.com/gilmaimon/ArduinoWebsockets/issues/59) 
