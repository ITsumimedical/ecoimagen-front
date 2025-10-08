<template>
    <div>
        <v-dialog v-model="mostrarModalCancelar" persistent max-width="900px">
            <v-card>
                <v-alert dense text border="left" type="info" class="text-center" icon="mdi-calendar-remove">
                    <b>Cancelar Cita</b>
                </v-alert>
                <v-card-text>
                    <v-form ref="formCancelarConsulta">
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea dense outlined auto-grow v-model="formCancelar.motivo_cancelacion"
                                            label="Motivo de Cancelación *"
                                            :rules="[rules.obligatorio, rules.minCaracteres]"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
                    <v-btn small dark color="success" @click="enviarFormulario">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
    props: {
        mostrarModalCancelar: {
            type: Boolean,
            default: false
        },
        consulta: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            formCancelar: {
                motivo_cancelacion: "",
            },
            rules: {
                obligatorio: v => !!v || "Este campo es obligatorio.",
                minCaracteres: v => v.length >= 5 || 'Este campo debe tener al menos 5 caractéres.',
            }
        }
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.limpiarFormulario();
            this.$emit("update:mostrarModalCancelar", false);
        },

        async enviarFormulario() {
            if (!this.$refs.formCancelarConsulta.validate()) return;
            try {
                const data = {
                    consulta: this.consulta.id,
                    afiliado: this.consulta.afiliado_id,
                    motivoCancelacion: this.formCancelar.motivo_cancelacion
                };

                this.setPreload(true);

                const response = await this.$axios.post('/consultas/cancelar', data);

                this.$toast.success(response.data.mensaje);
                this.$emit('recargarDatos');
                this.cerrarModal();

            } catch (error) {
                this.$toast.error('Ocurrió un error al cancelar la consulta');
            } finally {
                this.setPreload(false);
            }
        },

        limpiarFormulario() {
            this.formCancelar = {
                motivo_cancelacion: "",
            };
            this.$refs.formCancelarConsulta.resetValidation();
        }
    }

}
</script>
