<template>
    <v-dialog v-model="mostrarModalEnvioCorreo" max-width="900px" persistent>
        <v-card>
            <v-alert dense text border="left" type="info" icon="mdi-format-list-bulleted-square"
                     class="text-center">
                <b>¿Desea enviar la orden por correo electrónico?</b>
            </v-alert>
            <v-card-text>
                <v-form ref="formEnvioCorreo">
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field dense outlined label="Correo Electrónico *"
                                          :rules="[rules.obligatiorio, rules.correo]"
                                          v-model="formCorreo.correo"/>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
                <v-btn small dark color="success" @click="imprimirOrdenes">Imprimir</v-btn>
                <v-btn small dark color="primary" @click="enviarCorreo">Enviar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import {mapActions} from "vuex";

export default {
    props: {
        mostrarModalEnvioCorreo: {
            type: Boolean,
            default: false
        },
        items: {
            type: Array,
            default: () => []
        },
        tipoOrden: {
            type: String,
            default: ''
        }

    },
    data() {
        return {
            formCorreo: {
                correo: ''
            },
            rules: {
                obligatiorio: (v) => !!v || "Este campo es obligatorio.",
                correo: (v) => this.emailRegex.test(v) || "Debe ser un correo válido",
            },
            emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.limpiarFormulario();
            this.$emit('cerrarModalPadre')
            this.$emit('update:mostrarModalEnvioCorreo', false);
        },

        limpiarFormulario(){
            this.formCorreo.correo = '';

            this.$refs.formEnvioCorreo.resetValidation();
        },

        async imprimirOrdenes() {
            const data = {
                tipo: this.tipoOrden,
                enviar: false,
                correo: this.formCorreo.correo,
                servicios: this.items.map(item => {
                    return {
                        identificador: item.id
                    }
                })
            }

            try {
                this.setPreload(true);
                const response = await this.$axios.post('/pdf', data, {
                    responseType: 'arraybuffer'
                });

                let blob = new Blob([response.data], {
                    type: "application/pdf"
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error('Ocurrió un error al imprimir la orden');
            } finally {
                this.setPreload(false);
            }
        },

        async enviarCorreo() {
            if (!this.$refs.formEnvioCorreo.validate()) return;

            const data = {
                tipo: this.tipoOrden,
                enviar: true,
                correo: this.formCorreo.correo,
                servicios: this.items.map(item => {
                    return {
                        identificador: item.id
                    }
                })
            }

            try {
                this.setPreload(true);

                await this.$axios.post('/pdf', data)

                await this.$swal.fire({
                    title: "¡Orden enviada con exito!",
                    icon: "success",
                    type: "success",
                    timer: 2000
                });

                this.limpiarFormulario();


            } catch (error) {
                this.$toast.error('Ocurrió un error al enviar el correo electrónico');
            } finally {
                this.setPreload(false);
            }
        }
    }
}
</script>
