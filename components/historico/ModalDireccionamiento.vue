<template>
    <v-dialog v-model="mostrarDireccionamiento" max-width="700" persistent>
        <v-card>
            <v-alert text dense border="left" type="success" icon="mdi-reload">
                <b>Cambio de Direccionamiento Masivo </b>
            </v-alert>
            <v-card-text>
                <v-form ref="form">
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete :items="reps" v-model="form.reps_id" label="Buscar  *"
                                :search-input.sync="campoBusquedaRep" :loading="loading.reps"
                                no-data-text="Digite el nombre del direccionamiento." item-text="nombre" item-value="id"
                                :rules="[rules.obligatorio]"></v-autocomplete>
                        </v-col>

                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="cerrarModal">Cerrar</v-btn>
                <v-btn color="success" small @click="cambiarDireccionamiento()">Cambiar Direccionamiento</v-btn>
            </v-card-actions>
        </v-card>


        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Procesando Información
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>
<script>

export default {
    props: [
        'mostrarDireccionamiento',
        'seleccionados',
        'tipo'
    ],
    data() {
        return {
            preload: false,
            campoBusquedaRep: "",
            form: {
                reps: "",
            },
            loading: {
                reps: false,
            },
            reps: [],
            rules: {
                obligatorio: (v) => !!v || "Este campo es obligatorio",
            }
        };

    },

    watch: {
        campoBusquedaRep(newVal) {
            if (newVal && newVal.length === 4) {
                this.listarReps();
            }
        },
    },

    methods: {
        cerrarModal() {
            this.$emit("update:mostrarDireccionamiento", false);
        },

        listarReps() {
            this.loading.reps = true;
            this.$axios.get(`/reps/buscarRep/${this.campoBusquedaRep}`)
                .then((res) => {
                    this.reps = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre}`,
                        };
                    });
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al cargar los reps");
                    console.log(error);
                })
                .finally(() => {
                    this.loading.reps = false;
                });
        },

        buscarReps() {
            this.listarReps(searchTerm);
        },

        async cambiarDireccionamiento() {
            if (!this.form.reps_id) {
                this.$toast.error("¡ Debe seleccionar un direccionamiento !");
                return;
            }
            try {
                this.preload = true;
                await this.$axios.put(`ordenamiento/cambioDireccionamiento/${this.form.reps_id}`, {
                    tipo: this.tipo,
                    seleccionados: this.seleccionados
                });
                this.$toast.success('¡Direccionamiento cambiado!');
                this.$emit('buscar');
                this.cerrarModal();
            } catch (error) {
                this.$toast.error("Ha ocurrido un error al cambiar el direccionamiento");
            } finally {
                this.preload = false;
                this.$emit('limpiarSeleccionados');
            }
        },
    }
}
</script>
