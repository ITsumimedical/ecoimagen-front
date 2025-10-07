<template>
    <v-card class="pa-3" outlined shaped elevation="2">
        <v-alert text dense color="teal" icon="mdi-bell-ring" class="text-center font-weight-bold">
            Notificaciones
        </v-alert>
        <!-- 
        <v-alert dense text color="warning" type="info" elevation="2" class="mt-2">
            <small> Señor Usuario las notificaciones leidas y no leidas exiparan en 10 dias</small>
        </v-alert> -->

        <v-alert color="info" dense icon="mdi-information" text type="info" class="mt-2">
            <small> Señor Usuario las notificaciones expiran cada 10 dias</small>
        </v-alert>


        <v-list two-line dense>
            <v-list-item v-for="(msg, i) in mensajes" :key="i" class="notification-item">
                <v-list-item-avatar>
                    <v-icon color="primary">mdi-square-rounded-badge</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title class="font-weight-medium">
                        {{ msg?.data?.titulo ?? msg.titulo }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ msg?.data?.mensaje ?? msg?.mensaje }} - {{ timeAgo(msg?.fecha) }}
                    </v-list-item-subtitle>

                </v-list-item-content>

                <v-list-item-action>

                    <v-btn icon small color="red" :loading="loadingId === (msg?.data?.id ?? msg?.id)"
                        @click="eliminarNotificacion(msg?.data?.id ?? msg?.id)">
                        <v-icon v-if="loadingId !== (msg?.data?.id ?? msg?.id)">mdi-close</v-icon>
                    </v-btn>
                </v-list-item-action>

            </v-list-item>

            <v-divider v-if="mensajes.length"></v-divider>

            <v-list-item v-if="mensajes.length === 0">
                <v-list-item-content class="text-center">
                    <v-icon large color="grey lighten-1">mdi-bell-off</v-icon>
                    <p class="grey--text">No tienes notificaciones</p>
                </v-list-item-content>
            </v-list-item>


        </v-list>


    </v-card>
</template>
<script>
import { mapActions } from "vuex";
export default {
    data() {
        return {
            mensajes: [],
            loadingId: null
        };
    },

    async mounted() {

        const userId = this.$store.state.auth.usuario.id;

        this.$socket.on(`usuario.${userId}`, (data) => {
            if (data.accion === 'eliminar') {
                this.buscarNotificaciones();
            } else {
                // this.mensajes.unshift(data);
            }
        });


        this.buscarNotificaciones();

    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        async buscarNotificaciones() {
            try {
                this.setPreload(true);
                const res = await this.$axios.get("/notificaciones/listar");
                this.mensajes = res.data;
            } catch (error) {
                // this.$toast.error('Ha ocurrido un error al buscar las notificaciones')
            } finally{
                this.setPreload(false);
            }
        },

        timeAgo(fecha) {
            if (!fecha) return ''
            const ahora = new Date()
            const f = new Date(fecha.replace(' ', 'T'))
            const diff = Math.floor((ahora - f) / 1000)

            if (diff < 60) return `hace ${diff} segundos`
            if (diff < 3600) {
                const min = Math.floor(diff / 60)
                return `hace ${min} minuto${min !== 1 ? 's' : ''}`
            }
            if (diff < 86400) {
                const h = Math.floor(diff / 3600)
                return `hace ${h} hora${h !== 1 ? 's' : ''}`
            }
            const d = Math.floor(diff / 86400)
            return `hace ${d} día${d !== 1 ? 's' : ''}`
        },

        async eliminarNotificacion(id) {
            this.loadingId = id;
            try {
                await this.$axios.delete(`/notificaciones/eliminar-notificacion/${this.$store.state.auth.usuario.id}/${id}`);

                this.mensajes = this.mensajes.filter((n) => (n.data?.id ?? n.id) !== id);

                this.$toast.success("La Notificacion ha sido eliminada");

                this.buscarNotificaciones();
            } catch (error) {
                // this.$toast.error("Ha ocurrido un error al eliminar la notificación");
            } finally {
                this.loadingId = null;
            }
        }
    },
};
</script>