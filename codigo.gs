
function doGet(e) {
//data=SpreadsheetApp.openById("your id").getDataRange().getValues()


mapa=SpreadsheetApp.openById("your id").getSheetByName('mapa').getDataRange().getValues()
tpl=HtmlService.createTemplateFromFile('index');
tpl.mapa=mapa
html=tpl.evaluate()
return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

/*
  return HtmlService
      .createTemplateFromFile('index')
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  */
}

function getajaxdata(pad,fecha){
//execute query function in sheets where param=param
[mes,anio]=fecha.split(" ")
rango=SpreadsheetApp.openById("your id")
                    .getRange("i5")
                    .setFormula(`=QUERY(A:E;"select A,SUM(C) WHERE B='${pad}' AND E=${anio} AND D=${monthtonumber(mes)}  GROUP BY A";0)`)
                    .getDataRegion().getA1Notation()

data=SpreadsheetApp.openById("your id").getRange(rango).getValues()

return data;

}

function monthtonumber(month){
  return {
   'enero':1,
'febrero':2,
'marzo':3,
'abril':4,
'mayo':5,
'junio':6,
'julio':7,
'agosto':8,
'septiembre':9,
'octubre':10,
'noviembre':11,
'diciembre':12    
  }[month.toLowerCase()]

}
