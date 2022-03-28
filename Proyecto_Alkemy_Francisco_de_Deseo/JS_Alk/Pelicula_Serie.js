var Pelicula_Serie = (function() {
    newPelicula_Serie = function(imagen = "", titulo = "", fechaDeCreacion = 0, calificacion = -1, personajes = [], cant){
        this.id = cant;
        this.imagen = imagen;
        this.titulo = titulo;
        this.fechaDeCreacion = fechaDeCreacion;
        this.calificacion = calificacion;
        this.personajes = personajes;
    }
    return newPelicula_Serie;
})();

Pelicula_Serie.prototype.setImagen = function(imagen){
    this.imagen = imagen;
}

Pelicula_Serie.prototype.setTitulo = function(titulo){
    this.titulo = titulo;
}

Pelicula_Serie.prototype.setFechaDeCreacion = function(fechaDeCreacion){
    this.fechaDeCreacion = fechaDeCreacion;
}

Pelicula_Serie.prototype.setCalificacion = function(calificacion){
    this.calificacion = calificacion;
}

Pelicula_Serie.prototype.setPersonajes = function(personajes){
    this.personajes = personajes;
}

module.exports = Pelicula_Serie;