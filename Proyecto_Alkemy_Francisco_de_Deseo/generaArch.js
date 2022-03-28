const Pelicula_Serie = require("../JS_Alk/Pelicula_Serie");
const Genero = require("../JS_Alk/Genero");
const Personaje = require("../JS_Alk/Personaje");
const fs = require('fs');

var mickey = new Personaje("imagenMickey.png", "Mickey", 30, 30, "Es un raton dispuesto a hacer lo correcto dada la situación.", []);
var donald = new Personaje("imagenDonald.jpg", "Donald", 40, 40, "Es un pato que se enoja con facilidad", []);
var minnie = new Personaje("imagenMinnie.jpg", "Minnie", 30, 25, "Es un raton enamorada de Mickey", []);
var goofy = new Personaje("imagenGoofy.jpg", "Goofy", 45, 50, "Es un perro con mucho carisma", []);

var saludosAmigos = new Pelicula_Serie("imagenSaludosAmigos.jpg", "Saludos Amigos", 1943, 3, [goofy.id, donald.id]);
var chefDonald = new Pelicula_Serie("imagenChefDonald.jpg", "Chef Donald", 1941, 4, [donald.id]);
var Fantasia = new Pelicula_Serie("imagenFantasia.jpg", "Fantasía", 1940, 5, [mickey.id]);
var tresMosqueteros = new Pelicula_Serie("imagenTresMosqueteros.jpg", "Los Tres Mosqueteros", 2004, 2, [mickey.id, donald.id, minnie.id, goofy.id]);

var Aventura = new Genero("Aventura", "Aventura.jpg", [saludosAmigos.id, tresMosqueteros.id]);
var Musical = new Genero("Musical", "Musical.jpg", [Fantasia.id, tresMosqueteros.id]);
var Comedia = new Genero("Comedia", "Comedia.jpg", [chefDonald.id, tresMosqueteros.id]);

var personajes = {"Personajes": [mickey, donald, minnie, goofy]};
var peliculas = {"Peliculas_Series": [saludosAmigos, chefDonald, Fantasia, tresMosqueteros]};
var generos = {"Generos": [Aventura, Musical, Comedia]};

mickey.peliculas = [Fantasia.id, tresMosqueteros.id];
donald.peliculas = [saludosAmigos.id, chefDonald.id, tresMosqueteros.id];
minnie.peliculas = [tresMosqueteros.id];
goofy.peliculas = [saludosAmigos.id, tresMosqueteros.id];

fs.writeFile('data.json',JSON.stringify([personajes, peliculas, generos], null, 2), (err) => { 
    if (err) throw err; 
    console.log('The file has been saved!'); 
});