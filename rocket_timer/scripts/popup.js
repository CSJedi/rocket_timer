
var date_array = new Map();

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get('key', function(result) {
        if (typeof result.key !== 'undefined'){
            date_array = new Map(JSON.parse(result.key))
            start_timers();
          }
      });
     
        loadLaunches(0);
        load();
        document.querySelector('#start').addEventListener('click', start_timers);
   
});

function show(section)
{
    var items = document.getElementsByClassName(section);
    for(var i=0; i< items.length; i++)
        items[i].style.display = "block";
}

function hide(section)
{
    var items = document.getElementsByClassName(section);
    for(var i=0; i< items.length; i++)
        items[i].style.display = "none";
}

var loadLaunches = function(id)
{   
    var xhr = new XMLHttpRequest();
    var url = "https://api.spacexdata.com/v3/launches/upcoming?sort=launch_date_local";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            var del = -1;
            for(var y = 0; y < json.length; y++)
            {
                launch_date = json[y].launch_date_local;
                launch_date = launch_date.substring(0, launch_date.length-6).replace("T", " ");
                if(new Date(launch_date) < new Date())del=y;
            }
            json.splice(0, del+1);
            var start = 0;
            var end = 5;
            for(var x=0;x<id;x++){
                start+=5;
                end+=5;
                if(end>json.length)
                    end=json.length;
            }
            if (!document.getElementById("total-count").hasChildNodes())
                document.getElementById("total-count").appendChild(document.createTextNode(json.length));
            var st = 0;
            var en = 5;
            let pagination = document.getElementById("pagination");
            while (pagination.firstChild) {
                pagination.removeChild(pagination.firstChild);
            }
            for(var y = 0; y < (json.length/5); y++)
            {
                var a = document.createElement("a");
                a.appendChild(document.createTextNode(y+1));
                a.setAttribute("id", y);
                a.addEventListener('click', function() {
                    loadLaunches(this.id);
                });
                st+=5;
                en+=5;
                if(en>json.length)en=json.length;
                var li = document.createElement("li");
                if(start/5 == y){
                    var span = document.createElement("span");
                    span.setAttribute("class", "sr-only");
                    span.appendChild(document.createTextNode("(current)"));
                    a.appendChild(span);
                    li.setAttribute("class", "active");
                }
                li.appendChild(a);
                pagination.appendChild(li);
            }
            st = 0;
            en = 5;
            let rocket_list = document.getElementById("rocket-launches-list");
            while (rocket_list.firstChild) {
                rocket_list.removeChild(rocket_list.firstChild);
            }


            for(var y = start; y < end; y++)
            {
                    var li = document.createElement("li");
                    li.classList.add("list-group-item");
                    var div = document.createElement("div");
                    div.classList.add("checkbox");
                    var input = document.createElement("input");
                    input.setAttribute("type", "checkbox");
                    input.setAttribute("id", json[y].flight_number);
                    input.setAttribute("class", json[y].launch_date_local);
                    if(date_array.has(json[y].flight_number.toString()))
                        input.checked = true;
                    input.addEventListener( 'change', function() {
                        if(this.checked)
                            date_array.set(this.id,this.className);  
                        else 
                            if(date_array.has(this.id))
                                date_array.delete(this.id);         
                    });
                    var label = document.createElement("label");
                    label.setAttribute("for", "checkbox"+y);
                    label.appendChild(document.createTextNode("Mission: "+json[y].mission_name+ "; Rocket: "+json[y].rocket.rocket_name+ ";"));
                    var p = document.createElement("p");
                    p.innerText = "Launch date: "+launch_date;
                    p.classList.add("launch-date");
                    label.appendChild(p);
                    div.appendChild(input);
                    div.appendChild(label);
                    li.appendChild(div);
                    document.getElementById("rocket-launches-list").appendChild(li);
            }
        }
    };
    xhr.send();
}

function load()
{
    hide("modify");
    show("settings");
    hide("display");  
}

function start_timers()
{
    if(date_array.size<=0)return;
    chrome.storage.sync.set({key: JSON.stringify([...date_array])});   
    let timer_container = document.getElementById("timer-container");
    while (timer_container.firstChild) {
        timer_container.removeChild(timer_container.firstChild);
    }
    new Countdown();
    date_array.forEach((num, index) => {
        var li = document.createElement("li");
        li.classList.add("list-group-item");
        var div_bar = document.createElement("div");
        div_bar.setAttribute("class", "bar");
        div_bar.setAttribute("id", "bar"+index);
        div_bar.setAttribute("style", "'width: 100%;'");
        li.appendChild(div_bar);
        timer_container.appendChild(li);
        num = num.substring(0, num.length-6).replace("T", " ");
        new Countdown({
            selector: "#bar"+index,
            msgAfter: "Launch started!",
            msgPattern: "{days} days {hours} hours {minutes} minutes {seconds} seconds before launch!",
            dateStart: new Date(),
            dateEnd: new Date(num)
        });
 
    });    
    if(!document.getElementById("back")){
        var back_button =  document.createElement("button");
        back_button.setAttribute("class", "btn btn-primary");
        back_button.setAttribute("id", "back");
        var i =  document.createElement("i");
        i.setAttribute("class", "icon-back icon-white");
        back_button.appendChild(i);
        back_button.addEventListener('click', back);
        document.getElementsByClassName("display")[0].appendChild(back_button);
    }
    hide("settings");
    show("modify");
    show("display"); 
}

function back()
{
    hide("display");   
    show("settings");
    hide("modify");
}
