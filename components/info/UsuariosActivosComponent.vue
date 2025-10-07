<template>
    <p class="ml-2 my-0 py-0">Usuarios activos : {{ usuariosActivos }}</p>
</template>
<script>
import Pusher from "pusher-js";
export default {
    name: "UsuariosActivosComponent",

    data() {
        return {
            usuariosActivos: 0
        };
    },

    mounted() {
        Pusher.logToConsole = false;
        const pusher = new Pusher(this.$config.PUSHER_KEY, {
            cluster: 'mt1',
            forceTLS: false, // Desactiva HTTPS
            encrypted: false
        });
        const channel = pusher.subscribe(this.$config.PUSHER_CHANNEL);
        channel.bind('conteo-usuarios-activos', (data) => {
            this.usuariosActivos = data.count;
            localStorage.setItem('usuariosActivos', JSON.stringify({
                count: data.count,
                timestamp: Date.now()
            }));
        });

        // revisamos si ya la consulta se ha hecho hace menos de 10 minutos
        const cache = JSON.parse(localStorage.getItem('usuariosActivos'));
        const unaHora = 60 * 60 * 1000;
        if (cache && (Date.now() - cache.timestamp) < unaHora) {
            this.usuariosActivos = cache.count;
        } else {
            this.getUsuariosActivos();
        }
    },

    methods: {

        async getUsuariosActivos() {
            try {
                const response = await this.$axios.get('/auth/usuarios-activos');
                this.usuariosActivos = response.data;
                localStorage.setItem('usuariosActivos', JSON.stringify({
                    count: this.usuariosActivos,
                    timestamp: Date.now()
                }));
            } catch (error) {
                console.error('Error al obtener usuarios activos:', error);
            }
        }

    }
}
</script>