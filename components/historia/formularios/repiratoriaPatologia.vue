<template>
	<div>
		<v-card elevation="0">
			<v-container fluid>
				<v-alert dense text border="left" icon="mdi-hospital-box" color="info" class="text-center">
					<b>Patología Respiratoria</b>
				</v-alert>
				<v-form ref="patologiaForm">

					<v-row dense>

						<v-col cols="12" sm="6" md="6	">
							<v-select label="hipoapnea obstructiva del sueño" dense outlined :items="opcionesSiNo"
								v-model="patologia.hipoapnea_obstructiva_sueno" :rules="[rules.obligatorio]"></v-select>
						</v-col>
						<v-col cols="12" sm="6" md="6	">
							<v-select label="Presenta sindrome de apnea " dense outlined :items="opcionesSiNo"
								v-model="patologia.presenta_sindrome_apnea" :rules="[rules.obligatorio]"></v-select>
						</v-col>
					</v-row>
					<v-row dense>
						<v-col cols="12" sm="6" md="6">
							<v-select outlined dense label="Tipo de apnea" v-model="patologia.tipoApnea"
								:items="tiposApnea" :rules="[rules.obligatorio]"></v-select>
						</v-col>
						<v-col cols="12" sm="6" md="6">
							<v-select outlined dense label="Origen" v-model="patologia.origen" :items="opcionesOrigen"
								:rules="[rules.obligatorio]"></v-select>
						</v-col>

						<v-col cols="12" sm="12" md="12">
							<v-select outlined dense label="Uso de CPAP/BIPAP: " v-model="patologia.uso_cpap_bipap"
								:items="opcionesSiNo" :rules="[rules.obligatorio]"></v-select>
						</v-col>
						<v-col cols="12" sm="12" md="12" v-if="patologia.uso_cpap_bipap">
							<v-textarea outlined dense label="Observacion" v-model="patologia.observacion_uso"
								:rules="[rules.obligatorio]">

							</v-textarea>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-select outlined dense label="Adherencia de CPAP/BIPAP"
								v-model="patologia.adherencia_cpap_bipap" :items="opcionesSiNo"
								:rules="[rules.obligatorio]"></v-select>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-textarea outlined dense label="Observacion" v-model="patologia.observacion_adherencia"
								:rules="[rules.obligatorio]">

							</v-textarea>
						</v-col>

						<v-col cols="12" sm="8" md="8">
							<v-select outlined dense label="¿ Usa Oxigeno ?" :items="opcionesSiNo"
								v-model="patologia.uso_oxigeno" :rules="[rules.obligatorio]">
							</v-select>
						</v-col>

						<v-col cols="12" sm="4" md="4" v-if="patologia.uso_oxigeno">
							<v-text-field outlined dense label="litros oxigeno " v-model="patologia.litro_oxigeno"
								:rules="[rules.obligatorio]"></v-text-field>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-select label="Clasificacion control asma" v-model="patologia.clasificacion_control_asma"
								dense outlined :items="opcionesClasificacion" :rules="[rules.obligatorio]"></v-select>
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
			opcionesSiNo: [
				{
					text: 'Si',
					value: true
				},
				{
					text: 'No',
					value: false
				}
			],

			tiposApnea: [
				{
					text: 'Severa',
					value: 'severa'
				},
				{
					text: 'Moderada',
					value: 'moderada',
				},
				{
					text: 'Leve',
					value: 'leve',
				}
			],

			opcionesOrigen: [
				{
					text: 'Central',
					value: 'central',
				},
				{
					text: 'Mixta',
					value: 'mixta',
				},
				{
					text: 'Obstructivo',
					value: 'obstructivo',
				}
			],

			opcionesClasificacion: [
				{
					text: 'Bien controlada',
					value: 'bien controlada',
				},
				{
					text: 'Parcialmente controlada',
					value: 'parcialmente controlada',
				},
				{
					text: 'Mal controlada ',
					value: 'mal controlada ',
				},
				{
					text: 'No Aplica',
					value: 'no aplica',
				}
			],

			patologia: {
				presenta_sindrome_apnea: null,
				hipoapnea_obstructiva_sueno: null,
				tipoApnea: null,
				origen: null,
				uso_cpap_bipap: null,
				observacion_uso: null,
				adherencia_cpap_bipap: null,
				observacion_adherencia: null,
				uso_oxigeno: null,
				litro_oxigeno: null,
				clasificacion_control_asma: null,
				creado_por:this.$store.state.auth.usuario.id,
			},

			rules: {
				obligatorio: (v) => v !== null && v !== undefined && v !== '' || "Este campo es obligatorio ",
			},

		}
	},
	computed: {
      ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },

	mounted() {
		// this.cargarDatos();
        const datosPatologia = this.obtenerDatosPorConsulta(this.datos.id, 'PatologiaRespiratoria/Models/PatologiaRespiratoria', 'historia/formularios/repiratoriaPatologia');

        if (datosPatologia) {
            this.patologia = {...datosPatologia}
        }
	},

	methods: {
	// 	async enviarPatologia() {
	// 		if (!this.$refs.patologiaForm.validate()) {
	// 			return;
	// 		}
	// 		try {
	// 			const data = {
	// 				...this.patologia,
	// 				consulta_id: this.datos.id
	// 			};
	// 			this.loading = true;
	// 			await this.$axios.post('/patologia-respiratoria/crear', data);
	// 			this.$toast.success('Datos Guardados Correctamente');
	// 		} catch (error) {
	// 			this.$toast.error('Ha ocurrido un Error al guardar los datos');
	// 		} finally {
	// 			this.loading = false;
	// 		}
	// 	},

		// cargarDatos() {
		// 	this.$axios.get(`patologia-respiratoria/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
		// 		this.patologia = {
		// 			...this.patologia,
		// 			...res.data
		// 		}
		// 	}).catch(error => {
		// 		console.log(error);
		// 		this.$toast.error('Error al cargar los datos');
		// 	});
		// },
		obtenerDatos() {
            // const datosRespiratoria = {
            //        ...this.patologia
            //     }
                return {
                    datos: this.patologia

                };
            },
			validarErrores() {
				return this.$refs.patologiaForm.validate();
			},
	},
}
</script>
