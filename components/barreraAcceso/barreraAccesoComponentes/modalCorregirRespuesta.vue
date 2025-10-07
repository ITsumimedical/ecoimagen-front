<template>
    <div>
        <v-dialog v-model="mostrarModalReasignadoPresolucion" max-width="600px" persistent>
            <v-card>
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <span>Corregir Respuesta N° {{ barreraSelecionada?.id }}</span>
                            </div>
                        </v-toolbar-title>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-row dense>
                            <v-col cols="12" md="12" ms="12">
                                <v-col cols="12" md="12" sm="12">
                                    <v-textarea v-model="obeservacion_cierre" filled label="Correcion observacion de cierre: *" :rules="rules.campoObligatorio">
                                    </v-textarea>
                                </v-col>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="cerrarModal">
                        CERRAR
                    </v-btn>
                    <v-btn small color="warning" @click="corregirRespuesta(5)">ANULAR</v-btn>
                    <v-btn small color="success" @click="corregirRespuesta(18)">CORREGIR</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    props: {
        mostrarModalReasignadoPresolucion: {
            type: Boolean,
            default: false,
        },
        barreraSelecionada: Object,
    },

    data() {
        return {
            valid: false,
            obeservacion_cierre: '',
            rules: {
                campoObligatorio: [
                    v => !!v || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ]
            }
        }
    },

    watch: {
        'barreraSelecionada'(newVal) {
            if (newVal && this.barreraSelecionada) {
                this.obeservacion_cierre = this.barreraSelecionada?.observacion_cierre;
            }
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        corregirRespuesta(estado) {
            if (!this.$refs.form.validate()) {
                return
            }
            this.setPreload(true);
            const data = {
                id: this.barreraSelecionada.id,
                observacion_cierre: this.obeservacion_cierre,
                estado_id: estado,
                // afiliado_id: this.barreraSelecionada.afiliado_id,
                // rep: this.barreraSelecionada.rep.id ?? null,
                // email: this.barreraSelecionada.user_crea.email
            }
            this.$axios.put(`barrera-acceso/solucionar-anular-barrera-acceso/${this.barreraSelecionada.id}`, data)
                .then(res => {
                    this.$toast.success('La barrera de acceso ha sido corregida correctamente');
                    this.$emit('cerrarModalPadre');
                    this.cerrarModal();
                })
                .catch(() => {
                    this.$toast.error("Error al corregir");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        limpiarCampo() {
            this.obeservacion_cierre = null;
        },

        cerrarModal() {
            this.limpiarCampo();
            this.$emit("update:mostrarModalReasignadoPresolucion", false);
        },
    }
}
</script>
