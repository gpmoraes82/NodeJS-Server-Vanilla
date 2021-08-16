//handler to request and receive data from client side 
function ajaxRequest( reqType, endDiv ) {

    document.getElementById( endDiv ).innerHTML = "<p>Loading ...</p>";

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        document.getElementById( endDiv ).innerHTML = this.responseText;
    }
    xhttp.open( "GET", reqType, true );
    xhttp.send();

}

