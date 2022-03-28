const Pelicula_Serie = require("./JS_Alk/Pelicula_Serie");
const Genero = require("./JS_Alk/Genero");
const Personaje = require("./JS_Alk/Personaje");

var express = require('express');
var app = express();
var port=3000;

'use strict';

const fs = require('fs');

const nomArchPersonajes = "personajes.json";
const nomArchGeneros = "generos.json";
const nomArchPeliculas = "peliculas.json";

app.get("/characters", (req, res) => {
    let personajes = getDatos(nomArchPersonajes);
    let lista =  [];
    if ( JSON.stringify(req.query)=='{}'){
        personajes.forEach(element => { lista.push([element.imagen, element.nombre]); });
    }else{
        lista = personajes.filter(element => element.nombre==req.query.name || element.edad == req.query.age || element.peso == req.query.weight || (element.peliculas.filter(movie => movie==parseInt(req.query.movie))).length !=0);   
    }
    res.send(lista);
})
app.get("/movies", (req, res) => {
    var peliculas = getDatos(nomArchPeliculas);
    let generos = getDatos(nomArchGeneros);
    let lista =  [];
    if ( JSON.stringify(req.query)=='{}'){
        peliculas.forEach(element => {
            lista.push([element.imagen, element.titulo, element.fechaDeCreacion]);
        });
    }
    else if (estaDefinido(req.query.order)){
        if (req.query.order == "ASC"){
            lista = peliculas.sort( (a,b)=>a.fechaDeCreacion-b.fechaDeCreacion);
        }
        else if (req.query.order == "DESC"){
            lista = peliculas.sort( (a,b)=>b.fechaDeCreacion-a.fechaDeCreacion);
        }
        else{
            throw new Error("Error! Puede solo ingresar ASC/DESC"); 
        }
    }
    else if (estaDefinido(req.query.genre)){
        var genero = generos.find(genero => genero.id == parseInt(req.query.genre));
        if (!estaDefinido(genero)){
            throw new Error("Error! El genero ingresado no existe"); 
        }
        var lista_peliculas = genero.peliculas;
        lista = peliculas.filter(element => lista_peliculas.includes(element.id));
    }
    else if (estaDefinido(req.query.name)){
        lista = peliculas.filter(element => element.titulo==req.query.name );
    }else{
        throw new Error("Error! Ingrese los parametros correctamente"); 
    }
    res.send(lista);
})

app.post("/createCharacter", (req, res) => {
    let personajes = getDatos(nomArchPersonajes);
    cambioDatosPersonaje(req.headers);
    let nuevoPersonaje = new Personaje(req.headers.imagen, req.headers.nombre, req.headers.edad, req.headers.peso, req.headers.historia, req.headers.peliculas, personajes.length);
    personajes.push(nuevoPersonaje);
    actualizarDatos(nomArchPersonajes, personajes);
    res.send("Personaje Creado");
})
app.post("/createMovie", (req, res) => {
    console.log(req.headers);
    let peliculas = getDatos(nomArchPeliculas);
    cambioDatosPelicula(req.headers);
    
    let nuevaPelicula = new Pelicula_Serie(req.headers.imagen, req.headers.titulo, req.headers.fechadecreacion, req.headers.calificacion, req.headers.personajes, peliculas.length);
    peliculas.push(nuevaPelicula);
    actualizarDatos(nomArchPeliculas, peliculas);
    res.send("Pelicula creada");
})

app.delete("/deleteCharacter", (req, res) => {
    let personajes = getDatos(nomArchPersonajes);
    let index = buscarDato(req.query, personajes);
    personajes.splice(index,1);
    actualizarDatos(nomArchPersonajes, personajes);
    res.send("Personaje Eliminado");
})
app.delete("/deleteFilm", (req, res) => {
    let peliculas = getDatos(nomArchPeliculas);
    let index = buscarDato(req.query, peliculas);
    peliculas.splice(index,1);
    actualizarDatos(nomArchPeliculas, peliculas);
    res.send("Pelicula Eliminada");
})

app.get("/detailCharacter", (req,res) => {
    let personajes = getDatos(nomArchPersonajes);
    let peliculas = getDatos(nomArchPeliculas);
    let index = buscarDato(req.query, personajes);
    let personaje = {};
    let lista_pelis = [];

    Object.assign(personaje, personajes[index]);

    personaje.peliculas.forEach(id_peli => {
        let peli = peliculas.find(pelicula => pelicula.id==id_peli);
        lista_pelis.push(peli);
    })
    
    personaje.peliculas = lista_pelis;
    res.send(personaje);
})
app.get("/detailMovie", (req,res) => {
    let personajes = getDatos(nomArchPersonajes);
    let peliculas = getDatos(nomArchPeliculas);
    let index = buscarDato(req.query, peliculas);
    let pelicula = {};
    let lista_pers = [];

    Object.assign(pelicula, peliculas[index]);
    
    pelicula.personajes.forEach(id_pers => {
        let pers = personajes.find(personaje => personaje.id==id_pers);
        lista_pers.push(pers);
    })
    
    pelicula.personajes = lista_pers;
    res.send(pelicula);
})

app.post("/editCharacter", (req, res) => {
    let personajes = getDatos(nomArchPersonajes);
    let personaje_nuevo  = alterarPersonaje(req.query);
    let personaje_viejo = personajes.find(element => element.id==personaje_nuevo.id);

    if (!estaDefinido(personaje_viejo))
        throw new Error("Error! El id no coincide con ningun id de personaje");

    Object.assign(personaje_viejo, personaje_nuevo);
    actualizarDatos(nomArchPersonajes, personajes);
    res.send("Personaje modificado");
})
app.post("/editFilm", (req, res) => {
    let peliculas = getDatos(nomArchPeliculas);
    let pelicula_nueva  = alterarPelicula(req.query);
    let pelicula_vieja = peliculas.find(element => element.id==pelicula_nueva.id);

    if (!estaDefinido(pelicula_vieja)){
        throw new Error("Error! El id no coincide con ningun id de pelicula");
    }
    Object.assign(pelicula_vieja, pelicula_nueva);
    actualizarDatos(nomArchPeliculas, peliculas);
    res.send("Pelicula modificada");
})

app.listen(port, () => {
    console.log("Server Running in port ", port);
})

function getDatos(nomArch){
    var rawdata = require('./'+nomArch);
    return rawdata;
}

function actualizarDatos(nomArch, datos){
    let data = JSON.stringify(datos, null, 2);
    fs.writeFile(nomArch, data, (err) => {
        if (err) throw err;
    });
}

function estaDefinido(x){
    if (x==undefined){
        return false;
    }
    return true;
}
function validarId(objeto){
    if (!estaDefinido(objeto.id)){
        throw new Error("Error! Se debe ingresar el id");
    }else{
        objeto.id = parseInt(objeto.id);
    }
}
function validarCantParam(objeto, cant){
    if (Object.keys(objeto).length < cant){
        throw new Error("Error! Se deben ingresar más datos");
    }
}

function alterarPersonaje(objeto){
    validarId(objeto);
    validarCantParam(objeto, 2);
    cambioDatosPersonaje(objeto);
    return objeto;
}
function alterarPelicula(objeto){
    validarId(objeto);
    validarCantParam(objeto,2);
    cambioDatosPelicula(objeto);
    return objeto;
}

function cambioDatosPersonaje(objeto){
    if (estaDefinido(objeto.peso)){
        objeto.peso = parseInt(objeto.peso);
    }
    if (estaDefinido(objeto.edad)){
        objeto.edad = parseInt(objeto.edad);
    }
    if (estaDefinido(objeto.peliculas)){
        objeto.peliculas = objeto.peliculas.split(',').map(Number);
    }
}

function cambioDatosPelicula(objeto){
    if (estaDefinido(objeto.fechadecreacion)){
        objeto.fechadecreacion = parseInt(objeto.fechadecreacion);
    }
    if (estaDefinido(objeto.calificacion)){
        objeto.calificacion = parseInt(objeto.calificacion);
    }
    if (estaDefinido(objeto.personajes)){
        objeto.personajes = objeto.personajes.split(',').map(Number);
    }
}

function buscarDato(objeto, datos){
    validarId(objeto);
    let index = datos.findIndex(element => element.id==objeto.id);
    if (index==-1){
        throw new Error("Error! El id ingresado no coincide con ningun personaje");
    }
    return index;
}
