
$(function (){

    loadMachines();
  
});

//---------------CHART------------------------

function initChart(data){

    var indexes=[]
    $.each(data, function (i, extraction) {
        indexes.push(i+1);
    });

    var ctxL = document.getElementById("lineChart").getContext('2d');
        var myLineChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: indexes,
            datasets: [{
                label: "Средна стойност на изтичане [мл/с]",
                data: data,
                backgroundColor: [
                'rgba(105, 0, 132, .2)',
                ],
                borderColor: [
                'rgba(200, 99, 132, .7)',
                ],
                borderWidth: 2
            }
           
            ]
        },
        options: {
            responsive: true,
            onClick:function(event){
                var activePoints = myLineChart.getElementsAtEvent(event);
                if(typeof activePoints != "undefined" && activePoints != null && activePoints.length != null && activePoints.length > 0){

                    var index=activePoints[0]._index;
                    
                    loadJsonFlow(index)
                    
                }
                
            }
        }
        });
}


//-------------------END CHART FUNCTION---------------------- 

function initFlowChart(data){

    $('#main-container').empty();

    $('#main-container').append($('<canvas></canvas>').attr('id','lineChart'))

    var splitData=data.split(" ");

    var indexes=[]
    $.each(splitData, function (i, extraction) {
        indexes.push(i+1);
    });

    var ctxL = document.getElementById("lineChart").getContext('2d');
        var myLineChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: indexes,
            datasets: [{
                radius:0,
                label: "Графика на изтичане",
                data: splitData,
                backgroundColor: [
                'rgba(0, 137, 132, .2)',
                ],
                borderColor: [
                'rgba(0, 10, 130, .7)',
                ],
                borderWidth: 2
            }
           
            ]
        },
        options: {
            
            responsive: true,

            scales:{

                yAxes:[{
                    ticks:{
                        beginAtZero:true,
                        suggestedMax: 8
                    }
                }]

            }
            
        }
        });
}


function loadJsonFlow(index){

    var machineId= $('#machine-ul li .active').attr('id');

    $.ajax({
        type:'GET',              
        url:'https://us-central1-recipeturnik-v2.cloudfunctions.net/getFlow/'+machineId+'/'+index,
        dataType:"json",       
        success:function(data){           
           
            initFlowChart(data);
        }
    });


}


function loadChartJson (machineId) {
    
    $.ajax({
        type:'GET',              
        url:'https://us-central1-recipeturnik-v2.cloudfunctions.net/getInfo/'+machineId,
        dataType:"json",       
        success:function(data){           
           
            initChart(data);
        }
    });
}

//Get Json data for machines
function loadMachines(){

    $.ajax({
        type: 'GET',
        url: 'https://us-central1-recipeturnik-v2.cloudfunctions.net/getMachines',
        dataType: 'json',
        success: function (machines) {
            loadDOMMachines(machines);
        }
    });

}

//Create machine in sidebar 
function loadDOMMachines(machines) {
    
    $.each(machines, function (i, machine) {

        $('#machine-ul')
                .append($('<li></li>')
                    .addClass('nav-item')
                    .append($('<a></a>')
                        .addClass('nav-link')
                        .attr('href', '#')
                        .attr('id', machine)
                        .text(machine)
                        .on('click', function () {
                            $('#machine-ul li .active').removeClass('active');
                            var currentMachine = $(this);
                            currentMachine.addClass('active');
                            $('#main-container').empty();

                            loadButtons();
                        })
                    )
                )  
    });
   
    //click first item with init
    //$('#machine-ul li:first-child a').click();
}

function loadButtons(){

    $("#main-container")
        .append($('<div></div>')
            .addClass('col-lg-4 col-md-6 col-sm-12')
            .append($('<div></div>')
                .addClass('card')
                .append($('<div></div>')
                    .addClass('card-body')
                    .append($('<a></a>')                       
                        .attr('href', '#')
                        .attr('id','system-history-btn')                        
                        .text('Espresso System History')
                        .on('click',function(){                         
                          $('#main-container').empty();
                          $('#main-container').append($('<canvas></canvas>').attr('id','lineChart'))
                           var machineId= $('#machine-ul li .active').attr('id');
                          loadChartJson(machineId) 
                        })
                    )
                )            
            )            
        )
        .append($('<div></div>')
            .addClass('col-lg-4 col-md-6 col-sm-12')
            .append($('<div></div>')
                .addClass('card')
                .append($('<div></div>')
                    .addClass('card-body')
                    .append($('<a></a>')
                        .attr('href', '#')
                        .attr('id','machine-profile-btn')                         
                        .text('Machine Profile')
                    )
                )            
            )
            
        )
        .append($('<div></div>')
            .addClass('col-lg-4 col-md-6 col-sm-12')
            .append($('<div></div>')
                .addClass('card')
                .append($('<div></div>')
                    .addClass('card-body')
                    .append($('<a></a>')
                        .attr('href', '#')
                        .attr('id','recipe-btn')                         
                        .text('Recipe')
                    )
                )            
            )
            
        )
}