<template>
    <div>
        <v-alert>
            <v-alert text dense color="blue" border="left" class="text-center"><b>MINUTA (Recordatorio 24
                    horas)</b></v-alert>
        </v-alert>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
                <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-autocomplete label="Tragos" :items="opciones" dense outlined v-model="minuta.tragos"
                            :rules="campoRequerido">
                        </v-autocomplete>
                    </v-col>

                    <v-col cols="11" sm="6" md="6" v-if="minuta.tragos === true">
                        <v-menu ref="menuTragos" v-model="menuTragos" :close-on-content-click="false" :nudge-right="40"
                            :return-value.sync="minuta.hora_tragos" transition="scale-transition" offset-y
                            max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field dense outlined v-model="minuta.hora_tragos" label="Hora de los tragos"
                                    readonly v-bind="attrs" v-on="on" :rules="campoRequerido"></v-text-field>
                            </template>
                            <v-time-picker format="24hr" v-if="menuTragos" v-model="minuta.hora_tragos" full-width
                                @click:minute="$refs.menuTragos.save(minuta.hora_tragos)"></v-time-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" v-if="minuta.tragos">
                        <v-textarea label="Descripción de lo que toma" dense outlined v-model="minuta.descripcion_tragos">
                        </v-textarea>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                        <v-select label="Desayuno" dense outlined :items="opciones" v-model="minuta.desayuna_sino"></v-select>
                    </v-col>

                    <v-col cols="11" sm="6" v-if="minuta.desayuna_sino">
                        <v-menu ref="menuDesayuno" v-model="menuDesayuno" :close-on-content-click="false"
                            :nudge-right="40" :return-value.sync="minuta.desayuno" transition="scale-transition"
                            offset-y max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field dense outlined v-model="minuta.desayuno" label="Hora de desayuno" readonly
                                    v-bind="attrs" v-on="on" :rules="campoRequerido"></v-text-field>
                            </template>
                            <v-time-picker format="24hr" v-if="menuDesayuno" v-model="minuta.desayuno" full-width
                                @click:minute="$refs.menuDesayuno.save(minuta.desayuno)"></v-time-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="12" md="12"  v-if="minuta.desayuna_sino">
                        <v-textarea label="Descripcion de lo que desayuna" dense outlined v-model="minuta.observaciones_desayuno"></v-textarea>
                    </v-col>


                    <v-col cols="12" sm="6" md="6">
                        <v-select :items="opciones" label="Media mañana" dense outlined v-model="minuta.mm_sino"></v-select>
                    </v-col>

                    <v-col cols="11" sm="6" v-if="minuta.mm_sino">
                        <v-menu ref="menuMediaM" v-model="menuMediaM" :close-on-content-click="false" :nudge-right="40"
                            :return-value.sync="minuta.media_manana" transition="scale-transition" offset-y
                            max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field dense outlined v-model="minuta.media_manana" label="Hora de media mañana"
                                    readonly v-bind="attrs" v-on="on" :rules="campoRequerido"></v-text-field>
                            </template>
                            <v-time-picker format="24hr" v-if="menuMediaM" v-model="minuta.media_manana" full-width
                                @click:minute="$refs.menuMediaM.save(minuta.media_manana)"></v-time-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" v-if="minuta.mm_sino">
                        <v-textarea label="Descripcion de lo que come" dense outlined auto-grow v-model="minuta.mm_descripcion"></v-textarea>
                    </v-col>


                    <v-col cols="12" sm="6" md="6">
                        <v-select :items="opciones" label="Almuerzo" dense outlined v-model="minuta.almuerzo_sino"></v-select>
                    </v-col>


                    <v-col cols="11" sm="6" v-if="minuta.almuerzo_sino">
                        <v-menu ref="menuAlmuerzo" v-model="menuAlmuerzo" :close-on-content-click="false"
                            :nudge-right="40" :return-value.sync="minuta.almuerzo" transition="scale-transition"
                            offset-y max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field dense outlined v-model="minuta.almuerzo" label="Hora de almuerzo" readonly
                                    v-bind="attrs" v-on="on" :rules="campoRequerido"></v-text-field>
                            </template>
                            <v-time-picker format="24hr" v-if="menuAlmuerzo" v-model="minuta.almuerzo" full-width
                                @click:minute="$refs.menuAlmuerzo.save(minuta.almuerzo)"></v-time-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" v-if="minuta.almuerzo_sino">
                        <v-textarea label="Descripcion de lo que almuerza" dense outlined auto-grow v-model="minuta.descripcion_almuerzo"></v-textarea>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                        <v-select :items="opciones" label="Algo" dense outlined v-model="minuta.algo_sino"></v-select>
                    </v-col>


                    <v-col cols="11" sm="6" v-if="minuta.algo_sino">
                        <v-menu ref="menuAlgo" v-model="menuAlgo" :close-on-content-click="false" :nudge-right="40"
                            :return-value.sync="minuta.algo" transition="scale-transition" offset-y max-width="290px"
                            min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field dense outlined v-model="minuta.algo" label="Hora del algo" readonly
                                    v-bind="attrs" v-on="on" :rules="campoRequerido"></v-text-field>
                            </template>
                            <v-time-picker format="24hr" v-if="menuAlgo" v-model="minuta.algo" full-width
                                @click:minute="$refs.menuAlgo.save(minuta.algo)"></v-time-picker>
                        </v-menu>
                    </v-col>


                    <v-col cols="12" sm="12" md="12" v-if="minuta.algo_sino">
                        <v-textarea label="Descripcion del algo" dense outlined auto-grow v-model="minuta.descripcion_algo"></v-textarea>
                    </v-col>


                    <v-col cols="12" sm="6" md="6">
                        <v-select :items="opciones" label="Comida" dense outlined v-model="minuta.comida_sino"></v-select>
                    </v-col>

                    <v-col cols="11" sm="6" v-if="minuta.comida_sino">
                        <v-menu ref="menuComida" v-model="menuComida" :close-on-content-click="false" :nudge-right="40"
                            :return-value.sync="minuta.comida" transition="scale-transition" offset-y max-width="290px"
                            min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field dense outlined v-model="minuta.comida" label="Hora de la comida" readonly
                                    v-bind="attrs" v-on="on" :rules="campoRequerido"></v-text-field>
                            </template>
                            <v-time-picker format="24hr" v-if="menuComida" v-model="minuta.comida" full-width
                                @click:minute="$refs.menuComida.save(minuta.comida)"></v-time-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" v-if="minuta.comida_sino">
                        <v-textarea label="Descripcion de lo que come" dense outlined auto-grow v-model="minuta.comida_descripcion"></v-textarea>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                        <v-select :items="opciones" label="Merienda" dense outlined v-model="minuta.merienda_sino"></v-select>
                    </v-col>

                    <v-col cols="11" sm="6" v-if="minuta.merienda_sino">
                        <v-menu ref="menuMerienda" v-model="menuMerienda" :close-on-content-click="false"
                            :nudge-right="40" :return-value.sync="minuta.merienda" transition="scale-transition"
                            offset-y max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field dense outlined v-model="minuta.merienda" label="Hora de la merienda"
                                    readonly v-bind="attrs" v-on="on" :rules="campoRequerido"></v-text-field>
                            </template>
                            <v-time-picker format="24hr" v-if="menuMerienda" v-model="minuta.merienda" full-width
                                @click:minute="$refs.menuMerienda.save(minuta.merienda)"></v-time-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="minuta.merienda_sino">
                        <v-textarea label="Descripcion de lo que come" dense outlined auto-grow v-model="minuta.descripcion_merienda"></v-textarea>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    props: ['datos'],
    data() {
        return {
            menuTragos: false,
            menuDesayuno: false,
            menuMediaM: false,
            menuAlmuerzo: false,
            menuAlgo: false,
            menuComida: false,
            menuMerienda: false,
            valid: true,
            time: null,
            timeDesayuno: null,
            campoRequerido: [
            v => v !== null && v !== undefined && v !== '' || 'Este campo es requerido',
            ],
            opciones: [{
                text: 'Si',
                value: true
            },
            {
                text: 'No',
                value: false
            }
            ],
            loading: false,
            minuta: {
                tragos: null,
                descripcion_tragos: null,
                desayuna_sino: null,
                hora_tragos: null,
                desayuno: null,
                media_manana: null,
                almuerzo: null,
                algo: null,
                comida: null,
                merienda: null,
                observaciones_desayuno: null,
                almuerzo_sino:null,
                descripcion_almuerzo: null,
                algo_sino: null,
                descripcion_algo: null,
                comida_descripcion: null,
                comida_sino: null,
                merienda_sino: null,
                descripcion_merienda: null,
                consulta_id: this.datos.id
            }
        }
    },
    computed: {
      ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    mounted() {
        // this.cargarDatos();
        const datosMinuta = this.obtenerDatosPorConsulta(this.datos.id, 'Minuta/Model/Minuta', 'historia/formularios/MinutaNutricion');

        if (datosMinuta) {
            this.minuta = {...datosMinuta}
        }
	},
    methods: {
        // guardarMinuta() {
        //     if (!this.$refs.form.validate()) {
        //         return this.$toast.error('Campos obligatorios sin diligenciar')
        //     }
        //     this.loading = true;
        //     this.$axios.post('minuta/crear', this.minuta).then(() => {
        //         this.$toast.success('Guardado con exito')
        //     }).catch((error) => {
        //         console.log(error)
        //     }).finally(() => {
        //         this.loading = false;
        //     })
        // },

        cargarDatos() {
            this.$axios.get(`minuta/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
                this.minuta = {
                    ...this.minuta,
                    ...res.data
                }
            }).catch(error => {
                console.log(error);
                this.$toast.error('Error al cargar los datos');
            });
        },
        obtenerDatos() {
            const datosMinuta = {
                   ...this.minuta
                }
                return {
                    datos: datosMinuta
                };
            },
    }
}

</script>
