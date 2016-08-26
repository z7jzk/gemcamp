function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            var str = decodeURIComponent(pair[1]);
            if (str.indexOf('+') >= 0) {
                str = str.replace('+', ' ');
            }
            return str;
        }
    }
    
    return undefined;
}