<template>
    <div>
        <v-dialog v-model="mostrarModalAsignar" max-width="600px" persistent>
            <v-card>
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <span>Asignar N° {{ barreraSelecionada?.id }}</span>
                            </div>
                        </v-toolbar-title>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-row dense>
                            <v-col cols="12" md="12" ms="12">
                                <v-col cols="12" md="12" sm="12">
                                    <v-autocomplete v-model="responsable_barrera_accesos_id" dense outlined multiple
                                        chips :items="responsables" item-text="nombre" item-value="id"
                                        label="Responsables: *" :loading="loading" deletable-chips :rules="rules.campoObligatorio">
                                    </v-autocomplete>
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
                    <v-btn small color="success" @click="asignarResponsable">ASIGNAR</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    props: {
        mostrarModalAsignar: {
            type: Boolean,
            default: false,
        },
        barreraSelecionada: Object,
    },

    data() {
        return {
            valid: false,
            responsable_barrera_accesos_id: [],
            responsables: [],
            loading: false,
            rules: {
                campoObligatorio: [
                    v => !!v || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ]
            }
        }
    },

    mounted() {
        this.listarResponsables();
    },


    methods: {
        ...mapActions('app', ['setPreload']),

        listarResponsables() {
            this.loading = true;
            this.$axios.post("/responsable-barrera-acceso/listar-responsables-activos")
                .then((res) => {
                    this.responsables = res.data.map(responsable => {
                        return {
                            id: responsable.id,
                            nombre: `${responsable.nombre} - ${responsable.area_responsable.nombre}`
                        }
                    });
                })
                .catch((e) => {
                    this.$toast.error("Error al listar los responsables");
                })
                .finally(() => {
                    this.loading = false;
                })
        },

        asignarResponsable() {
            if (!this.$refs.form.validate()) {
                return;
            }

            const data = {
                id: this.barreraSelecionada.id,
                estado_id: 6,
                area: this.responsable_barrera_accesos_id
            }

            this.setPreload(true);

            this.$axios.post('/barrera-acceso/asignar-area-responsable', data)
            .then((res) => {
                this.$emit('cerrarModalPadre');
                this.cerrarModal();
            })
            .catch((error) => {
                this.$toast.error("Hubo un erro al asiganr las areas responsables")
            })
            .finally(() => {
                this.setPreload(false);
            })
        },

        limpiar() {
            this.responsable_barrera_accesos_id = [];
        },

        cerrarModal() {
            this.limpiar();
            this.$emit("update:mostrarModalAsignar", false);
        },
    }
}
</script>
