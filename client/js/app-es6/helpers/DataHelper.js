class DataHelper {

    constructor() {
        throw new Error("DataHelper não pode ser instaciada");
    }

    static dataParaTexto(data) {

        return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`;
    }

    static textoParaData(texto) {

        if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) throw new Error("Data deve estar no formato aaaa-mm-dd");

        return new Date(...texto.split('-').map((item, indice) => item - indice % 2));
    }

}