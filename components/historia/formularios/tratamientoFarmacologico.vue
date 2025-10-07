<template>
    <div>
        <v-form ref="formTratamientoFarmacologico">
            <v-row dense>
                <v-col cols="12" sm="12" md="12">
                    <v-alert class="text-center" dense text type="info" icon="mdi-bandage" border="left">
                        <b>TRATAMIENTOS FARMACOLÓGICOS</b>
                    </v-alert>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                    <v-text-field dense outlined label="Dosis" type="number" v-model="formTratamiento.dosis"
                        :rules="[rules.obligatorio]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                    <v-select dense outlined label="Horarios" v-model="formTratamiento.horario"
                        :items="opcionesHorarios" :rules="[rules.obligatorio]"></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                    <v-autocomplete dense outlined label="Metodo de Administración" :rules="[rules.obligatorio]"
                        :loading="loading.opcionesViasAdministracion" item-text="nombre" item-value="id"
                        v-model="formTratamiento.via_administracion_id"
                        :items="opcionesViaAdministracion"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-textarea dense outlined auto-grow label="Descripción del Tratamiento"
                        v-model="formTratamiento.descripcion_tratamiento"
                        :rules="[rules.obligatorio, rules.minCaracteres]"></v-textarea>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-btn block dark color="success" @click="agregarTratamiento">
                        Agregar
                        <v-icon right>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
        <v-row dense>
            <v-col cols="12" sm="12" md="12" class="mt-5">
                <v-divider></v-divider>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-data-table dense :headers="headersTratamiento" :items="tratamientos" :loading="loading.tratamientos">
                    <template v-slot:[`item.user.operador`]="{ item }">
                        {{ `${item.user.operador?.nombre || ''} ${item.user.operador?.apellido || ''}`.trim() || 'Sin nombre' }}
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip bottom v-if="puedeEliminar(item)">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="error" class="mr-2" v-bind="attrs" v-on="on"
                                    @click="eliminarTratamiento(item)">
                                    mdi-delete
                                </v-icon>

                            </template>
                            <span>Eliminar Tratamiento</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
    props: ['datos'],
    data() {
        return {
            loading: {
                opcionesViasAdministracion: false,
                tratamientos: false
            },
            formTratamiento: {
                dosis: null,
                horario: null,
                via_administracion_id: null,
                descripcion_tratamiento: ""
            },
            rules: {
                obligatorio: v => !!v || "Este campo es obligatorio.",
                minCaracteres: v => v.length >= 5 || 'Este campo debe tener al menos 5 caractéres.',
            },
            opcionesHorarios: [
                'HORA(s)',
                'DÍA(s)',
                'SEMANA(s)',
                'MES(es)',
            ],
            opcionesViaAdministracion: [],
            headersTratamiento: [
                { text: 'N°', value: 'id', align: 'center' },
                { text: 'Dosis', value: 'dosis', align: 'center' },
                { text: 'Horario', value: 'horario', align: 'center' },
                { text: 'Metodo de Administración', value: 'via_administracion.nombre', align: 'center' },
                { text: 'Descripción', value: 'descripcion_tratamiento', align: 'center' },
                { text: 'Registrado por', value: 'creado_por.operador', align: 'center' },
                { text: 'Acciones', value: 'acciones', align: 'center', sortable: false },
            ],
            tratamientos: []
        }
    },
    computed: {
        puedeEliminar() {
            return (item) => {
                const usuarioId = parseInt(this.$store.state.auth.usuario.id);
                return parseInt(item.creado_por.id) === usuarioId;
            };
        },
    },
    mounted() {
        this.listarViasAdministracion();
        this.listarTratamientos();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        async listarViasAdministracion() {
            try {
                this.loading.opcionesViasAdministracion = true;

                const response = await this.$axios.get('/vias-administracion/listar');

                this.opcionesViaAdministracion = response.data;
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar las vias de administración.');
            } finally {
                this.loading.opcionesViasAdministracion = false;
            }
        },

        async agregarTratamiento() {
            if (!this.$refs.formTratamientoFarmacologico.validate()) return;
            try {
                const data = {
                    consulta_id: this.datos.id,
                    creado_por: this.$store.state.auth.usuario.id,
                    ...this.formTratamiento
                }

                this.setPreload(true);

                await this.$axios.post('/tratamiento-farmacologico/agregar-tratamiento', data);

                this.$toast.success('Tratamiento farmacológico agregado correctamente.');

                this.limpiarFormulario();

                await this.listarTratamientos();

            } catch (error) {
                this.$toast.error('Ocurrió un error al agregar el tratamiento farmacológico.');
            } finally {
                this.setPreload(false);
            }
        },

        limpiarFormulario() {
            this.formTratamiento = {
                dosis: null,
                horario: null,
                via_administracion_id: null,
                descripcion_tratamiento: ""
            };
            this.$refs.formTratamientoFarmacologico.resetValidation();
        },

        async listarTratamientos() {
            try {
                this.loading.tratamientos = true;

                const response = await this.$axios.get(`/tratamiento-farmacologico/listar-tratamientos-afiliado/${this.datos.afiliado_id}`);

                this.tratamientos = response.data;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los tratamientos farmacológicos.');
            } finally {
                this.loading.tratamientos = false;
            }
        },

        async eliminarTratamiento(item) {
            console.log(item)
            try {
                const response = await this.$swal({
                    title: '¿Está Seguro(a)?',
                    text: "Esta acción eliminará el Tratamiento Farmacológico",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar'
                });

                if (response.value) {
                    this.setPreload(true);
                    const res = await this.$axios.delete(`/tratamiento-farmacologico/eliminar-tratamiento/${item.id}`)

                    this.$toast.success(res.data);

                    await this.listarTratamientos();
                }

            } catch (error) {
                console.log(error.response?.data?.error)
                error.response?.data?.error ? this.$toast.error(error.response.data.error) :
                    this.$toast.error('Ocurrió un error al eliminar el tratamiento farmacológico.');
            } finally {
                this.setPreload(false);
            }
        }
    },

}
</script>
