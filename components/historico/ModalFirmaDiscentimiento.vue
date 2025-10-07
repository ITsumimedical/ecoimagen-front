<template>
    <v-dialog max-width="1200px" v-model="mostrarModalFirmaDiscentimiento">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-file-document-check-outline" class="text-center">
                <b>FIRMA DISENTIMIENTO</b>
            </v-alert>
            <v-card-text>
                <v-form ref="form">
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <h4 class="ml-3">Firma disentimiento:</h4>
                            <div class="firma mb-5">
                                <vueSignature width="100%" height="200px" ref="firmaPaciente" />
                                <v-btn text @click="limpiar()">Limpiar</v-btn>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="nombre_profesional"
                                label="Diligencie el nombre del profesional presente durante la firma del disentimiento"
                                :rules="[(v) => !!v || 'El nombre del profesional es requerido']"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="cerrarModal">Cerrar</v-btn>
                <v-btn color="green" dark small @click="guardarFirma">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
import vueSignature from "vue-signature";

export default {
    components: {
        vueSignature,
    },
    data() {
        return {
            nombre_profesional: `${this.$store.state.auth.usuario.operador.nombre || ''} ${this.$store.state.auth.usuario.operador.apellido || ''}`.trim(),
        };
    },
    props: {
        mostrarModalFirmaDiscentimiento: {
            type: Boolean,
            default: false,
        },
        ordenProcedimientoSeleccionado: Object,
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        guardarFirma() {
            if (this.$refs.firmaPaciente.isEmpty() || !this.$refs.form.validate()) {
                this.$swal({
                    title: '¡Error!',
                    text: 'Debe registrar la firma y diligenciar el campo del profesional que asiste el disentimiento',
                    type: 'warning',
                });
                return
            }
            const firma = this.$refs.firmaPaciente.save();
            const ordenProcedimientoId = this.ordenProcedimientoSeleccionado?.id;
            const data = {
                firma: firma,
                id: ordenProcedimientoId,
                nombre_profesional: this.nombre_profesional
            };
            this.setPreload(true);
            this.$axios
                .$post(`/consentimientos-informados/guardar-firma-discentimiento/${ordenProcedimientoId}`, data)
                .then(() => {
                    this.limpiar();
                    this.setPreload(false);
                    this.$emit("update:mostrarModalFirmaDiscentimiento", false);
                    this.$swal({
                        title: '!Firma guardada con éxito!',
                        type: 'success',
                    });
                })
                .catch((error) => {
                    this.setPreload(false);
                    console.error(error);
                    this.$swal({
                        title: '¡Error!',
                        text: 'Ocurrió un error al guardar la firma',
                        type: 'error',
                    });
                });
        },

        limpiar() {
            this.$refs.firmaPaciente.clear();
            this.$refs.form.resetValidation()
        },

        cerrarModal() {
            this.limpiar();
            this.$emit("update:mostrarModalFirmaDiscentimiento", false);
        },
    },
}
</script>

<style>
.firma {
    margin: 0 10px;
    border: 2.5px solid #78909C;
    border-radius: 5px;
}

.centrar {
    text-align: center;
}

p {
    text-align: justify;
}
</style>
