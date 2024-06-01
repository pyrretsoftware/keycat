Array.from(document.getElementsByClassName("ptext")).forEach(function(item) {
    item.addEventListener('input',function(e){
        if (item.value.replaceAll(" ", "").length % 2 == 0 && item.value.length != 8 && e["data"]) {
                item.value += " "
        } else if (item.value.replaceAll(" ", "").length % 2 == 0 && item.value.length != 8) {
            item.value = item.value.substring(0, item.value.length -1)
        }
    });
 });