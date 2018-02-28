const fs = require("fs");

// Nombre del fichero donde se guardan las preguntas. Es unfichero con el JSON de quizzes
const DB_FILENAME = "quizzes.json";

// Modelo de datos
//
// En esta variable se mantienen todos los quizzes existentes.
// Es un array de objetos, donde cada objetotiene los atributos question y answer para guardar el text de la pregunta y el de la respuesta.
// Al arrancar la aplicación, esta variable constiene estas 4 preguntas pero al final del modulo sellama a load() para cargar las preguntas guardadas en el fichero DB_FILENAME
exports.quizzes = [
    {
        question: "Capital de Italia",
        answer: "Roma"
        
    },
    {
        question: "Capital de Francia",
        answer: "París"
    },
    {
        question: "Capital de España",
        answer: "Madrid"
    },
    {
        question: "Capital de Portugal",
        answer: "Lisboa"
    }];

/** 
* Este metodo carga el contenido del fichero BD_FILENAME en la variable quizzes. El contenido de ese fichero esta en formato JSON.
LA primera vex que se ejecite este metodo, el fichero DB_FILENAME no existe, y se producira el error ENOENT. En este caso se salva el contenido iniical almacenado.
Si seproduce otro tipo de error, se laza una excepcion que abortara la ejecucion del programa.
* 
*/
const load = () => {
    fs.readFile(DB_FILENAME, (err, data) => {
        if(err) {
            // La primera vez no existe el fichero
            if (err.code === "ENOENT"){
                save(); //valores iniciales
                return;
            }
            throw err;
        }
        let json = JSON.parse(data);
        if (json){
            quizzes = json;
        }
    });
};

/** 
* Guarda las preguntas en el fichero
* 
* Guarda en formato JSON el valor de quizzes en el fichero DB_FILENAME. Si se produce algun tipo de error, se lanza una excepcion que abortara la ejecucion del programa.
*/
const save = () => {
    fs.writeFile(DB_FILENAME, JSON.stringify(quizzes),
                err => {
                     if(err) throw err;
                });
};

/** 
* Devuelve el número total de preguntas existentes.
* 
* @returns {number} número total de preguntas
*/
exports.count = () => quizzes.length;

/** 
* Añade un nuevo quiz.
* 
* @param question String con la pregunta.
* @param answer String con la respuesta.
*/
exports.add = (question, answer) => {
    quizzes.push({
        question: (question || "").trim(),
        answer: (answer || "").trim()}
    );
    save();
};

/** 
* Actualiza el quiz situado en la posicion index.
* @param id Clave que identifica el quiz a actualizar.
* @param question String con la pregunta.
* @param answer String con la respuesta.
*/
exports.update = (id,question, answer) => {
    const quiz = quizzes[id];
    if (typeof quiz === "undefined"){
        throw new Error('El valor del parámetro id no es válido.');
    }
    quizzes.splice(id, 1, {
        question: (question || "").trim(),
        answer: (answer || "").trim()}
     );
    save();
};

/** 
* Devuelve todos los quizzes existentes.
* 
* Devuelve un clon del valor guardado en la variable quizzes, es decir, un objeto nuevo con todas las preguntas.
* Para clonar quizzes se usa stringify + parse
* @returns {any}
*/
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

/** 
* Devuelve un clon del quiz almacenado en la posición dada.
* 
* @param id Clave que identifica el quiz a devolver
* @returns {question, answer} Devuelve el objeto en la posicion dada
*/
exports.getByIndex = id => {
    const quiz = quizzes[id];
    if (typeof quiz === "undefined"){throw new Error('El valor del parámetro id no es válido.');
    }
    return JSON.parse(JSON.stringify(quiz));
};

/** 
* Elimina el quiz en la posición dada.
* 
* @param id Clave que identifica el quiz a borrar.
*/
exports.deleteByIndex = id => {
    const quiz = quizzes[id];
    if (typeof quiz === "undefined"){throw new Error('El valor del parámetro id no es válido.');
    }
    quizzes.splice(id, 1); 
    save();
};

// Carga los quizzes almacenados en el fichero.
load();