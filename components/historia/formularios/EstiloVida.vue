<template>
	<v-form>

		<v-col cols="12" sm="12" md="12">
			<v-alert class="text-center" text border="bottom" type="info" icon="mdi-human-handsup">
				<b>HÁBITOS DE VIDA</b></v-alert>
			<v-row dense>
				<v-col cols="12" sm="12" md="12">
					<v-alert class="text-center" dense text border="left" type="info" color="blue-grey"
						icon="mdi-head-heart">
						<b>ESTILOS DE VIDA</b></v-alert>
				</v-col>
				<v-col cols="12" sm="4" md="3">
					<v-select dense v-model="estiloVida.dieta_saludable" :items="sino"
						label="Consume frutas y verduras:">
					</v-select>
				</v-col>
				<v-col cols="12" sm="4" md="3" v-show="estiloVida.dieta_saludable === 'Si'">
					<v-select dense v-model="estiloVida.frecuencia_dieta_saludable" :items="Frecuecia"
						label="Frecuencia:">
					</v-select>
				</v-col>
				<v-col cols="12" sm="4" md="3">
					<v-select dense v-model="estiloVida.dieta_balanceada" :items="sinoaplica"
						label="Dieta balanceada baja en azúcares, sal, grasas y carbohidratos:">
					</v-select>
				</v-col>
				<v-col cols="12" sm="4" md="3">
					<v-text-field dense label="Cuantas comidas realiza en el dia" type="number"
						v-model="estiloVida.cuantas_comidas">
					</v-text-field>
				</v-col>
				<v-col cols="12" sm="4" md="4">
					<v-select v-model="estiloVida.leche"
						v-show="datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'"
						:items="sinoaplica"
						label="Durante el dia de ayer recibió leche (vaca, cabra) liquida, polvo, fresca o en bolsa?  :">
					</v-select>
				</v-col>
				<v-col cols="12" sm="4" md="4">
					<v-select v-model="estiloVida.alimento"
						v-show="datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'"
						:items="sinoaplica"
						label="Durante el dia de ayer o anoche recibió algún alimento como sopa espesa, puré, papilla, o seco? ">
					</v-select>
				</v-col>
				<v-col cols="12" sm="4" md="4">
					<v-text-field label="Edad en meses de introducción de los diferentes alimentos " type="number"
						v-model="estiloVida.introduccion_alimentos"
						v-show="datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
					</v-text-field>
				</v-col>
				<v-col cols="12" sm="4" md="4">
					<v-select dense v-model="estiloVida.sueno_reparador" :items="sino" label="Sueño Reparador:">
					</v-select>
				</v-col>
				<v-col cols="12" sm="4" md="4" v-show="estiloVida.sueno_reparador === 'Si'">
					<v-select dense v-model="estiloVida.tipo_sueno" :items="Frecuecia" label="Tipo sueño:">
					</v-select>
				</v-col>
				<v-col cols="12" sm="4" md="4">
					<v-text-field dense label="Duración sueño (Horas)" v-model="estiloVida.duracion_sueno"
						type="number">
					</v-text-field>
				</v-col>
				<v-col cols="12" sm="4" md="4"
					v-if="datos.afiliado.edad_cumplida >= 20 && datos.afiliado.edad_cumplida <= 50">
					<v-select dense v-model="estiloVida.alto_nivel_estres" :items="sino"
						label="Maneja Altos Niveles de Estres">
					</v-select>
				</v-col>
				<v-col cols="12" sm="4" md="4">
					<v-select dense label="Actividad Física" v-model="estiloVida.actividad_fisica"
						v-if="datos.afiliado.edad_cumplida > 5" :items="sino"></v-select>
				</v-col>
				<v-col cols="12" sm="4" md="4" v-if="this.estiloVida.actividad_fisica == 'Si'">
					<v-text-field label="Duración" dense v-model="estiloVida.duracion_actividad_fisica">
					</v-text-field>

				</v-col>
				<v-col cols="12" sm="4" md="4" v-if="this.estiloVida.actividad_fisica == 'Si'">
					<v-select dense v-model="estiloVida.frecuencia_actividad_fisica" :items="Frecuecia"
						label="Frecuencia:">
					</v-select>
				</v-col>
				<v-col cols="12" sm="4" md="4"
					v-show="datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
					<v-autocomplete label="Exposición a Tv, videojuegos e internet" v-model="estiloVida.exposicion"
						:items="sino">
					</v-autocomplete>
				</v-col>
				<v-col cols="12" sm="4" md="4" v-if="this.estiloVida.exposicion == 'Si'"
					v-show="datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
					<v-text-field label="Tiempo en minutos de juego" type="number"
						v-model="estiloVida.juego"></v-text-field>
				</v-col>
				<v-col cols="12" sm="4" md="4"
					v-show="datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
					<v-text-field label="¿Cuantas veces se baña al día?" type="number"
						v-model="estiloVida.bano"></v-text-field>
				</v-col>
				<v-col cols="12" sm="4" md="4"
					v-show="datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
					<v-select label="Cuidado bucal adecuado" v-model="estiloVida.bucal" :items="sino"></v-select>
				</v-col>
				<v-col cols="12" sm="4" md="4"
					v-show="datos.afiliado.edad_cumplida <= 12 && datos.cita.tipo_historia_id !== 29">
					<v-select label="Control esfinter vesical" v-model="estiloVida.esfinter" :items="sino"></v-select>
				</v-col>
				<v-col cols="12" sm="4" md="4" v-show="(datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'
					|| datos.afiliado.ciclo_vida_atencion === 'Vejez (Mayor a 60 Años)')">
					<v-text-field label="Frecuencia y caracteristicas de la orina"
						v-model="estiloVida.caracteristicas_orina">
					</v-text-field>
				</v-col>
				<v-col cols="12" sm="4" md="4"
					v-show="datos.afiliado.edad_cumplida <= 12 && datos.cita.tipo_historia_id !== 29">
					<v-text-field label="Control esfinter rectal" v-model="estiloVida.esfinter_rectal"></v-text-field>
				</v-col>
				<v-col cols="12" sm="4" md="4"
					v-show="datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
					<v-text-field label="Frecuencia y caracteristicas de las deposiciones"
						v-model="estiloVida.posiciones">
					</v-text-field>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<v-alert class="text-center" dense text border="left" type="info" color="blue-grey"
						icon="mdi-biohazard">
						<b>HÁBITOS TÓXICOS</b></v-alert>
				</v-col>
				<v-row dense>
					<!-- Switch para afiliado expuesto -->
					<v-col cols="3">
						<v-switch v-model="estiloVida.afiliado_fumador" label="Expuesto a humo" dense></v-switch>
					</v-col>
					<!-- Selección de tipo de exposición y años expuesto -->
					<v-col cols="12" sm="4" md="3" v-if="estiloVida.afiliado_fumador">
						<v-select label="Tipo de exposición"
							:items="datos.afiliado.edad_cumplida <= 13 ? [expuesto[0]] : expuesto"
							v-model="estiloVida.expuesto_humo" dense></v-select>
					</v-col>

					<!-- Detalles relacionados a fumar -->
					<v-col cols="12" sm="4" md="3"
						v-if="estiloVida.afiliado_fumador && (estiloVida.expuesto_humo !== 'No fumador' && estiloVida.expuesto_humo !== 'Fumador pasivo')">
						<v-text-field dense label="Número de cigarrillos al día" v-model="estiloVida.fuma_cantidad"
							type="number">
						</v-text-field>
					</v-col>
					<v-col cols="12" sm="4" md="3"
						v-if="estiloVida.afiliado_fumador && (estiloVida.expuesto_humo !== 'No fumador' && estiloVida.expuesto_humo !== 'Fumador pasivo')">
						<v-text-field dense label="Número de años que fumó" v-model="estiloVida.fumamos"></v-text-field>
					</v-col>

					<!-- Índice tabáquico y riesgo EPOC -->
					<v-col cols="12" sm="4" md="3"
						v-if="estiloVida.afiliado_fumador && (estiloVida.expuesto_humo !== 'No fumador' && estiloVida.expuesto_humo !== 'Fumador pasivo')">
						<v-text-field dense label="Índice Tabáquico" readonly
							v-model="estiloVida.tabaquico"></v-text-field>
					</v-col>
					<v-col cols="12" sm="4" md="3"
						v-if="estiloVida.afiliado_fumador && (estiloVida.expuesto_humo !== 'No fumador' && estiloVida.expuesto_humo !== 'Fumador pasivo')">
						<v-text-field dense label="Riesgo EPOC" readonly
							v-model="estiloVida.riesgo_epoc"></v-text-field>
					</v-col>

					<!-- Exposición a sustancias psicoactivas -->
					<v-col cols="12"></v-col>
					<v-col cols="3">
						<v-switch v-model="afiliadoPsicoactivo" label="¿Expuesto a sustancias psicoactivas?"
							dense></v-switch>
					</v-col>

					<input type="hidden" v-model="estiloVida.expuesto_psicoactivos" />

					<v-col cols="12" sm="4" md="4"
						v-if="estiloVida.expuesto_psicoactivos === 'Si' && datos.afiliado.edad_cumplida >= 13">
						<v-select dense label="Frecuencia de exposición sustancias"
							v-model="estiloVida.anios_expuesto_sustancias" :items="frecuenciaspa"></v-select>
					</v-col>
					<v-col cols="12" sm="4" md="2"
						v-if="estiloVida.expuesto_psicoactivos === 'Si' && datos.afiliado.edad_cumplida >= 13">
						<v-text-field dense label="Fecha de inicio consumo sustancias" type="date"
							v-model="estiloVida.consumo_psicoactivo" :max="hoy"></v-text-field>
					</v-col>
					<v-col cols="12" sm="4" md="3"
						v-if="estiloVida.expuesto_psicoactivos === 'Si' && datos.afiliado.edad_cumplida >= 13">
						<v-text-field dense label="Cantidad consumo sustancias"
							v-model="estiloVida.psicoactivo_cantidad" type="number"></v-text-field>
					</v-col>

					<!-- bebidas alcohólicas -->
					<v-col cols="12"></v-col>
					<template v-if="datos.afiliado.edad_cumplida >= 11">
						<v-col cols="3">
							<v-switch v-model="afiliadoAlcoholicas" label="Consume bebidas alcohólicas"
								dense></v-switch>
						</v-col>

						<v-col cols="12" sm="4" md="3" v-if="afiliadoAlcoholicas">
							<v-autocomplete dense label="Cantidad de tragos de licor"
								v-model="estiloVida.cantidad_licor" :items="cantidadLicor"></v-autocomplete>
						</v-col>
						<v-col cols="12" sm="4" md="3" v-if="afiliadoAlcoholicas">
							<v-autocomplete dense :items="frecuenciaConsumo"
								label="Frecuencia consumo bebidas alcohólicas" v-model="estiloVida.licor_frecuencia">
							</v-autocomplete>
						</v-col>
					</template>
					<!-- Observaciones generales -->
					<v-col cols="12" sm="12" md="12" align-end>
						<v-textarea label="Observaciones adicionales"
							v-model="estiloVida.estilo_vida_observaciones"></v-textarea>
					</v-col>
				</v-row>


			</v-row>
		</v-col>
	</v-form>
</template>
<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';

export default {
	name: "",
	props: ['datos', 'resumen'],
	// created() {
	//  // this.estiloVida = this.resumen;
	// },
	data() {
		return {
			hoy: this.$moment().format("YYYY-MM-DD"),
			afiliadoExpuesto: false,
			afiliadoAlcoholicas: false,
			afiliadoPsicoactivo: false,
			data: {},
			preload_liveStyle: false,
			estiloVida: {
				consume_alcohol: false,
				dieta_saludable: null,
				dieta_balanceada: null,
				cuantas_comidas: null,
				leche: null,
				alimento: null,
				introduccion_alimentos: null,
				sueno_reparador: null,
				tipo_sueno: null,
				duracion_sueno: null,
				alto_nivel_estres: null,
				actividad_fisica: null,
				duracion_actividad_fisica: null,
				frecuencia_actividad_fisica: null,
				exposicion: null,
				juego: null,
				bano: null,
				bucal: null,
				posiciones: null,
				esfinter: null,
				esfinter_rectal: null,
				caracteristicas_orina: null,
				anios_expuesto: null,
				expuesto_humo: null,
				expuesto_psicoactivos: null,
				anios_expuesto_sustancias: null,
				fuma_cantidad: null,
				fumamos: null,
				tabaquico: null,
				riesgo_epoc: null,
				consumo_psicoactivo: null,
				psicoactivo_cantidad: null,
				licor_frecuencia: null,
				cantidad_licor: null,
				estilo_vida_observaciones: null,
				frecuencia_dieta_saludable: null
			},
			sino: ['Si', 'No'],
			expuesto: ['Fumador pasivo', 'Fumador activo', 'Exfumador', 'No fumador'],
			anosexpuesto: ['Menor a 10 años', 'Entre 10 a 20 años', 'mas de 20 años'],
			sinoaplica: ['Si', 'No', 'No Aplica'],
			Frecuecia: ['Diario', '2 a 3 veces en la semana', 'cada semana'],
			frecuenciaConsumo: ['Una o menos veces al mes', 'De 2 a 4 veces al mes',
				'De 2 a 3 veces a la semana', '4 o mas veces a la semana'
			],
			cantidadLicor: ['1 o 2', '3 o 4', '5 o 6', '7,8 o 9', '10 o mas'],
			frecuenciaspa: ['Diaria', 'Semanal', 'Mensual', 'Ocasional'],
		};
	},
	watch: {
		"estiloVida.fumamos": function () {
			this.calcularIndiceTabaquico();
		},
		afiliadoExpuesto(newValue) {
			this.estiloVida.expuesto_humo = newValue ? "Si" : "No";
		},
		afiliadoAlcoholicas(newValue) {
			this.estiloVida.consume_alcohol = newValue ? "Si" : "No";
		},
		afiliadoPsicoactivo(newValue) {
			this.estiloVida.expuesto_psicoactivos = newValue ? "Si" : "No";
			if (!newValue) {
				this.estiloVida.anios_expuesto_sustancias = null;
				this.estiloVida.consumo_psicoactivo = null;
				this.estiloVida.psicoactivo_cantidad = null;
			}
		},

		'estiloVida.expuesto_humo': {
			deep: true,
			handler(newVal, oldVal) {
				this.setEstiloVida(newVal);
			},
		}

	},
	mounted() {
		this.obtenerDatosEstiloVida();
		const datosEstiloVida = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/EstiloVida');

		if (datosEstiloVida) {
			this.estiloVida = { ...datosEstiloVida }
		}
	},
	computed: {
		...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
	},
	methods: {
		...mapActions("medidas", ["setEstiloVida"]),
		obtenerDatos() {
			return { datos: this.estiloVida };
		},
		validarErrores() {
			return [];
		},
		calcularIndiceTabaquico() {
			this.estiloVida.tabaquico =
				(parseInt(this.estiloVida.fuma_cantidad) *
					parseInt(this.estiloVida.fumamos)) /
				20;

			if (this.estiloVida.tabaquico < 10) {
				this.estiloVida.riesgo_epoc = 'Nulo'
			} else if (this.estiloVida.tabaquico >= 10 && this.estiloVida.tabaquico <= 20) {
				this.estiloVida.riesgo_epoc = 'Moderado'
			} else if (this.estiloVida.tabaquico >= 21 && this.estiloVida.tabaquico <= 40) {
				this.estiloVida.riesgo_epoc = 'Intenso'
			} else if (this.estiloVida.tabaquico > 40) {
				this.estiloVida.riesgo_epoc = 'Alto'
			}

		},

		obtenerDatosEstiloVida() {
			this.$axios.get(`historia/obtenerDatosEstiloVida/${this.datos.afiliado.id}`)
				.then(res => {
					Object.keys(res.data).forEach(key => {
						this.$set(this.estiloVida, key, res.data[key]);
					});
				})
				.catch(error => {
					console.error('Error al obtener los datos:', error);
					this.$toast.error('Error al obtener los datos del estilo de vida');
				});
		},

	}
};

</script>
<style scoped></style>
