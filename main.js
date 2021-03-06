var previousPage = 0;
var currentPage = 0;

var cardIndex = 0;
var toggleState = false;

var imagePreviewBlock = 0;

var innerWindowFolded = true;

function isAtPage(page) {
    const delta = document.body.scrollHeight / 3;
    return page * delta <= document.body.scrollTop && (page + 1 ) * delta > document.body.scrollTop;
}

function loadPage(page) {
    if (page == 0) {
        var effects = "animate__animated animate__fadeInDown";

        $("#model-buttons").css("visibility", "visible");
        $("#model-buttons").addClass(effects);
        $("#model-buttons").on('animationend', () => {
            $("#model-buttons").removeClass(effects);
        });
    } else if (page == 1) {
        
    } else if (page == 2) {

    }
}

function leavePage(page) {
    if (page == 0) {
        // $("#model-buttons").css("visibility", "hidden");
    } else if (page == 1) {
        
    } else if (page == 2) {

    }
}

class SlideCard {
    constructor(parent) {
        this.namespace = "slidecard__";
        this.parent = parent;
        this.current = -1;
        this.fadeInEffects = "animate__fadeInLeft";
        this.fadeOutEffects = "animate__fadeOutRight";
        this.showTable = [false, false, false, false];

        var i = 0;
        var links = {
            "slidecard__card-1": "pages/project-spoiled-kids.html", 
            "slidecard__card-2": "pages/project-in-the-next-room.html", 
            "slidecard__card-3": "pages/project-orlando.html", 
            "slidecard__card-4": "pages/project-the-misanthrope.html",
        };
        var buttons = {
            1: "resources/icons/button.png",
            2: "resources/icons/ruler.png",
            3: "resources/icons/scissor.png",
            4: "resources/icons/cliper.png",
        }
        for (i of [1, 2, 3, 4]) {
            var card = "<div class='card animate__animated' id='" + this.getCardName(i) + "'>\
                       <button class='card-button'><img src='" + buttons[i] + "'></button>\
                       <img src='resources/images/card-" + String(i) + "-0.png'></div>";
            $("#" + parent).append(card);
            $("#" + this.getCardName(i)).css("visibility", "hidden");
        }

        $(".card").click(function(event) {
            event.stopPropagation();
        });

        $(".card-button").click(function(event) {
            var id = $(this).parent().attr('id');
            window.open(links[id]);
        });
    }

    getCardName(num) {
        return this.namespace + "card-" + String(num);
    }

    show(num) {
        if ([1, 2, 3, 4].includes(num)) {
            $("#" + this.getCardName(num)).off("animationend");
            $("#" + this.getCardName(num)).removeClass(this.fadeOutEffects);
            $("#" + this.getCardName(num)).addClass(this.fadeInEffects);
            $("#" + this.getCardName(num)).css("visibility", "visible");
            this.showTable[num - 1] = true;
            this.current = num;
        }
    }

    hide(num) {
        if ([1, 2, 3, 4].includes(num)) {
            $("#" + this.getCardName(num)).removeClass(this.fadeInEffects);
            $("#" + this.getCardName(num)).addClass(this.fadeOutEffects);
            $("#" + this.getCardName(num)).on("animationend", () => {
                $("#" + this.getCardName(num)).css("visibility", "hidden");
            });
            this.showTable[num - 1] = false;
            this.current = -1;
        }
    }

    hideAll() {
        var i = 0;
        for (i of [1, 2, 3, 4]) {
            if (this.showTable[i - 1]) {
                this.hide(i);
            }
        }
    }

    hideAllBut(num) {
        var i = 0;
        for (i of [1, 2, 3, 4]) {
            if (this.showTable[i - 1] && i != num) {
                this.hide(i);
            }
        }
    }
}

function toggleExpand(){
    if(toggleState==false){
        document.getElementById('toggle-items').style.transform='scaleX(1)';
        document.getElementById('toggle-button').style.transform='rotate(45deg)';
        toggleState=true;
    }
        else{
        document.getElementById('toggle-items').style.transform='scaleX(0)';
        document.getElementById('toggle-button').style.transform='rotate(0deg)';
        toggleState=false;
    }
}

function toggleBlocks(input){
    var blocks = document.getElementsByClassName("left-box-block");
    document.getElementsByClassName("inner-window-right")[0].scrollTop = 0;
    Array.prototype.forEach.call(blocks, function(b) {
        if (b.getAttribute("id") == input.getAttribute("tag") && input.checked) {
            b.style.display = "block";
        } else {
            b.style.display = "none";
        }
    });
}

function toggleInnerMenu(button) {
    var menu = document.getElementById("inner-menu");
    if (menu.style.display == "none" || menu.style.display == "") {
        button.innerHTML = "&#9650; Fold category selection &#9650;";
        menu.style.display = "block";
        innerWindowFolded = false;
    } else {
        button.innerHTML = "&#9660; Click to see my other works &#9660;";
        menu.style.display = "none";
        innerWindowFolded = true;
    }
}

function onResize() {
    var menu = document.getElementById("inner-menu");
    if (document.body.clientWidth > 768) {
        menu.style.display = "block";
    } else {
        if (innerWindowFolded) {
            menu.style.display = "none";
        } else {
            menu.style.display = "block";
        }
    }
}

$(document).ready(function() {
    let cards = new SlideCard("section-1");

    $(".model-button").hover(function() {
        if ($(this).is(":hover")) {
            for (i of [1, 2, 3, 4]) {
                if ($(this).attr('id') == ("model-" + String(i))) {
                    cards.hideAllBut(i);
                    cards.show(i);
                    break;
                }
            }
        }
    });

    $(".model-container").click(function(event) {
        event.stopPropagation();
    });

    $("#section-1").click(function() {
        cards.hideAll();
    });

    $(document.body).scroll(function() {
        for (i of [0, 1, 2]) {
            if (isAtPage(i)) {
                currentPage = i;
                break;
            }
        }

        if (currentPage != previousPage) {
            for (i of [0, 1, 2]) {
                if (previousPage ==i) {
                    leavePage(i);
                    break;
                }
            }
            for (i of [0, 1, 2]) {
                if (currentPage ==i) {
                    loadPage(i);
                    break;
                }
            }
            previousPage = currentPage;
        }
    });

    loadPage(0);

    var elements = document.getElementsByClassName('txt-rotate');
    var slides = document.getElementsByClassName('slideshow');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-rotate');
        var period = elements[i].getAttribute('data-period');
        var toSlide = slides[i].getAttribute('data-rotate');
        if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period, slides[i], JSON.parse(toSlide));
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #F26921 }";
    document.body.appendChild(css);

    var grid = document.getElementsByClassName('grid');
    for (let g of grid) {
        var images = JSON.parse(g.getAttribute("images"));
        var index = g.getAttribute("index");
        g.insertAdjacentHTML('beforeend', "\
            <div class='grid-col grid-col--1 cgc-" + index + "'></div>\
            <div class='grid-col grid-col--2 cgc-" + index + "'></div>\
            <div class='grid-col grid-col--3 cgc-" + index + "'></div>\
        ");
        var count = 0;
        images.images.forEach(i => {
            var child = "\
            <div class='grid-item cgi-" + index + "'>\
                    <div class='image-preview' block='" + g.getAttribute("index") + "' index='" + count + "'>\
                        <div class='magnify-glass'>\
                            <img src='resources/icons/zoom_in-24px.svg'>\
                        </div>\
                        <img class='boxed-img' src='" + i + "' >\
                    </div>\
                </div>\
            ";
            g.insertAdjacentHTML('beforeend', child);
            count++;
        });
        var colc1 = new Colcade( '.cg-' + index, {
            columns: '.cgc-' + index,
            items: '.cgi-' + index
        });
    }

    $(".image-preview").click(function(){
        $("#full-image").attr("src", $(this).find(".boxed-img").attr("src"));
        imagePreviewBlock = $(this).attr("block");
        $(".cg-" + imagePreviewBlock).first().attr("select-index", $(this).attr("index"));
        $('#image-viewer').show();
    });

    $("#image-viewer #close").click(function(){
        $('#image-viewer').hide();
    });
    
    $("#image-viewer #left").click(function(){
        var index = $(".cg-" + imagePreviewBlock).first().attr("select-index");
        var images = JSON.parse($(".cg-" + imagePreviewBlock).first().attr("images"));
        index--;
        if (index < 0) {
            index = images.images.length - 1;
        }
        $("#full-image").attr("src", images.images[index]);
        $(".cg-" + imagePreviewBlock).first().attr("select-index", index);
    });
    
    $("#image-viewer #right").click(function(){
        var index = $(".cg-" + imagePreviewBlock).first().attr("select-index");
        var images = JSON.parse($(".cg-" + imagePreviewBlock).first().attr("images"));
        index++;
        if (index >= images.images.length) {
            index = 0;
        }
        $("#full-image").attr("src", images.images[index]);
        $(".cg-" + imagePreviewBlock).first().attr("select-index", index);
    });
});