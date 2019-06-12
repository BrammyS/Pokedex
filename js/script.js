let previousUrl = "";
let nextUrl = "";
let selectedPokemon = 1;
let totalPokemons = 964;

$( document ).ready(function() {
    GetPokeDetails(selectedPokemon);
    GetPokePage("https://pokeapi.co/api/v2/pokemon/");
    $( "#PreviousButton" ).click(function() {
        if(previousUrl != null) GetPokePage(previousUrl);
    });
    $( "#NextButton" ).click(function() {
        if(nextUrl != null) GetPokePage(nextUrl);
    });
    $( "#PreviousPokemon" ).click(function() {
        if(selectedPokemon != 1) {
            selectedPokemon--;
            GetPokeDetails(selectedPokemon);
        }
    });
    $( "#NextPokemon" ).click(function() {
        if(selectedPokemon != totalPokemons) {
            selectedPokemon++;
            GetPokeDetails(selectedPokemon);
        }
    });
});

function GetPokePage(url){
    $.ajax({
        url: url,
        cache: true
    }).done(function( data ) {
        appendPokeDexPage(data);
    });
}

function GetPokeDetails(id){
    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + id + "/",
        cache: true
    }).done(function( data ) {
        appendPokeDetail(data);
    });
}

function appendPokeDexPage(data){
    nextUrl = data.next;
    previousUrl = data.previous;

    let content = "<div class=\"d-flex flex-row justify-content-center\">";
    $.each( data.results, function( key, pokemon ) {
        const id = pokemon.url.substr(34).replace("/", "");
        console.log( id + ": " + pokemon.name );
        if(key == 6 || key == 12 || key == 18) {
            content +=  "</div>" +
                "<div class=\"d-flex flex-row justify-content-center\">";
        }
        content +=
            "<div class=\"flex-column rounded shadow pokemon border d-flex justify-content-center\" onclick='GetPokeDetails(" + id + ")'>" +
            "    <img class='pokemonImg' src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + id + ".png\">" +
            "    <h5>" + id + ". " + pokemon.name + "</h5>" +
            "</div>";
    });
    content += "</div>";
    $( ".pokemons").empty();
    $( ".pokemons").append(content);
}

function appendPokeDetail(data) {
    selectedPokemon = data.id;
    let stats = "";
    $.each( data.stats, function( key, stat ) {
        stats += stat.stat.name + ": " + stat.base_stat;
        if(key !== data.stats.length -1) stats += ", <br>";
    });

    let types = "";
    $.each( data.types, function( key, type ) {
        types += type.type.name;
        if(key !== data.types.length -1) types += ", <br>";
    });

    let abilities = "";
    $.each( data.abilities, function( key, ability ) {
        abilities += ability.ability.name;
        if(key !== data.abilities.length -1) abilities += ", <br>";
    });
    $( "#selectedPokemonImg").empty();
    $( "#selectedPokemonImg").attr("src", data.sprites.front_default);
    $( "#selectedPokemonName").empty();
    $( "#selectedPokemonName").append(data.name);
    $( "#detailContent").empty();
    $( "#detailContent").append(
        "<tr>" +
        "   <th scope=\"row\">" + data.id + "</th>" +
        "   <td>" + types + "</td>" +
        "   <td>" + abilities + "</td>" +
        "   <td>" + stats + "</td>" +
        "</tr>"
    );

}
