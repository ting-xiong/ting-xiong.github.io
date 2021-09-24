var previousPage = 0;
var currentPage = 0;

var imagePreviewBlock = 0;

function isAtPage(page) {
    const delta = document.body.scrollHeight / 3;
    return page * delta <= document.body.scrollTop && (page + 1 ) * delta > document.body.scrollTop;
}

function loadPage(page) {
    if (page == 0) {
        var effects = "animate__animated animate__fadeInDown";

        $("#model-buttons").css("visibility", "visible");
        // $("#model-buttons").addClass(effects);
        // $("#model-buttons").on('animationend', () => {
        //     $("#model-buttons").removeClass(effects);
        // });
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

// Second page menu

var innerWindowFolded = false;

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

function shrinkMenu(menu, hasTransition) {
    if (hasTransition) {
        menu.classList.remove('notransition');
    } else {
        menu.classList.add('notransition');
    }
    menu.style.transform = "scale(1, 0)";
    menu.style.visibility = "hidden";
    menu.style.height = "0";
    menu.style.marginTop = "-20px";
}

function expandMenu(menu, hasTransition) {
    if (hasTransition) {
        menu.classList.remove('notransition');
    } else {
        menu.classList.add('notransition');
    }
    menu.style.transform = "scale(1, 1)";
    menu.style.visibility = "visible";
    menu.style.height = "auto";
    menu.style.marginTop = "0";
}

function toggleInnerMenu(button) {
    var menu = document.getElementById("inner-menu");
    if (menu.style.visibility !== "visible") {
        button.innerHTML = "&#9650; Fold category selection &#9650;";
        expandMenu(menu, true);
        innerWindowFolded = false;
    } else {
        button.innerHTML = "&#9660; Click to see my other works &#9660;";
        shrinkMenu(menu, true);
        innerWindowFolded = true;
    }
}

// rotating model buttons

var rotationNumber = 0;
var showNumber = 0;
var modelNumber = 0;
var isPaused = false;
var tmpIdx = 0;

function initRotation() {
    var container = document.getElementById("model-buttons");
    modelNumber = container.children.length;
    if (document.body.clientWidth > 1280) {
        showNumber = 4;
    } else if (document.body.clientWidth > 768) {
        showNumber = 3;
    } else {
        showNumber = 2;
    }

    var models = [];
    for (var i = 0; i < modelNumber; i++) {
        var modelIndex = i + 1 + rotationNumber;
        if (modelIndex > modelNumber) {
            modelIndex -= modelNumber;
        }
        models.push(document.getElementById("model-" + modelIndex));
    }
    for (var i = 0; i < models.length; i++) {
        if (i < showNumber) {
            models[i].style.visibility = "visible";
            // models[i].style.display = "block";
            models[i].style.opacity = "1";
        } else {
            models[i].style.visibility = "hidden";
            models[i].style.opacity = "0";
            // models[i].style.display = "none";
        }
    }
}

function onResize() {
    var menu = document.getElementById("inner-menu");
    if (document.body.clientWidth > 768) {
        expandMenu(menu);
    } else {
        if (innerWindowFolded) {
            shrinkMenu(menu, false);
        } else {
            expandMenu(menu, false);
        }
    }

    initRotation();
    calculateModelsPositions(rotationNumber, modelNumber, showNumber);
}

function calculateModelsPositions(rotationNumber, modelNumber, showNumber) {
    var models = [];
    for (var i = 0; i < modelNumber; i++) {
        var modelIndex = i + 1 + rotationNumber;
        if (modelIndex > modelNumber) {
            modelIndex -= modelNumber;
        }
        models.push(document.getElementById("model-" + modelIndex));
    }
    var single_offset = Math.max(Math.min(document.body.clientWidth / showNumber, 200), 0);
    for (var i = 0; i < models.length; i++) {
        if (i < showNumber) {
            // models[i].style.display = "block";
            models[i].style.visibility = "visible";
            models[i].style.opacity = "1";
        } else {
            models[i].style.opacity = "0";
            models[i].style.visibility = "hidden";
            // models[i].style.display = "none";
        }

        var offset = single_offset * (i - (showNumber - 1) / 2);
        if (showNumber < modelNumber && i === models.length - 1) {
            var tmpOffset = single_offset * (-1 - (showNumber - 1) / 2);
            models[i].style.transform = "translate(" + tmpOffset + "px, 0)";
            tmpIdx = i;
            setTimeout(function() {
                models[tmpIdx].style.transform = "translate(" + offset + "px, 0)";
            }, 500);
        } else {
            models[i].style.transform = "translate(" + offset + "px, 0)";
        }
    }
}

$(document).ready(function() {
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

    $(".model-button").hover(function(){
       isPaused = !isPaused;
    });

    // Rotate model
    initRotation();
    calculateModelsPositions(rotationNumber, modelNumber, showNumber);
    window.setInterval(function() {
        if(!isPaused) {
            rotationNumber += 1;
            if (rotationNumber >= modelNumber) {
                rotationNumber = 0;
            }
            calculateModelsPositions(rotationNumber, modelNumber, showNumber);
        }
    }, 3000);
});