const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');

let mainWindow;


function createWindow() {
    mainWindow = new BrowserWindow({
        width: 324,  
        height: 202, 
        transparent: true,
        frame: false,
        
        alwaysOnTop: false, // let other windows cover it
        skipTaskbar: true,  // hide from taskbar
        type: 'desktop',    // tells os to treat as desktop widget
        
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });


    mainWindow.loadFile('index.html');

    function getCPUInfo() {
        const cpus = os.cpus();
        let idle = 0;
        let total = 0;
        
        cpus.forEach(core => {
            for (let type in core.times) {
                total += core.times[type];
            }
            idle += core.times.idle;
        });
        return { idle, total };
    }

    let startMeasure = getCPUInfo();

    setInterval(() => {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const memoryPercentage = ((totalMem - freeMem) / totalMem) * 100;

        const endMeasure = getCPUInfo();
        const idleDifference = endMeasure.idle - startMeasure.idle;
        const totalDifference = endMeasure.total - startMeasure.total;
        
        const cpuPercentage = 100 - Math.floor((100 * idleDifference) / totalDifference);
        
        startMeasure = endMeasure; 

        mainWindow.webContents.send('system-stats', {
            memory: memoryPercentage.toFixed(1),
            cpu: cpuPercentage
        });
    }, 2000);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});