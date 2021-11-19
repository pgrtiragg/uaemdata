//cargar librerias externas
eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/moment/moment/master/min/moment.min.js').getContentText());
eval(UrlFetchApp.fetch('https://raw.github.com/icambron/twix.js/master/dist/twix.min.js').getContentText());


function make_report(desde,hasta) {

datos=SpreadsheetApp.openById("your id")
                    .getRange("m33")
                    .setFormula(`=QUERY(A:F;"select B,SUM(C) WHERE  (${generate_month_range(desde,hasta)}) GROUP BY B pivot F,A label B ',Departamentos'";0)`)
                    .getDataRegion().getValues()

  var dd = {
  pageOrientation: 'landscape',
     styles: {
      header: {
        fontSize: 15,
        bold: true,
      },
      subheader: {
        fontSize:12,
        bold: true
      },
      tableheader:{
        bold:true,
        fillColor: '#8d8d8d',
      },
      uno:{
        fillColor: '#59DB71',
      },
      dos:{
        fillColor: '#203EDC',
      }
    },
    /* https://github.com/bpampuch/pdfmake/issues/1802#issuecomment-529088303 */
    header:  { 
      image: "data:image/jpeg;base64," + Utilities.base64Encode(UrlFetchApp.fetch("http://www.pgr.gob.sv/images/logo-pgr-marzo-2021.png").getContent()), 
      fit: [60, 60], 
      margin: [30, 10]
    },
    content: [
      {
        text: 'PROCURADURÍA GENERAL DE LA REPÚBLICA',
        style: 'header',
        alignment: 'center'
      },
      {
        text: 'UNIDAD DE ATENCIÓN ESPECIALIZADA PARA LAS MUJERES',
        style: 'header',
        alignment: 'center'
      },
      {text:'\n'},      
      {
        text: `Período de ${desde} - ${hasta} `,
        style: 'subheader',
        alignment: 'center'
      },
      {text:"\n\n"},
     	{
			table: {
       
				body: make_table_report(datos)								
			}
		},
    {text:"\n\n"},
    {
      table:{
      	
        body:[	
          [{text:"Servicios",border: [false, false, false, false]}, {text:'',style:"uno",border: [false, false, false, false]}],
          [{text:"Atenciones",border: [false, false, false, false]}, {text:'',style:"dos",border: [false, false, false, false]}]
          ]
        }
    }
    ]
  }
  return dd
}

function make_table_report(datos){
 headers=[]
 body=[]
 footer=[]
 fila_body=[]
 estilos={1:"uno",2:"dos" }  
    for (i of datos[0]) { 
       
      headers.push({text: i.split(",")[1], style: estilos[i.split(",")[0]]??"tableheader", alignment: 'center'});
      }
      body.push(headers)
   
   for (i of datos[16]) { 
      footer.push({text:  i, style: 'tableheader', alignment: 'center'});
      }
      
    for (i of datos.slice(1,-1)){
      //body.push(i)  
      
      for(j of i){
        
        fila_body.push({text:j, alignment: 'center'})
      }
      body.push(fila_body)
      fila_body=[]
    }

    body.push(footer)   
    Logger.log(body)
    return body 
}

function generate_month_range(desde="Enero 2021",hasta="Enero 2021"){
  [mes1,anio1]=desde.split(" ");
  [mes2,anio2]=hasta.split(" ");
  f1=anio1+',' +monthtonumber(mes1) //valid format for date in js
  f2=anio2+',' +monthtonumber(mes2) //valid format for date in js

  if (new Date(f1).getTime() > new Date(f2).getTime()){
    [f1,f2]=[f2,f1];
  }

/* http://jsfiddle.net/Lkzg1bxb/ */
  rango=moment.twix(new Date(f1),new Date(f2)).iterate('months')
  fechas={}
  while(rango.hasNext()){
    [anio,mes]=rango.next().format('YYYY-M').split("-")
    
    if(fechas.hasOwnProperty(anio)){
      fechas[anio].push(mes)
    }else{
      fechas[anio]=[mes]
    } 
  }
cadena=''
cadena_tmp=''
for (i in fechas){  
    cadena+=` (E=${i} AND (`
    for (j of fechas[i]){
      cadena_tmp+=` D=${j} OR `
    }
    
    cadena += cadena_tmp.trim().slice(0,-2) + ')) OR '
    cadena_tmp=''
}

return cadena.trim().slice(0,-2)
}
