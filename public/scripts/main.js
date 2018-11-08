//Execute when page is open and HTML is ready
$(function (){

    loadMachines();
    search();
    
});

//---------------------------------------------------AJAX REQUEST-----------------------------------------

//Get all machines serial numbers
function loadMachines(){
    showSpiner();
    $.ajax({
        type: 'GET',
        url: 'https://us-central1-recipeturnik-v2.cloudfunctions.net/getMachines',
        dataType: 'json',
        success: function (machines) {
            loadDOMMachines(machines);
            hideSpinner();
        }
    });
}
//Get all drinks data 
function getRecipes(machineId){
    showSpiner();
    $.ajax({
        type:'GET',
        url:'https://us-central1-recipeturnik-v2.cloudfunctions.net/getRecipes/'+machineId,
        dataType:'json',
        success:function(data){          
            //createRecipes(data);
            addDrinksDOM(data)
            hideSpinner();
        }
    });
}
//Get data for Flow chart
function loadJsonFlow(index){
    showSpiner();
    var machineId= $('#machine-ul li .active').attr('id');

    $.ajax({
        type:'GET',              
        url:'https://us-central1-recipeturnik-v2.cloudfunctions.net/getFlow/'+machineId+'/'+index,
        dataType:"json",       
        success:function(data){                     
            initFlowChart(data);
            hideSpinner()
        }
    });
}
//Get data for avg. chart 
function loadChartJson (machineId) {
    showSpiner();
    $.ajax({
        type:'GET',              
        url:'https://us-central1-recipeturnik-v2.cloudfunctions.net/getInfo/'+machineId,
        dataType:"json",       
        success:function(data){                     
            initChart(data);
            hideSpinner();
        }
    });
}

function getMachineProfile(machineId){

    showSpiner();
    $.ajax({
        type:'GET',              
        url:'https://us-central1-recipeturnik-v2.cloudfunctions.net/getMachineProfile/'+machineId,
        dataType:"json",      
        success:function(data){                     
            addDomMachineProfile(data);
            hideSpinner();
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
            maintainAspectRatio: false,
            responsive: true,
            onClick:function(event){
                var activePoints = myLineChart.getElementsAtEvent(event);
                if(typeof activePoints != "undefined" && activePoints != null && activePoints.length != null && activePoints.length > 0){

                    var index=activePoints[0]._index;
                    
                    loadJsonFlow(index)
                    var currIndex=index+1;
                    addBreadcrumb("Flow: "+ currIndex)
                }
                
            }
        }
        });
}

//Flow chart
function initFlowChart(data){

    $('#main-container').empty();
    $('#main-container').append($('<div></div>').addClass('container-fluid chart-size').append($('<canvas></canvas>').attr('id','lineChart')))
    //$('#main-container').append($('<canvas></canvas>').attr('id','lineChart'))

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
            maintainAspectRatio: false,
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
    $('#main-container').append($('<div></div>').addClass('container-fluid chart-size').append($('<canvas></canvas>').attr('id','drinksChart')))
    //$('#main-container').append($('<canvas></canvas>').attr('id','drinksChart'))

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
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(0, 255, 255,0.2)',
                    'rgba(191, 0, 255,0.2)',
                    'rgba(102, 255, 153,0.2)',
                    'rgba(255, 102, 140,0.2)',
                    'rgb(255, 255, 0,0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(0, 255, 255)',
                    'rgba(191, 0, 255)',
                    'rgba(102, 255, 153)',
                    'rgba(255, 102, 140)',
                    'rgb(255, 255, 0)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
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

//---------------------------------------------------END CHARTS-----------------------------------------------


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
                        .attr('href', '#espress-system-history')
                        .attr('id','system-history-btn')                        
                        .text('Espresso System History')
                        .on('click',function(){                         
                            ESHButton();
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
                        .attr('href', '#machine-profile')
                        .attr('id','machine-profile-btn')                         
                        .text('Machine Profile')
                        .on('click', function(){
                            machineProfileBtn()
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
                        .attr('href', '#recipe')
                        .attr('id','recipe-btn')                         
                        .text('Recipe')
                        .on('click',function(){
                            recipeButton();
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
        if(data[recipe]['Position']>0){
            sortedData.push([recipe,data[recipe]['Position']]);
        }      
    }

    sortedData.sort(function(a,b){
        return a[1]-b[1];
    });

   
    $('#main-container')
        .append($('<div></div>').addClass('carousel-control-prev zi-1').append($('<a></a>').attr('href','#prev-page').attr('id','prev-page').attr('data-slide','prev')
            .append($('<img>').attr('src','assets/pointer_left.png'))))
        .append($('<div></div>').addClass('carousel-control-next zi-1').append($('<a></a>').attr('href','#next-page').attr('id','next-page').attr('data-slide','next')
            .append($('<img>').attr('src','assets/pointer_right.png'))))
        .append($('<div></div>')
        .addClass('container-fluid min-ht')
        .append($('<div></div>').addClass('row').append($('<i></i>').addClass('fas fa-chart-bar fa-2x icon-pad-lt show-pointer')
            .on('click',function(){
                addBreadcrumb('Chart')
                initDrinkChart(data);

            })))
        .append($('<div></div>')
            .addClass('row text-center text-lg-left drinks-container')
            .attr('id','drinks-container')           
        )
    )
    $.each(sortedData,function(i,recipe){

        var currentRecipe=data[recipe[0]]

        var img=currentRecipe[3];

        $('#drinks-container')
            .append($('<div></div>')
            .addClass('col-lg-3 col-md-4 col-xs-6 drink-item')
                .append($('<a></a>')
                .addClass('d-block mb-4 h-90 d-flex justify-content-center marg-b-0')
                .attr('href','#')
                    .append($('<div></div>').addClass('centered').text(currentRecipe[5]))
                    .append($('<img>')
                    .addClass('drink-img img-fluid img-thumbnail')
                    .attr('src','assets/'+img)
                    .attr('alt','')
                    .on('click',function(){
                        
                        initModal(currentRecipe,recipe[0]);

                    })    
                )
            ).append($('<div></div>').addClass('d-flex justify-content-center ').append($('<span></span>').addClass('drink-title').text(recipe[0])))        
        )

    })

    pagination();
    
}

//Add links to breadcrumb
function addBreadcrumb(item){

    var prevIndex=$('#breadcrumb .breadcrumb-item').last().text();
    $('#breadcrumb .breadcrumb-item').last().remove();
    $('#breadcrumb').append($('<a></a>').addClass('breadcrumb-item').attr('href','#').text(prevIndex).on('click',function(){
        var currentIndex=$(this);
        currentIndex.addClass('selected')
        breadcrumbProccess(this.text)

    }));
    $('#breadcrumb').append($('<span></span>').addClass('breadcrumb-item').text(item));

}

//Add machine link to breadcrumb
function addMachineBreadcrumb(item){

    $('#breadcrumb').empty()
    $('#breadcrumb').append($('<a></a>').addClass('breadcrumb-item').attr('href','#').text('Home').on('click',function(){
        breadcrumbProccess(this.text)
    }));
    $('#breadcrumb').append($('<span></span>').addClass('breadcrumb-item active').text(item));

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
//Machine Profile container
function addDomMachineProfile(data){

    
    var serialNumber=data['Serial Number']['1']
    var softVersion=data['Software Version']['1']
    var location=data['Location']['1']
    var totalCounter=data['Total Counter']['1']

    var errors=data['Errors'];
    var errorCounter=0;
    $.each(errors,function(){
        errorCounter++;
    })
    

    var machineId= $('#machine-ul li .active').attr('id');

    $('#main-container')
        .append($('<div></div>')
        .addClass('container d-flex justify-content-center')
        .append($('<div></div>')
            .addClass('card col-lg-6 col-md-6 col-sm-12')
            .append($('<div></div>')
            .addClass('card-header row menu-header')                    
            )               
        .append($('<div></div>')
            .addClass('card-body')
                .append($('<div></div>')
                    .attr('id','machine-profile-list')
                    .addClass('list-group list-group-flush')
                        .append($('<a></a>')
                        .addClass('list-group-item list-group-item-action')
                        .attr('href','#')
                        .text('Serial Number')
                            .append($('<span></span>')
                            .addClass('float-right mch-profile-item')
                            .text(serialNumber)
                            )
                    )
                    .append($('<a></a>')
                        .addClass('list-group-item list-group-item-action')
                        .attr('href','#')
                        .text('Software version')
                            .append($('<span></span>')
                            .addClass('float-right mch-profile-item')
                            .text(softVersion)
                            )
                    )
                    .append($('<a></a>')
                        .addClass('list-group-item list-group-item-action')
                        .attr('href','#')
                        .text('Location')
                            .append($('<span></span>')
                            .addClass('float-right mch-profile-item')
                            .text(location))
                    )
                    .append($('<a></a>')
                        .addClass('list-group-item list-group-item-action')
                        .attr('href','#')
                        .text('Total counter')
                            .append($('<span></span>')
                            .addClass('badge badge-primary badge-pill float-right')
                            .text(totalCounter)
                            )
                    )
                )
            )
        )
    )

    $.each(errors,function(i,err){

        if(err==='OK'){
            $('#machine-profile-list').append($('<a></a>').addClass('list-group-item list-group-item-action').attr('href','#').text(i)
            .append($('<span></span>').addClass('float-right mch-profile-item alright').text(err)))    
        }else{
            $('#machine-profile-list').append($('<a></a>').addClass('list-group-item list-group-item-action').attr('href','#').text(i)
            .append($('<span></span>').addClass('float-right mch-profile-item false').text(err)))  
        }
       
    })
    

}
function showSpiner(){

    $('.spinner').show();

}
function hideSpinner(){
    $('.spinner').hide();
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
         $('.drinks-container .drink-item').hide();
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
         $('.drinks-container .drink-item').hide();
         var grandTotal = limitPerPage * currentPage;

         for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
           $(".drinks-container .drink-item:eq(" + i + ")").show();
         }

       }

     })
}


function search(){

    $(document).ready(function(){
        $("#search-machine").on("keyup", function() {
          var value = $(this).val().toLowerCase();
          
          $("#machine-ul li:gt(1)").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
        });
    });

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
//Handle espresso system history button
function ESHButton(){
    
    $('#main-container').empty();
    $('#main-container').append($('<div></div>').addClass('container-fluid chart-size').append($('<canvas></canvas>').attr('id','lineChart')))
    //$('#main-container').append($('<canvas></canvas>').attr('id','lineChart'));
    var machineId= $('#machine-ul li .active').attr('id');
    loadChartJson(machineId);
    var bc='Espresso System History';
    addBreadcrumb(bc) ;

}

function machineProfileBtn(){

    $('#main-container').empty();
    var machineId= $('#machine-ul li .active').attr('id');
    addBreadcrumb('Machine Profile');
    getMachineProfile(machineId);

}

//Home breatcrumb link
function homeBreadcrumb(){
    $('#main-container').empty()
    $('#breadcrumb').empty()
    $('#breadcrumb').append('<span></span>').addClass('breadcrumb-item active').text('Home')
    $('#machine-ul li .active').removeClass('active');
    $('#homeLink').addClass('active');

}
//Handle recipe button
function recipeButton(){

    $('#main-container').empty();
    //addDOMRecipe();
    var machineId= $('#machine-ul li .active').attr('id');
    getRecipes(machineId);
    addBreadcrumb('Recipe');
}

//Handle onClick breadcrumb link
function breadcrumbProccess(item){

    $('.selected').nextAll().remove()
    $('.selected').remove()

    switch(item){

        case 'Home':
            homeBreadcrumb();
            return;
        case 'Espresso System History':
            ESHButton();
            return;
        case 'Recipe':
            recipeButton();
            return;
            default:
                $('#main-container').empty()                
                addMachineBreadcrumb($('#machine-ul li .active').text())
                loadButtons();
            return;            
    }       

}
//---------------------------------------------------END METHODS-------------------------------------------------------










