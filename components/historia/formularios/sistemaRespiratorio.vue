<template>
    <div>
        <v-card elevation="0">
            <v-divider></v-divider>
            <v-container fluid>
                <v-alert dense text border="left" icon="mdi-heart" color="info" class="text-center">
                    <b>Sistema Respiratorio</b>
                </v-alert>

                <v-form ref="sistemaRespiratorioForm">
                    <v-row dense>
                        <v-col cols="12" sm="4" md="4">
                            <v-select outlined dense v-model="sistema.escala_disnea_mrc"
                                label="Escala de disnea modificada de la MRC" type="number"
                                :rules="[rules.obligatorio]" :items="escalaDisnea"></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                            <v-text-field outlined dense label="Indicie de Bode:" v-model="sistema.indice_bode"
                                type="number" :rules="[rules.obligatorio, rules.caracteres, rules.maximo10]"></v-text-field>
                        </v-col>


                        <v-col cols="12" sm="4" md="4">
                            <v-text-field outlined dense label="Bodex:" v-model="sistema.bodex" type="number"
                                :rules="[rules.obligatorio, rules.caracteres, rules.maximo9]"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4" md="4">
                            <v-text-field outlined dense label="Escala de somnolencia de Epworth (ESE): " v-model="sistema.escala_de_epworth" type="number"
                                :rules="[rules.obligatorio, rules.caracteres, rules.maximo24]"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4" md="4">
                            <v-text-field outlined dense label="Escala de Borg modificada Puntuación Intensidad de la disnea: " v-model="sistema.escala_de_borg" type="number"
                                :rules="[rules.obligatorio, rules.caracteres, rules.maximo10]"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4" md="4">
                            <v-text-field outlined dense label="Evaluación de CAT: " v-model="sistema.evaluacion_cat" type="number"
                                :rules="[rules.obligatorio, rules.caracteres, rules.maximo40]"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4" md="4">
                            <v-text-field outlined dense label="STOP-BANG:" v-model="sistema.stop_bang" type="number"
                                :rules="[rules.obligatorio, rules.caracteres, rules.maximo8]"></v-text-field>
                        </v-col>


                    </v-row>
                </v-form>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    props: ['datos'],

    data() {
        return {
            loading: false,
            sistema: {
                escala_disnea_mrc: '',
                indice_bode: '',
                bodex: '',
                escala_de_epworth: '',
                escala_de_borg: '',
                evaluacion_cat: '',
                stop_bang: '',
                creado_por:this.$store.state.auth.usuario.id,
                consulta_id: this.datos.id,
            },
            rules: {
                obligatorio: (v) => v !== null & v !== undefined && v !== '' || "Este campo es obligatorio",
                caracteres:  v => (v && v.length >= 1 && v.length <= 2) || 'Debe tener entre 1 y 2 caracteres',
                maximo4: (v) => (v && Number(v) <= 4) || 'El número no puede ser mayor a 4',
                maximo10: (v) => (v && Number(v) <= 10) || 'El número no puede ser mayor a 10',
                maximo9: (v) => (v && Number(v) <= 9) || 'El número no puede ser mayor a 9',
                maximo24: (v) => (v && Number(v) <= 24) || 'El número no puede ser mayor a 24',
                maximo40: (v) => (v && Number(v) <= 40) || 'El número no puede ser mayor a 40',
                maximo8: (v) => (v && Number(v) <= 8) || 'El número no puede ser mayor a 8',
            },

			escalaDisnea: [
				{
					text: '1',
					value: 1
				},
				{
					text: '2',
					value: 2
				},
				{
					text: '3',
					value: 3
				},
				{
					text: '4',
					value: 4
				}

			],

        }
    },
    computed: {
      ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    mounted() {
		// this.cargarDatos();
        const datosSistema = this.obtenerDatosPorConsulta(this.datos.id, 'SistemaRespiratorio/Models/SistemasRespiratorios', 'historia/formularios/sistemaRespiratorio');

        if (datosSistema) {
            this.sistema = {...datosSistema}
        }
	},
    methods: {
        // async enviarSistema() {
        //     if (!this.$refs.sistemaRespiratorioForm.validate()) {
        //         return;
        //     }
        //     try {
        //         const data = {
        //             ...this.sistema,
        //             consulta_id: this.datos.id
        //         };
        //         this.loading = true;
        //         await this.$axios.post('/sistema-respiratorio/crear', data);
        //         this.$toast.success('Datos Guardados Correctamente')
        //     } catch (error) {
        //         console.log({ error });
        //         this.$toast.error('Ha ocurrido un Error al enviar el Sistema');
        //     } finally {
        //         this.loading = false;
        //     }
        // },

        cargarDatos() {
            this.$axios.get(`sistema-respiratorio/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
                this.sistema = {
                    ...this.sistema,
                    ...res.data
                }
            }).catch(error => {
                console.log(error);
                this.$toast.error('Error al cargar los datos');
            });
        },
        obtenerDatos() {
            return {
                datos: this.sistema
            };
        },
        validarErrores() {
				return this.$refs.sistemaRespiratorioForm.validate();
			},
    }
}
</script>
