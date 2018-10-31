//Execute when page is open and HTML is ready
$(function (){

    loadMachines();
    
});

//---------------------------------------------------AJAX REQUEST-----------------------------------------

//Get all machines serial numbers
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
//Get all drinks data 
function getRecipes(machineId){

    $.ajax({

        type:'GET',
        url:'https://us-central1-recipeturnik-v2.cloudfunctions.net/getRecipes/'+machineId,
        dataType:'json',
        success:function(data){
           
            //createRecipes(data);
            addDrinksDOM(data)
        }

    });
}
//Get data for Flow chart
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
//Get data for avg. chart 
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

//---------------------------------------------------END AJAX REQUEST--------------------------------------




//---------------------------------------------------CHARTS------------------------------------------------

//Avg chart
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

//Flow chart
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


//Drinks chart
function initDrinkChart(data){

    var labels=[];
    var values=[];

    
    $.each(data,function(i,recipe){

        labels.push(i)
        values.push(recipe[5])


    })
    
    $('#main-container').empty();
    $('#main-container').append($('<canvas></canvas>').attr('id','drinksChart'))

    var ctx = document.getElementById("drinksChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Drinks count',
                data: values,
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

//---------------------------------------------------END CHARTS------------------------------------------------


//---------------------------------------------------DOM MANIPULATIONS-----------------------------------------

//Add machine serial number in sidebar nav
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

//Create buttons(E.S.H.,Profile,Recipes), for every machine
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
                        .on('click', function(){
                            $('#main-container').empty();
                            addBreadcrumb('Machine Profile');
                            addDOMProfile();
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
                        .attr('id','recipe-btn')                         
                        .text('Recipe')
                        .on('click',function(){
                            $('#main-container').empty()
                            //addDOMRecipe();
                            var machineId= $('#machine-ul li .active').attr('id');
                            getRecipes(machineId)
                            addBreadcrumb('Recipe')
                        })
                    )
                )            
            )
            
        )
}

//Greate drinks
function addDrinksDOM(data){

    

    var sortedData=[];
    for(var recipe in data){
        sortedData.push([recipe,data[recipe]['Position']]);
    }

    sortedData.sort(function(a,b){
        return a[1]-b[1];
    });

    console.log(sortedData)

    $('#main-container')
        .append($('<div></div>').addClass('carousel-control-prev zi-1').append($('<a></a>').attr('href','#prev-page').attr('id','prev-page').attr('data-slide','prev')
            .append($('<img>').attr('src','assets/pointer_left.png'))))
        .append($('<div></div>').addClass('carousel-control-next zi-1').append($('<a></a>').attr('href','#next-page').attr('id','next-page').attr('data-slide','next')
            .append($('<img>').attr('src','assets/pointer_right.png'))))
        .append($('<div></div>')
        .addClass('container-fluid min-ht')
        .append($('<div></div>').addClass('row').append($('<i></i>').addClass('fas fa-chart-bar fa-2x icon-pad-lt')
            .on('click',function(){
                addBreadcrumb('Chart')
                initDrinkChart();

            })))
        .append($('<div></div>')
            .addClass('row text-center text-lg-left drinks-container')
            .attr('id','drinks-container')           
        )
    )
    $.each(data,function(i,recipe){

        var img=recipe[3];

        $('#drinks-container')
            .append($('<div></div>')
            .addClass('col-lg-3 col-md-4 col-xs-6 drink-item')
                .append($('<a></a>')
                .addClass('d-block mb-4 h-90 d-flex justify-content-center marg-b-0')
                .attr('href','#')
                    .append($('<img>')
                    .addClass('drink-img img-fluid img-thumbnail')
                    .attr('src','assets/'+img)
                    .attr('alt','')
                    .on('click',function(){
                        
                        initModal(recipe,i);

                    })    
                )
            ).append($('<div></div>').addClass('d-flex justify-content-center ').append($('<span></span>').addClass('zi-1').text(i)))        
        )

    })

    pagination();
    
}

//Add links to breadcrumb
function addBreadcrumb(item){

    $('#breadcrumb').append($('<li></li>').addClass('breadcrumb-item active').attr('aria-current','page').text(item));

}

//Add machine link to breadcrumb
function addMachineBreadcrumb(item){

    $('#breadcrumb').empty()

    $('#breadcrumb').append($('<li></li>').addClass('breadcrumb-item active').attr('aria-current','page').text('Home'));
    $('#breadcrumb').append($('<li></li>').addClass('breadcrumb-item active').attr('aria-current','page').text(item));

}

//Add drinks to list with all recipes. NOT USE
function addDOMRecipe(){
    var machineId= $('#machine-ul li .active').attr('id');

    $('#main-container').append(
        $('<div></div>')
            .addClass('container d-flex justify-content-center')
            .append($('<div></div>')
                .addClass('card col-lg-6 col-md-6 col-sm-12')
                .append($('<div></div>')
                .addClass('card-header row menu-header')
                .append($('<span></span>').addClass('pull-right float-right').append($('<i></i>').addClass('fas fa-chart-bar').on('click',function(){
                    addBreadcrumb('Chart')
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

//Create recipe row in list. NOT USE
function createRecipes(data){
    
    $.each(data,function(i, recipe){

        //DRINK COUNT INDEX
        var count=recipe[5];
     
        $('#recipe-list').append($('<a></a>').addClass('list-group-item list-group-item-action').attr('href','#').attr('value',i).text(i)
                        .append($('<span></span>').addClass('badge badge-primary badge-pill float-right').text(count)).on('click',function(){

                            $('#recipe-list').empty();
                            $('.card-header').empty();
                            addBreadcrumb(i);
                            recipeProfile(recipe);
                        }))

    })
}
//Recipe profile for selected drink. NOT USE
function recipeProfile(recipe){

    

    $.each(recipe,function(i,data){
        
        $('#recipe-list').append($('<a></a>').addClass('list-group-item list-group-item-action').attr('href','#').text(i+': '+data));

    })

}
//Machine Profile
function addDOMProfile(){

    $('#main-container')


}

//---------------------------------------------------END DOM MANIPULATIONS-----------------------------------------


//---------------------------------------------------HELPING METHODS-------------------------------------------------------

//Hide drinks over page limit, init next and prev. buttons.
function pagination(){

    // Get total number of the drinks 
    var numberOfItems = $('.drinks-container .drink-item').length; 
        
    // Limit of items per each page
    var limitPerPage = 8; 
    
    // Hide all items over page limits
     $('.drinks-container .drink-item:gt(' + (limitPerPage - 1) + ')').hide();

     // Get number of pages
     var totalPages = Math.ceil(numberOfItems / limitPerPage); 

     var currentPage=1;

     //next-page button
     $('#next-page').on('click', function(){

       if(currentPage===totalPages){
         return false;
       }else{

         currentPage++;
         $('.drinks-container div').hide();
         var grandTotal = limitPerPage * currentPage;

         for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
          $(".drinks-container .drink-item:eq(" + i + ")").show();
         }
       }
     })
     //prev-page button
     $('#prev-page').on('click',function(){

       if(currentPage===1){

         return false;

       }else{

         currentPage--;
         $('.drinks-container div').hide();
         var grandTotal = limitPerPage * currentPage;

         for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
           $(".drinks-container .drink-item:eq(" + i + ")").show();
         }

       }

     })
}

//Open modal for selected drink
function initModal(data,name){

    $('#modalTitle').text(name)
    $('.list-group').empty()
    $.each(data,function(i,recipe){

        $('.list-group')
            .append($('<a></a>')
            .addClass('list-group-item list-group-item-action waves-effect')
            .attr('href','#')
            .text(i+': '+recipe))

    })

    $('#drinks-modal').modal('show'); 
}
//---------------------------------------------------END METHODS-------------------------------------------------------










