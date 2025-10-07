const slugGlobal = '/adjuntos';

export default ({$axios}, inject) => {
  inject('adjuntos', async (ruta) => {
    try {
        const {
            data: type
        } = await $axios.post(`${slugGlobal}/getType`, {
            ruta: ruta
        });
        const {
            data: adjunto
        } = await $axios.post(`${slugGlobal}/get`, {
            ruta: ruta
        }, {
            responseType: "arraybuffer"
        });
        return [type, adjunto];
    } catch (error) {
        console.log(error)
    }
},)
}
