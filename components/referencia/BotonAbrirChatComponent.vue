<template>

    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-icon :color="mensajeSinVer ? 'boton' : 'info'" @click="$emit('click'), actualizarMensajes()" class="mr-2"
                :class="mensajeSinVer ? 'latidos' : ''" v-on="on">
                mdi-chat
            </v-icon>
        </template>
        <span>Abrir chat</span>
    </v-tooltip>

</template>
<script>
import Pusher from "pusher-js";
import { mapActions, mapGetters } from "vuex";

export default {
    props: {
        item: {
            type: Object,
        }
    },

    data() {
        return {
            mensajeSinVer: false
        }
    },

    mounted() {

        this.mensajeSinVer = this.item.canal.mensajes.some(item => !item.visto && this.$store.state.auth.usuario.id != item.user_id)
        Pusher.logToConsole = false;
        const pusher = new Pusher('496314bdeba55d9c3763', {
            cluster: 'mt1'
        });

        const channel = pusher.subscribe(`sendMenssage${this.item.canal.id}`);
        channel.bind('message', data => {
            const esMiMensaje = data.user_id === this.$store.state.auth.usuario.id
            if (!esMiMensaje) {
                if (this.estaEnElChat()) {
                    this.actualizarMensajes()
                } else {
                    this.mensajeSinVer = true
                }
            }
        });


    },

    methods: {
        ...mapGetters('chat', ['estaEnElChat']),
        /**
         * consulta si tiene mensajes sin leer
         */
        actualizarMensajes() {
            //this.mensajeSinVer = this.item.canal.mensajes.some(item => !item.visto && this.$store.state.auth.usuario.id != item.user_id)
            this.$axios.put('/mensaje/marcar-visto/' + this.item.canal.id)
                .then(response => {
                    this.mensajeSinVer = false
                })
                .catch(error => {
                    console.log(error.response)
                });
        }
    }
}

</script>

<style scoped>
@keyframes latidos {
    from {
        transform: none;
    }

    50% {
        transform: scale(1.4);
    }

    to {
        transform: none;
    }
}

/* En la clase corazon vamos a llamar latidos en la animación  */
.latidos {
    animation: latidos .5s infinite;
}
</style>
