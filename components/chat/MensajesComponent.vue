<template>
    <v-container fluid>
        <div>
            <v-card-text style="height: 79.5vh; overflow: auto">

                <div :class="item.user_id === $store.state.auth.usuario.id ? 'text-right' : 'text-left'"
                    v-for="(item, index) in mensajes" :key="index">

                    <v-chip :color="item.user_id != $store.state.auth.usuario.id ? 'primary' : 'success'"
                        class="mb-1 py-2" style="height: auto; max-width: 75%; white-space: normal;">
                        <div>
                            <p class="mb-0 caption">{{ getNombreCompleto(item) }}</p>
                            <p v-if="item.mensaje != null" class="mb-1 font-weight-black">{{ item.mensaje }}</p>
                            <v-btn v-else @click="consultarAdjunto(item.adjunto)" small target="_blank" class="mb-2">
                                {{ item.nombre_adjunto[1] }}
                            </v-btn>
                            <v-divider color="white"></v-divider>
                            <p class="mb-0 caption">{{ item.created_at }}</p>
                        </div>
                    </v-chip>

                </div>
            </v-card-text>
            <v-card-text>
                <v-col cols="12" md="12">
                    <v-textarea v-model="mensaje" filled outlined append-icon="mdi-send"
                        append-outer-icon="mdi-paperclip" auto-grow @click:append="enviarMensaje()"
                        @click:append-outer="dialog = true" rows="1">
                    </v-textarea>
                </v-col>
            </v-card-text>
        </div>
        <v-row>
            <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="dialog" persistent>
                <v-card>
                    <v-card-title class="text-h5">Ingrese los adjuntos a enviar</v-card-title>
                    <v-card-text>
                        <v-col cols="12" sm="12" md="12">
                            <v-file-input v-model="adjuntos" multiple
                                accept=".jpg, .jpeg, .png,.doc,.docx,.xml,.xlsx,.pdf" color="titulo" counter
                                label="Seleccione los archivos" placeholder="Seleccione los archivos"
                                prepend-icon="mdi-paperclip" outlined dense :clearable="false">
                                <template v-slot:selection="{ index, text }">
                                    <v-chip small label color="primary" close @click:close="eliminarChip(index)">
                                        {{ text }}
                                    </v-chip>
                                </template>
                            </v-file-input>
                        </v-col>
                    </v-card-text>

                    <v-card-actions class="justify-end">
                        <v-btn @click="(dialog = false), (adjuntos = [])" dark color="error">Cerrar</v-btn>
                        <v-btn @click="enviarAdjuntos()" dark color="success">Adjuntar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "mensaje-chats",
    props: [
        'datos',
        'referenciaChat',
        'mensajes'
    ],

    data: () => ({
        dialog: false,
        mensaje: null,
        adjuntos: [],
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
    }),

    methods: {

        eliminarChip(index) {
            this.adjuntos.splice(index, 1);
        },

        limpiarAdjunto() {
            this.dialog = false
            this.adjuntos = []
        },

        async enviarMensaje() {
            const request = {
                canal_id: this.datos.id,
                mensaje: this.mensaje,
            };
            await this.$axios
                .post("/mensaje/crear", request)
                .then((res) => {
                    console.log(res)
                    this.mensaje = null;
                })
                .catch((e) => {
                    this.$toast.error(e.response.data.error);
                });
        },

        enviarAdjuntos() {
            const formData = new FormData();
            formData.append(`canal_id`, this.datos.id);
            for (let i = 0; i < this.adjuntos.length; i++) {
                formData.append(`adjuntos[]`, this.adjuntos[i]);
            }
            this.$axios
                .post("/mensaje/crearAdjunto", formData)
                .then((res) => {
                    this.mensaje = null;
                    this.adjuntos = [];
                    this.limpiarAdjunto()
                })
                .catch((e) => {
                    this.$toast.error(e.response.data.error);
                });
        },

        async consultarAdjunto(ruta) {
            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                console.log(error.Response);
            }
        },

        getNombreCompleto(item) {
            if (item.user_id === this.$store.state.auth.usuario.id) {
                return 'Yo';
            } else {
                const operador = item.user?.operador;
                return operador
                    ? [operador.nombre, operador.apellido].filter(Boolean).join(' ')
                    : item.user?.email || 'Sin nombre';
            }
        }

    },
};

</script>
<style scoped>
.short {
    background: #fff;
    padding: 6px 10px;
    border-radius: 15px;
    margin: 5px 14px 5px 0;
    height: auto !important;
    max-width: 70%;
    overflow-wrap: break-word;
    text-align: left;
    white-space: pre-wrap;
}

.short span {
    margin: 5px 0 5px 7px;
    height: 100%;
}

.v-text-field {
    padding-top: 0px;
    margin-top: -15px;
}
</style>
