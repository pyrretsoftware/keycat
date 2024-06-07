let exampleoptions = {
    "Name" : "text"
}
function createPopup(title, options, callback, selectitems) {
    const newpopup = document.getElementsByClassName("editorpopupcontainer")[0].cloneNode(true);
    
    document.body.appendChild(newpopup);
    newpopup.children[0].children[0].innerHTML = title
    newpopup.style.display = "flex"

    let optionelements = {}
    Object.keys(options).forEach(optionitem => {
        const option = newpopup.children[0].children[1].cloneNode(true)
        optionelements[optionitem] = option
        newpopup.children[0].appendChild(option)
        option.children[0].innerHTML = optionitem + ": "
        if (options[optionitem] == "select") {
            option.children[1].remove()
            const newelement = document.createElement("select")
            option.appendChild(newelement)
            newelement.innerHTML = selectitems[optionitem]
        } else {
            option.children[1].type = options[optionitem]

        }
    });
    newpopup.children[0].children[1].remove()
    newpopup.children[0].appendChild(newpopup.children[1])
    Object.values(optionelements)[0].lastElementChild.focus()
    newpopup.children[0].lastElementChild.children[0].onclick = function() {
        Object.keys(optionelements).forEach(function(option) {
            optionelements[option] = optionelements[option].lastElementChild.value
        })
        console.log(optionelements)
        newpopup.remove()
        callback(optionelements)
    }
}