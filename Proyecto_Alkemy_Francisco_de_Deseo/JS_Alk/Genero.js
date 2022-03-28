var Genero = (function() {
    var idContador = 0;
    newGenero = function(nombre, imagen, peliculas){
        this.id = idContador;
        this.nombre = nombre;
        this.imagen = imagen;
        this.peliculas = peliculas;
        idContador++;
    }
    return newGenero;
})();

module.exports = Genero;