var Personaje = (function() {
    newPersonaje = function(imagen = "", nombre = "", edad = 0, peso = 0, historia = "", peliculas = [], cant){
        this.id = cant;
        this.imagen = imagen;
        this.nombre = nombre;
        this.edad = edad;
        this.peso = peso;
        this.historia = historia;
        this.peliculas = peliculas;
    }
    return newPersonaje;
})();

Personaje.prototype.setImagen = function(imagen){
    this.imagen = imagen;
}

Personaje.prototype.setNombre = function(nombre){
    this.nombre = nombre;
}

Personaje.prototype.setEdad = function(edad){
    this.edad = edad;
}

Personaje.prototype.setPeso = function(peso){
    this.peso = peso;
}

Personaje.prototype.setHistoria = function(historia){
    this.historia = historia;
}

Personaje.prototype.setPeliculas = function(peliculas){
    this.peliculas = peliculas;
}

module.exports = Personaje;