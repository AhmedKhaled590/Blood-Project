window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('#circle').style.display = 'none';
    },2000)
})


$(document).ready(function () {
    $(".container-fluid").fadeIn(3000, () => {
        $(".table").fadeIn(3000);
    })
});