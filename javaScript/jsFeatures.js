document.addEventListener("DOMContentLoaded", () => { 

    //Slideshow for Projects
    let slideIndex = 1;
    
    //Jquery assigning functions to buttons
    $("#rightArrow").click(function() { nextProj(1) } );
    $("#leftArrow").click(function() { nextProj(-1) } );

    //slides right when clicked, 'n' decides how many times
    nextProj = (n) => showProjects(slideIndex += n);

    //current slide shown
    currentSlide = (n) => showProjects(slideIndex = n);

    showProjects = (n) => {
        const myProjects = document.querySelectorAll(".codeProjects");

        //Reset to 1 if max number of projects exceeds
        if (n > myProjects.length) { slideIndex = 1 }
        //Allows looping backwards
        if (n < 1) { slideIndex = myProjects.length }

        //Hides all projects
        for (let i = 0; i < myProjects.length; i++) {
            myProjects[i].style.display = "none";
        }
        //shows the project currently selected in the array
        myProjects[slideIndex-1].style.display = "block";
    }

    showProjects(slideIndex);

});