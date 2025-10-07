<template>
    <div>
        <v-card>
            <v-alert text dense color="primary" icon="mdi-home-switch" border="bottom">
                <b>Asignar sedes a la cita {{citaSeleccionada?.nombreCita || ''}}</b>
            </v-alert>
            <v-card-text>
                <v-autocomplete label="Sedes" :items="reps" item-value="id" :loading="loading" item-text="nombre"
                    outlined dense :search-input.sync="busquedaRep" multiple chips small-chips deletable-chips
                    v-model="repSeleccionado" no-data-text="Ingresa 4 dígitos para realizar la búsqueda"
                    @change="actualizarRepsAsociados" />


                <v-col cols="12" sm="12" md="12" v-if="repSeleccionado.length">
                    <v-alert text dense color="primary" border="left"><b>Reps asociados</b></v-alert>
                    <v-row>
                        <v-col v-for="rep in repsSeleccionados" :key="rep.id" cols="auto">
                            <v-chip small close @click:close="eliminarRep(rep.id)">
                                {{ rep.nombre }}
                            </v-chip>
                        </v-col>
                    </v-row>

                </v-col>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="cerrar()">Cerrar</v-btn>
                <v-btn color="success" small @click="asignarReps()" :loading="loading">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </div>

</template>


<script>
    export default {
        props: ['citaSeleccionada'],
        data() {
            return {
                reps: [],
                busquedaRep: '',
                loading: false,
                repSeleccionado: [],
                repsAsociados: [],
            }
        },

        computed: {
            repsSeleccionados() {
                const todosReps = [...(this.reps || []), ...(this.repsAsociados || [])];
                return this.repSeleccionado
                    .map(id => todosReps.find(rep => rep && rep.id === id))
                    .filter(Boolean);
            }

        },
        watch: {
            busquedaRep(val) {
                if (!val || val.length < 4) {
                    this.reps = null;
                    return;
                }

                if (val.length === 4) {
                    this.buscarReps();
                }
            }
        },

        methods: {
            cerrar() {
                this.$emit('cerrar');
                this.repSeleccionado = [];
                this.reps = [];
                this.repsAsociados = [];
            },

            buscarReps() {
                this.loading = true;
                this.$axios.get(`/reps/buscarRep/${this.busquedaRep}`).then(res => {
                    this.reps = res.data;
                }).catch(err => {
                    this.$toast.error('Error al buscar los reps');
                    console.error(err);
                }).finally(() => {
                    this.loading = false;
                });
            },

            asignarReps() {
                this.loading = true;
                const data = {
                    cita_id: this.citaSeleccionada.id,
                    rep_id: this.repSeleccionado
                }
                this.$axios.post('citas/asignar-reps-cita', data).then((res) => {
                    this.$toast.success('Reps asignados con éxito');
                    this.cerrar();
                }).catch((error) => {
                    this.$toast.error('Error al asignar reps');
                    console.error(error);
                }).finally(() => {
                    this.loading = false;
                });
            },

            listarRepsPorCita() {
                this.loading = true;
                this.$axios.get('citas/listar-reps-cita/' + this.citaSeleccionada.id).then((res) => {
                    const reps = res.data;
                    this.repSeleccionado = reps.map(rep => rep.id);
                    this.repsAsociados = reps;
                }).catch((error) => {
                    this.$toast.error('Error al listar reps asignados a la cita');
                    console.error(error);
                }).finally(() => {
                    this.loading = false;
                });
            },

            eliminarRep(id) {
                this.repSeleccionado = this.repSeleccionado.filter(repId => repId !== id);
            },

            actualizarRepsAsociados() {
                const todosReps = [...(this.reps || []), ...(this.repsAsociados || [])];

                this.repsAsociados = this.repSeleccionado
                    .map(id => todosReps.find(rep => rep && rep.id === id))
                    .filter(Boolean);
            }

        }
    }

</script>
