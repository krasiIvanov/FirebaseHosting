
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
                    
                    addBreadcrumb("Flow")
                }
                
            }
        }
        });
}


//-------------------END CHART FUNCTION---------------------- 


//---------------FLOW CHART------------------------
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
//-------------------END FLOW CHART FUNCTION---------------------- 

//----------------------DRINKS CHART------------------------

function initDrinkChart(){

    var labels=[];
    var values=[];

    $('#recipe-list a')

    console.log(previousValue);

    $('#main-container').empty();
    $('#main-container').append($('<canvas></canvas>').attr('id','drinksChart'))

    var ctx = document.getElementById("drinksChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });


}
//-----------------------END DRINKS CHART FUNCTION------------------------

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


function getRecipes(machineId){

    $.ajax({

        type:'GET',
        url:'https://us-central1-recipeturnik-v2.cloudfunctions.net/getRecipes/'+machineId,
        dataType:'json',
        success:function(data){
           
            createRecipes(data);

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
                            addMachineBreadcrumb(currentMachine[0].text)

                        })
                    )
                )  
    });
   
    //click first item with init
    //$('#machine-ul li:first-child a').click();
}




//--------------CREATE BREADCRUMB-----------------------

function addBreadcrumb(item){

    $('#breadcrumb').append($('<li></li>').addClass('breadcrumb-item active').attr('aria-current','page').text(item));

}

function addMachineBreadcrumb(item){

    $('#breadcrumb').empty()

    $('#breadcrumb').append($('<li></li>').addClass('breadcrumb-item active').attr('aria-current','page').text('Home'));
    $('#breadcrumb').append($('<li></li>').addClass('breadcrumb-item active').attr('aria-current','page').text(item));

}



function createBreadcrumb(){

    

    var $this = $(this);
    
    var $bc = $(".breadcrumb");
    
    var previousValue = $bc.html();
    
    $bc.html('')

    $this.parents('li').each(function (n, li) {
        //we make a copy of the child anchor as we will want the same behaviour on our
        //breadcrumb.
        var $a = $(li).children('a').clone();
        //and we attach the clone after the previous clone if there is any. We also
        //insert a separator.
        $bc.append(' / ', $a);
    });

    //Once we are done we attach our old value to the beginning of the breadcrumb.
    $bc.prepend(previousValue);

   
    return false;

   

}

//--------------END BREADCRUMB FUNCTIONS-----------------------

function addDOMRecipe(){
    var machineId= $('#machine-ul li .active').attr('id');

    $('#main-container').append(
        $('<div></div>')
            .addClass('container d-flex justify-content-center')
            .append($('<div></div>')
                .addClass('card col-lg-6 col-md-6 col-sm-12')
                .append($('<div></div>')
                .addClass('card-header row')
                .append($('<span></span>').addClass('pull-right float-right').append($('<i></i>').addClass('fas fa-chart-bar').on('click',function(){
                    initDrinkChart();
                }))))
                .append($('<div></div>')
                    .addClass('card-body')
                        .append($('<div></div>')
                        .attr('id','recipe-list')
                        .addClass('list-group list-group-flush')))));
   
    var machineId= $('#machine-ul li .active').attr('id');

    getRecipes(machineId);
    
}

function createRecipes(data){
    
    $.each(data,function(i, recipe){

        //DRINK COUNT INDEX
        var count=recipe[5];
     
        $('#recipe-list').append($('<a></a>').addClass('list-group-item list-group-item-action').attr('href','#').text(i)
                        .append($('<span></span>').addClass('badge badge-primary badge-pill float-right').text(count)).on('click',function(){

                            $('#recipe-list').empty();
                            addBreadcrumb(i);
                            recipeProfile(recipe);
                        }))

    })
}

function recipeProfile(recipe){

    
    $.each(recipe,function(i,data){
        
        $('#recipe-list').append($('<a></a>').addClass('list-group-item list-group-item-action').attr('href','#').text(i+': '+data));

    })

}
//load buttons for each machine
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
                          var bc='Espresso System History';
                          addBreadcrumb(bc) 
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
                        .on('click',function(){
                            $('#main-container').empty()
                            addDOMRecipe();
                            addBreadcrumb('Recipe')
                        })
                    )
                )            
            )
            
        )
}