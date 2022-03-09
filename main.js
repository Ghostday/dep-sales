const { app, BrowserWindow } = require('electron')
const csv = require('csv-parser');
const fs = require('fs');

const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split('00');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  
  return parseInt(hours)
  // return `${hours}:${minutes}`;
}


let days = {}
fs.createReadStream('hourly.csv')
  .pipe(csv())
  .on('data', (row) => {
    let arrOfKeys = Object.values(row)
    let date = arrOfKeys[3]
    let newDate = new Date(date).toISOString().split('T')[0]
    let amount = parseInt(arrOfKeys[7])
    
    if (amount > 0) {
      days[newDate] = {}
    }

  })
  .on('end', () => {
    fs.createReadStream('hourly.csv')
    .pipe(csv())
    .on('data', (row) => {
      let arrOfKeys = Object.values(row)
      let date = arrOfKeys[3]
      let newDate = new Date(date).toISOString().split('T')[0]

      let timeofDay = arrOfKeys[6].split('-')[0]
      let hr = timeofDay.replace(/\s/g, '');
      let amount = parseInt(arrOfKeys[7])
      
      if (amount > 0) {
        days[newDate][convertTime12to24(hr)] = amount
      }
  
    })
    .on('end', () => {

      let sales = []
      for (let day in days) {
        console.log(day)
        for (let time in days[day]) {
          let data = {
              "intHour": parseInt(time),
              "intMinute": 0,
              "strYMD": day,
              "fltSalesAmount": days[day][time],
              "fltSalesQty": 0,
              "intOperationalUnit": 0,
              "intCompany": 11,
              "strSalesType": "Sales",
              "strState": "actual"
            }
          sales.push(data)
        }
      }
      console.log('CSV file successfully processed');
      console.log(sales)

    });
  });



// const createWindow = () => {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600
//   })

//   win.loadFile('index.html')
// }
// app.whenReady().then(() => {
//   createWindow()

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow()
//     }
//   })
// })



// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit()
// })
