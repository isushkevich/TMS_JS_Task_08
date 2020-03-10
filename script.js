"use strict";


const toggleButton = () => button.disabled = !(input.value !== "" && selector.selectedIndex);


const input = document.getElementById("input");
input.addEventListener("input", toggleButton);

const selector = document.getElementById('selector');
selector.addEventListener("change", toggleButton);

const button = document.getElementById('button');
button.addEventListener("click", getCalculation);

const text = document.getElementById("text");
text.innerText = "Enter amount of BYN and select currency.";


let curreniesCodes = [319, 328, 346, 292];


async function addOptions() {
    for (let i = 0; i < curreniesCodes.length; i++) {
        const response = await fetch("http://www.nbrb.by/api/exrates/rates/" + curreniesCodes[i])
        const data = await response.json();

        let tempEl = document.createElement("option");
        selector.appendChild(tempEl);
        tempEl.innerText = data.Cur_Abbreviation;
        tempEl.setAttribute("data-curr-id", curreniesCodes[i]);
    }
}


addOptions();


async function getCalculation() {
    const id = selector.options[selector.selectedIndex].dataset.currId;

    const response = await fetch("http://www.nbrb.by/api/exrates/rates/" + id)
    const data = await response.json();
    const response2 = await fetch("http://www.nbrb.by/api/exrates/currencies/" + id)
    const data2 = await response2.json();

    const amount = document.getElementById("input").value;
    const calculated = (amount * data.Cur_Scale / data.Cur_OfficialRate).toFixed(2);
    const fullName = data2.Cur_Name_EngMulti;
    const time = (new Date(data.Date)).toLocaleDateString();

    const string = "You can buy " + calculated + " " + fullName + " for " + amount + " BYN" + " -- " + time;

    text.innerText = string;
}