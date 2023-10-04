# Ausgsteckt Is

### Setup
1. run ```npm install``` to install all packages.
1. Change Google Maps API key in ```src/index.html```
2. Change API URL in ```src/config.json```

### Develope

#### Angular
1. run ```ng serve --port=80``` or ```ng serve --host=HOST_IP --port=80 --disable-host-check``` if you want to connect via network
2. open https://localhost
3. build project ```ng build```

#### Capacitor
1. run ```npx cap sync``` to sync changes to Capacitor project
2. Open in XCode / Android Studeio
    - Android: ```npx cap open android```
    - iOS: ```npx cap open ios```