'use strict';

const optionsContent = [];

getAllOptions();

function getAllOptions() {
    document.querySelectorAll("option")
        .forEach((elem) => optionsContent.push(elem.innerText));
}

const selectedOptions = [];

const optionsElements = document.querySelectorAll("option");

const selectedList = document.querySelector(".selected");

// При изменении выбранных опций производим обновление
function updateSelectedList() {
    selectedList.innerHTML = "";
    selectedOptions.forEach(elem => {
        const newItem = document.createElement("div");
        newItem.innerText = elem;
        selectedList.append(newItem);
    })
}

optionsElements.forEach(elem => {
    // изменяем поведение стандартных select и options
    elem.addEventListener("mousedown", e => {
        e.preventDefault();
        let option = e.target;
        let optionLevel = option.dataset.level;
        if (!optionLevel) optionLevel = 1;
        let nextOption = option.nextElementSibling || option;
        let nextOptionLevel = nextOption.dataset.level || 1;
        if (option.hasAttribute('selected')) {
            do {
                option.removeAttribute('selected');
                const index = selectedOptions.indexOf(option.innerText);
                if (index > -1) {
                    selectedOptions.splice(index, 1);
                }
                option = option.nextElementSibling;
                if (!option) {
                    updateSelectedList();
                    return;
                }
                nextOptionLevel = option.dataset.level || 1;
            } while (optionLevel < nextOptionLevel);
        }
        else {
            do {
                option.setAttribute('selected', '');
                selectedOptions.push(option.innerText);
                option = option.nextElementSibling;
                if (!option) {
                    updateSelectedList();
                    return;
                }
                nextOptionLevel = option.dataset.level || 1;
            } while (optionLevel < nextOptionLevel);

        }
        updateSelectedList();
    })
});

const optionsCache = [];
//TODO Сделать фильтрацию с детьми

// Фильтруем options по значению input
function filterItems() {
    const value = document.querySelector("input").value.toLowerCase();
    let opt, sel = document.querySelector("select");
    if (value == '') {
        restoreOptions();
    } else {
        // Проходим по опциям в обратном направлениии, чтобы отфильтровать
        restoreOptions();
        for (let i=sel.options.length-1; i>=0; i--) {
            opt = sel.options[i];
            if (opt.text.toLowerCase().indexOf(value) == -1){
                sel.removeChild(opt)
            }
        }
    }
}

// Восстанавливаем оригинальные опции
function restoreOptions(){
    const sel = document.querySelector('select');
    sel.options.length = 0;
    for (let i=0, iLen=optionsCache.length; i<iLen; i++) {
        sel.appendChild(optionsCache[i]);
    }
}

window.onload = function() {
    // Кэшируем опции
    const sel = document.querySelector('select');
    for (let i = 0, iLen = sel.options.length; i < iLen; i++) {
        optionsCache.push(sel.options[i]);
    }
}

