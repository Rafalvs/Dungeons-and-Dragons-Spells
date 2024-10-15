const container = document.querySelector(".container");

const spellSearch = document.querySelector("#search_input");
const buttonSearch = document.querySelector("#button_search");

const URL = "https://www.dnd5eapi.co";

let spellsMap = [];

const getAllSpells = async () =>
{
    const spellIndexes = await fetch("https://www.dnd5eapi.co/api/spells").then((response) =>
    response.json()
    );
    const data = Promise.all(
    spellIndexes.results.map((index) =>
        fetch(URL + index.url).then((response) => response.json())
    )
    );
    return data;
}

const styleWhileLoading = (boolean) =>
{
    if (boolean === true)
    {
        spellSearch.setAttribute('disabled', 'disabled');
        spellSearch.style.cursor = "wait";
        buttonSearch.setAttribute('disabled', 'disabled');
        buttonSearch.style.cursor = "wait";
        container.textContent = "Loading..."
        container.style.cursor = "wait";
    }
    else 
    {
        spellSearch.removeAttribute('disabled');
        spellSearch.style.cursor = "";
        buttonSearch.removeAttribute("disabled");
        buttonSearch.style.cursor = "";
        container.textContent = "";
        container.style.cursor = "";
    }
}

const load = async () =>
{
    styleWhileLoading(true);

    const APIResponse = await getAllSpells();
    console.log(APIResponse);

    if (APIResponse)
    {
        styleWhileLoading(false);   
    }

    spellsMap = APIResponse.map((spells) => spells);
    renderCards(APIResponse);
}
    
const renderCards = (item) => 
{
    item.forEach((spell) => {
    const card = document.createElement("div");
    card.classList = "cards";

    const content = `
    <li>
        <h1 class="spell_name">Spell Name</h1>
        <br>
        <p class="spell_school">Spell School</p>
        <br>
        <p class="spell_lvl">Spell Level</p>
        <br>
        <p class="spell_components">Spell Components</p>
        <br>
        <p class="spell_duration">Spell Duration</p>
        <br>
        <p class="spell_range">Spell Range</p>
        <br>
        <p class="spell_classes">Spell Class</p>
    </li>
    `;

    card.innerHTML = content;

    container.appendChild(card);

    cardsInfo(card, spell);

    spellSchoolColor(card, spell);
  });
}

const cardsInfo = (card, spell) =>
{
    card.querySelector(".spell_name").textContent = spell.name;
    card.querySelector(".spell_school").textContent = spell.school.name;

    if (spell.level > 0)
    {
        card.querySelector(".spell_lvl").textContent = `Level: ${spell.level}`;
    }
    else
    {
        card.querySelector(".spell_lvl").textContent = "Cantrip";
    }

    const components = spell.components.map((cmp) => cmp).join(", ");
    card.querySelector(".spell_components").textContent = `Components: ${components}`;

    if (spell.concentration === true)
    {
        card.querySelector(".spell_duration").textContent = `Duration: Concentration, ${spell.duration}`;
    }
    else
    {
        card.querySelector(".spell_duration").textContent = `Duration: ${spell.duration}`;
    }

    card.querySelector(".spell_range").textContent = `Range ${spell.range}`;
    
    const classes = spell.classes.map((cls) => cls.name).join(", ");
    card.querySelector(".spell_classes").textContent = `Classes: ${classes}`;
}

const spellSchoolColor = (card, spell) => {
    switch(spell.school.name)
    {
        case "Abjuration":
            card.classList.add("abjuration");
            break;
        case "Illusion":
            card.classList.add("illusion");
            break;
        case "Enchantment":
            card.classList.add("enchantment");
            break;
        case "Divination":
            card.classList.add("divination");
            break;
        case "Evocation":
            card.classList.add("evocation");
            break;
        case "Transmutation":
            card.classList.add("transmutation");
            break;
        case "Necromancy":
            card.classList.add("necromancy");
            break;
        case "Conjuration":
            card.classList.add("conjuration");
            break;
        default:
            console.log("Escola não reconhecida:", spell.school.name);
    }
}

load();


/*
objetivos

1 - filtro: buscar as spells por qualquer atributo

2 - clicar na spell e abrir uma página com mais detalhes dela

*/