// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: user-graduate;
// Julian Yaman & Niklas Leinz
// -----------------
// Dualis Widget
// -----------------
// Contact:
// dev@corusm.de || mail@yaman.pro

// Widget Settings
let MEDIUMWIDGET = (config.widgetFamily === 'medium') ? true : false

// Web Crawl Function

await loadSite()

async function loadSite() {
      let url='https://dualis.dhbw.de/scripts/mgrqispi.dll?APPNAME=CampusNet&PRGNAME=EXTERNALPAGES&ARGUMENTS=-N000000000000001,-N000324,-Awelcome'
      var wbv = new WebView()
      await wbv.loadURL(url)
      //javasript to grab data from the website
      let jsc = `
      var arr = new Array()
      
      document.getElementById('field_user').value = "leinz.niklas-it19@it.dhbw-ravensburg.de"
      document.getElementById('field_pass').value = "Salkin1903@home"
      document.getElementById('cn_loginForm').submit()
      
      `
      //Run the javascript
      await wbv.evaluateJavaScript(jsc)
      await wbv.waitForLoad()
      
      let tm = new Timer()
      tm.timeInterval = 2000
      
      tm.schedule(function() {
        
        let jsc2 = ` document.getElementsByClassName('link000310')[0].click() `
        
        wbv.evaluateJavaScript(jsc2)
        
        wbv.waitForLoad().then(r => { wbv.getHTML().then(r => {
        
          let tab = r.split("table")[1]
          tab = `<table ${tab}table>`
          tab = tab.split('tr')
          
          let schnitt = r.split("table")[3].split("</th")[1].split('>')[2].trim()
          
          let grades = []
          let totalCredits
          
          // console.log(tab[1])
          for (let to = 1; to < tab.length-1; to++) {
            // console.log(tab[to])
            if (tab[to].includes('T3')) {
              try {
                  let modul = tab[to].split('td')[1].trim().substr(15).split('<')[0]
                  let kurs = tab[to].split(',800,600);">')[1].split('</a>')[0]
                  let zahlen = tab[to].split('<td class="tbdata" style="text-align:right;">')
                  let credits = zahlen[2].trim().split('<')[0]
                  let note = zahlen[3].trim().split('<')[0]
                  
                  grades.push({ modul: modul, kurs: kurs, credits: credits, note: note })
                  
              } catch(e) {
                  // console.log('error')
              } 
            } else if (tab[to].includes('Friedrichshafen') && tab[to].includes('Summe')) {
              totalCredits = tab[to].split('nowrap;"> ')[1].split(',0')[0]
            }
          }
          
          // Output
          let finalJSON = { noten: grades, totalCredits: totalCredits, schnitt: schnitt }
          return finalJSON
          
          
          
        
        })})
      })      
}






function getFileManager() {
  try {
    fm = FileManager.iCloud()
  } catch(e) {
    fm = FileManager.local()
  }
  
  try {
    fm.documentsDirectory()
  } catch(e) {
    fm = FileManager.local()
  }

}


// Widget

if (config.runsInWidget){

    // TODO: Check if widgetParameter contains anything
    // TODO: Check if widgetParameter fits with the needed values (slicing out E-Mail and Password)
    // TODO: Check if user can login (function call for login, giving the e-mail and the password as parameter values)
    // TODO: If the login was successful, then fetch all data (function call to fetch the data)
    // TODO: If the login was unsuccessful, then show an error message inside the widget

    let widget = await createWidget()
    widget.setPadding(0,4,0,4)

    if (MEDIUMWIDGET){
        await widget.presentMedium()
    } else {
        await widget.presentSmall()
    }

    Script.setWidget(widget)
    Script.complete()
}else{
    // Don't need to scrape the data again
    Safari.open("https://dualis.dhbw.de")
}

async function createWidget(){
    const list = new ListWidget()

    const headerRow = list.addStack();
    const headerText = headerRow.addText("⚔️ Dualis")
    headerText.textColor = new Color('e74c3c', 1)
    const headerTextExtended = headerRow.addText(" - Noten")
    headerText.font = Font.mediumSystemFont(16)
    headerTextExtended.font = Font.mediumSystemFont(16)
    headerRow.setPadding(0,0,0,0)
    headerRow.centerAlignContent()
    headerRow.addSpacer(3)
    list.addSpacer(5)

    const gradeRow = list.addStack()
    gradeRow.layoutHorizontally()
    gradeRow.centerAlignContent()

    const placeholderDataSet = [
        {
            'courseName': 'TheoInf 3',
            'grade': 2.9
        },
        {
            'courseName': 'Datenbanken',
            'grade': '⏳'
        },
        {
            'courseName': 'Physik',
            'grade': 'WKL'
        },
        {
            'courseName': 'Digitaltechnik',
            'grade': 2.4
        }
    ]

    createGradeBlock(placeholderDataSet, 0, 3, gradeRow)

    if (MEDIUMWIDGET) {
        const emptySpace = gradeRow.addStack();
        emptySpace.setPadding(0,8,0,8)
        createGradeBlock(placeholderDataSet, 4, 7, gradeRow)
    }

    const footer = list.addStack();
    footer.setPadding(2,4,0,4)
    const footerText = footer.addText("Klicken, um Dualis zu öffnen")
    footerText.font = Font.mediumSystemFont(10)

    return list
}

// Future Options: Get different sets of courses, etc.
function createGradeBlock(dataSet, minRange, maxRange, gradeRow){
    const gradeBlock = gradeRow.addStack();
    gradeBlock.layoutVertically()
    gradeBlock.centerAlignContent()
    for (let i = minRange; i < maxRange + 1; i++){
        gradeBlock.addText(dataSet[i].courseName + ": " + dataSet[i].grade).font
            = Font.mediumSystemFont(14)
    }
    gradeBlock.backgroundColor = new Color('cccccc', 0.1)
    gradeBlock.cornerRadius = 8
    gradeBlock.setPadding(8,8,8,8)
    return gradeBlock;
}
