function request(){
    var xhr = new XMLHttpRequest();
    var url = "https://api.spacexdata.com/v3/launches";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            for(var y = 0; y < json.length; y++)
            {
                if(json[y].links.flickr_images[0] != null)
                {

                    var li_indicator = $("<li data-target='#carousel-example-multi' data-slide-to='"+y+"' class='active'></li>");
                    $("#indicators").append(li_indicator);
                    var div_carousel = $("<div />", {
                        "class":"carousel-item"});
                    var div_col = $("<div />", {
                        "class":"col-12 col-md-12"});
                    var div_card = $("<div />", {
                        "class":"card mb-2"});
                    var img = $('<img class="card-img-top">');
                    //if(json[y].links.flickr_images[0] == null)
                        //img.attr('src', json[y].links.mission_patch);
                    //else
                        //img.attr('src', json[y].links.flickr_images[0]);
                    img.attr('src', json[y].links.flickr_images[0]);
                    var div_card_body = $("<div />", {
                        "class":"card-body text-center"});
                    var h4 = $("<h4 />", {
                        "class":"card-title font-weight-bold",
                        "text":"Mission name: "+json[y].mission_name}); 
                    var p = $("<p />", {
                        "class":"card-text",
                        "text":"Rocket name: "+json[y].rocket.rocket_name});
                    var p1 = $("<p />", {
                        "class":"card-text",
                        "text":"Launch year: "+json[y].launch_year});
                    var p2 = $("<p />", {
                        "class":"card-text",
                        "text":"Launch details: "+json[y].details});
                    var video_button = $("<a />", {
                        "class":"btn btn-primary btn-md btn-rounded",
                        "text":"Video",
                        "href":json[y].links.video_link,
                        "target":"_blank"});
                    var article_button = $("<a />", {
                        "class":"btn btn-primary btn-md btn-rounded",
                        "text":"Article about launch",
                        "href":json[y].links.article_link,
                        "target":"_blank"});
                    var wikipedia_button = $("<a />", {
                        "class":"btn btn-primary btn-md btn-rounded",
                        "text":"Wikipedia",
                        "href":json[y].links.wikipedia,
                        "target":"_blank"});
                    var prev = $("<a />", {
                        "class":"carousel-control-prev",
                        "href":"#carousel-example-multi",
                        "role":"button",
                        "data-slide":"prev"
                    });
                    var span = $("<span />", {
                        "class":"carousel-control-prev-icon",
                        "aria-hidden":"true"
                    });
                    var span2 = $("<span />", {
                        "class":"sr-only",
                        "Text":"Previous"
                    });
                    prev.append(span); 
                    prev.append(span2); 
                    var next = $("<a />", {
                        "class":"carousel-control-next",
                        "href":"#carousel-example-multi",
                        "role":"button",
                        "data-slide":"next"
                    });
                    var span3 = $("<span />", {
                        "class":"carousel-control-next-icon",
                        "aria-hidden":"true"
                    });
                    var span4 = $("<span />", {
                        "class":"sr-only",
                        "Text":"Nexr"
                    });
                    next.append(span3); 
                    next.append(span4);
                   
                    div_card_body.append(h4); 
                    div_card_body.append(p);
                    div_card_body.append(p1);
                    div_card_body.append(p2);
                    div_card_body.append(video_button);
                    div_card_body.append(article_button);
                    div_card_body.append(wikipedia_button);
                    div_card.append(img);
                    div_card.append(div_card_body);
                    div_col.append(div_card);
                    div_carousel.append(div_col);
                   
                    $("#launches").append(div_carousel);  
                    $("#launches").append(prev);
                    $("#launches").append(next);
                }
            }
            $(".carousel-item").first().addClass("active");
        }
    };
    xhr.send();
}