const container = document.querySelector(".container");

const spellSearch = document.querySelector("#search_input");

const URL = "https://www.dnd5eapi.co";

let spellsMap = [];

const cardContent = `
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
        container.textContent = "Loading..."
        container.style.cursor = "wait";
    }
    else 
    {
        spellSearch.removeAttribute('disabled');
        spellSearch.style.cursor = "";
        container.textContent = "";
        container.style.cursor = "";
    }
}

const loadPage = async () =>
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
    container.innerHTML = '';

    item.forEach((spell) => {
    const card = document.createElement("div");
    card.classList = "cards";

    card.innerHTML = cardContent;

    container.appendChild(card);

    cardsInfo(card, spell);

    spellSchoolColor(card, spell);

    card.addEventListener("click", (e) => {newPageSpell(spell)});
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

    card.querySelector(".spell_range").textContent = `Range: ${spell.range}`;
    
    const classes = spell.classes.map((cls) => cls.name).join(", ");
    card.querySelector(".spell_classes").textContent = `Classes: ${classes}`;
}

const spellSchoolColor = (card, spell) =>
{
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

function searchSpells(query) {

    const lowerCaseQuery = query.toLowerCase();

    const filteredSpells = spellsMap.filter(spell =>
        spell.name.toLowerCase().includes(lowerCaseQuery) ||
        spell.school.name.toLowerCase().includes(lowerCaseQuery) ||
        spell.level == Number(lowerCaseQuery) || 
        spell.classes.some(cls => cls.name.toLowerCase().includes(lowerCaseQuery))
    );

    console.log(filteredSpells);
    return filteredSpells;
}

spellSearch.addEventListener('input', (e) => {
    const query = e.target.value;
    const results = searchSpells(query);
    
    renderCards(results);
});

function newPageSpell(spell)
{
    var opened = window.open("");
    opened.document.write(`
        <html>
            <head>
            <link rel="stylesheet" href="./spells-style.css">
                <title>${spell.name}</title>
            </head>
            <body class="${spell.school.name}">
                <li class="innertext">
                    <h1 class="spell_name">${spell.name}</h1>
                    <h2 class="spell_school">${spell.school.name}</h2>
                    <p class="spell_lvl">${spell.level > 0 ? "Level: " + spell.level : "Cantrip"}</p>
                    <p class="spell_classes">${spell.classes.map((cls) => cls.name).join(", ")}</p>
                    <p class="casting_time">Casting Time: ${spell.casting_time}</p>
                    <p class="spell_range">Range: ${spell.range}</p>
                    <p class="spell_components">${spell.components} ${spell.material ? `(${spell.material})` : ""}</p>
                    <p class="spell_duration"><b>Duration:<br></b>${spell.duration}</p>
                    <p class="description"><b>Description:<br></b> ${spell.desc}</p>
                    <p class="higherLevel">${spell.higher_level[0] ? `<b>At Higher Levels:<br></b> ${spell.higher_level}` : ""}</p>
                </li>
            </body>
        </html>`);
}

window.onload = loadPage;
