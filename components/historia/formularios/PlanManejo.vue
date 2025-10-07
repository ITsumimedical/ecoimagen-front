<template>
	<div>
		<v-form ref="PlanManejo" lazy-validation>
			<v-row v-if="this.datos.cita.tipo_historia_id === 1">
				<v-col cols="12" sm="12" md="12">
					<v-alert color="info" text dense border="left" class="text-center" icon="mdi-pill"><b>CONCILIACIÓN MEDICAMENTOSA</b></v-alert>
				</v-col>
				<v-col cols="12" sm="12" md="12" class="d-flex justify-center">
				<strong>¿Se realizó conciliación medicamentosa?</strong>
			</v-col>
				<v-col class="d-flex justify-center" cols="12" sm="12" md="12">
					<v-radio-group v-model="resumen.conciliacion_medicamentosa" row :rules="conciliacioRequerida">
						<v-radio label="Si" :value="true"></v-radio>
						<v-radio label="No" :value="false"></v-radio>
					</v-radio-group>
				</v-col>
			</v-row>
			<v-col cols="12" sm="12" md="12">
				<v-row dense>
					<v-col xs="12" sm="12" md="12" v-if="this.datos.cita.tipo_historia_id !== 4">
						<v-alert class="text-center" border="left" dense text type="info" icon="mdi-doctor">
							<b>ANALISIS Y PLAN DE MANEJO</b>
						</v-alert>
					</v-col>
					<v-col xs="12" sm="12" md="12" v-if=" this.datos.cita.tipo_historia_id ==35">
						<v-textarea dense outlined auto-grow v-model="resumen.analisis"
							label="Analisis" required>
						</v-textarea>
					</v-col>
					<v-col xs="12" sm="12" md="12" v-if="this.datos.cita.tipo_historia_id ==35">
						<v-textarea dense outlined auto-grow v-model="resumen.plan_manejo"
							label="Plan de manejo" required
							:rules="[v => !!v || 'El campo Analisis y plan de manejo es requerido']">
						</v-textarea>
					</v-col>
					<v-col xs="12" sm="12" md="12" v-if="this.datos.cita.tipo_historia_id !== 4 && this.datos.cita.tipo_historia_id !==35">
						<v-textarea dense outlined auto-grow v-model="resumen.plan_manejo"
							label="Analisis y plan de manejo" required
							:rules="[v => !!v || 'El campo Analisis y plan de manejo es requerido']">
						</v-textarea>
					</v-col>
				</v-row>
				<v-row>
					<v-col xs="12" sm="12" md="12">
						<v-alert class="text-center" dense text type="info" icon="mdi-doctor">
							<b>RECOMENDACIONES</b>
						</v-alert>
						<template>
							<v-container fluid>
								<v-row dense>
									<v-col cols="11">
										<v-textarea outlined dense auto-grow v-model="resumen.recomendaciones"
											label="Recomendaciones"
											:rules="[v => (this.datos.cita.tipo_historia_id === 4 && !v) ? 'Campo obligatorio' : []]">
										</v-textarea>
									</v-col>
									<v-col cols="1">
										<v-tooltip top>
											<template v-slot:activator="{ on, attrs }">
												<v-btn icon v-bind="attrs" v-on="on"
													@click="listarRecomendacionesCondicionadas()">
													<v-icon color="info">
														mdi-message-bulleted
													</v-icon>
												</v-btn>
											</template>
											<span>Recomendaciones preestablecidas</span>
										</v-tooltip>
									</v-col>
								</v-row>
							</v-container>

							<v-dialog v-model="dialogoAbierto" max-width="1800px">
								<v-card>
									<v-alert text dense border="left" color="blue-grey" icon="mdi-message-bulleted">
										Recomendaciones
									</v-alert>
									<v-card-text>
										<v-data-table disable-filtering disable-pagination hide-default-footer
											no-data-text="Sin recomendaciones" :headers="headers"
											:items="recomendacionesFiltradas" item-value="descripcion" show-select dense
											v-model="seleccionadas"></v-data-table>
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn small @click="cerrarDialogo" color="red" dark>Cancelar</v-btn>
										<v-btn small color="success" @click="guardarSeleccionadas()">Guardar</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</template>
					</v-col>
				</v-row>
			</v-col>

			<v-row v-if="this.datos.cita.tipo_historia_id === 26">
				<v-col cols="12" sm="6" md="6">
					<v-alert text dense color="warning" icon="mdi-percent" class="text-center" border="left">
						<b>PORCENTAJE DE
							REHABILITACIÓN:</b>
					</v-alert>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-alert text dense color="warning" icon="mdi-needle" class="text-center" border="left">
						<b>ADHERENCIA AL
							TRATAMIENTO:</b>
					</v-alert>
				</v-col>

				<v-col cols="12" sm="6" md="6">
					<v-textarea label="Descripción" dense outlined auto-grow
						v-model="resumen.porcentaje_rehabilitacion">
					</v-textarea>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-textarea label="Descripción" dense outlined auto-grow v-model="resumen.adherencia_tratamiento">
					</v-textarea>
				</v-col>
			</v-row>

			<template>
				<v-col cols="12" sm="12" md="12">
					<v-alert text prominent dense class="text-center" color="info"
						icon="mdi-checkbox-marked-circle-plus-outline">
						<b>REMISION A PROGRAMAS</b></v-alert>
				</v-col>
				<v-col cols="12" md="12" sm="12">
					<v-autocomplete label="Programas" multiple chips outlined dense :items="remisionProgramasItems" item-text="nombre"
						v-model="remisionPrograma.remision_programa">
					</v-autocomplete>
				</v-col>
				<v-col cols="12" md="12" sm="12">
					<v-textarea label="Observación" dense auto-grow outlined v-model="remisionPrograma.observacion">
					</v-textarea>
				</v-col>
				<v-col>
					<v-card-actions class="justify-center">
						<v-btn color="success" small @click="agregarRemisionPrograma()" :loading="loading"
							:disabled="loading">
							Agregar remisión</v-btn>
					</v-card-actions>
				</v-col>
			</template>

			<v-data-table :headers="headersRemision" :items="remision" :loading="loading"
				no-data-text="Cargando... Por Favor Espere" disable-pagination>

				<template v-slot:[`item.acciones`]="{ item }">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }"
							v-if="item.medico_registra === $store.state.auth.usuario.id">
							<v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
								@click="eliminarItem(item)">
								mdi-delete
							</v-icon>
						</template>
						<span>Eliminar</span>
					</v-tooltip>

				</template>

				<template v-slot:[`item.medico`]="{ item }">
					{{ item.nombre }} {{ item.apellido }}
				</template>
			</v-data-table>


			<v-col xs="12" sm="12" md="12" v-show="datos.cita.nombre === 'Control Prenatal (30 Min)'">
				<v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
					<b>CURSO PROFILÁCTICO Y ASESORIA EN INTERRUPCIÓN VOLUNTARIA DEL EMBARAZO</b></v-alert>
			</v-col>
			<v-col xs="12" sm="6" md="6" v-show="datos.cita.nombre === 'Control Prenatal (30 Min)'">
				<v-select v-model="resumen.curso_profilactico" :items="sino"
					label="¿Recibio usted el curso profiláctico?:">
				</v-select>
			</v-col>
			<v-col xs="12" sm="6" md="6" v-show="datos.cita.nombre === 'Control Prenatal (30 Min)'">
				<v-select v-model="resumen.asesoriaive" :items="sino"
					label="¿Recibio usted asesoria en interrupción voluntaria del embarazo:">
				</v-select>
			</v-col>
			<v-col xs="12" sm="12" md="12">
				<v-alert class="text-center" dense text type="info" icon="mdi-account-check">
					<b>FINALIDAD Y DESTINO DEL PACIENTE</b></v-alert>
			</v-col>
			<v-container fluid:>
				<v-row dense>
					<v-col xs="12" sm="12" md="4">
						<v-autocomplete dense :items="filtroDestinoPaciente" label="Destino del paciente" v-if="datos.cita.tipo_historia_id !=35"
							append-icon="mdi-magnify" v-model="resumen.destino_paciente"
							:rules="[v => !!v || 'El campo destino del paciente es requerido']">
						</v-autocomplete>
						<v-autocomplete dense :items="filtroDestinoPacienteUrg" label="Destino del paciente" v-if="datos.cita.tipo_historia_id ==35"
							append-icon="mdi-magnify" v-model="resumen.destino_paciente"
							:rules="[v => !!v || 'El campo destino del paciente es requerido']">
						</v-autocomplete>
					</v-col>
					<v-col xs="12" sm="4" v-if="resumen.destino_paciente === 'Hospitalización (Remision)'">
						<v-autocomplete dense :items="especialidades" label="Especialidad:"
							:rules="especialidadRequerida"
							no-planesdeManejo-text="No se encuentra especialidad con ese nombre"
							item-text="text"
							item-value="value"
							v-model="resumen.especialidad" />
					</v-col>
					<v-col xs="12" sm="4" v-if="resumen.destino_paciente === 'Hospitalización (Remision)'">
						<v-autocomplete dense :items="cupsReferenciaHospitalizacion" label="Cup internación:"
							:rules="cupHospitalizacionRequerido"
							no-planesdeManejo-text="No se encuentra cup con ese nombre"
							v-model="resumen.cup_referencia_hospitalizacion" />
					</v-col>
					<v-col xs="12" sm="4">
						<v-autocomplete dense :items="finalidades" item-text="nombre" item-value="id" label="Finalidad"
							append-icon="mdi-magnify" v-model="resumen.finalidad_id" required
							:rules="[v => !!v || 'El campo Finalidad es requerido']" :loading="cargandoDato">
						</v-autocomplete>
					</v-col>
					<v-col xs="12" sm="4">
						<v-autocomplete dense :items="consultasExternas" label="Causa Externa" item-value="id"
							item-text="nombre" item-label="Consulta Externa" append-icon="mdi-magnify"
							v-model="resumen.causa_consulta_externa_id" required :loading="cargando"
							:rules="[v => !!v || 'El campo Causa Externa es requerido']">
						</v-autocomplete>
					</v-col>
				</v-row>
			</v-container>
			<v-col v-if="[16, 17, 19].includes(datos.cita.tipo_historia_id)">
				<v-col>
					<v-alert text color="blue" class="text-center" icon="mdi-account-plus-outline" dense prominent>
						<b>NOTA DE EVOLUCIÓN</b>
					</v-alert>
				</v-col>
				<v-col cols="12" md="12" sm="12">
					<v-textarea auto-grow label="Nota de evolución" v-model="resumen.nota_evolucion">
					</v-textarea>
				</v-col>
			</v-col>
			<!-- <v-col cols="12" sm="6" md="12" class="text-right">
				<v-spacer></v-spacer>
				<v-btn color="boton" small dark @click="guardarRegistros()">guardar</v-btn>
			</v-col> -->
		</v-form>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
	name: "",
	props: ['datos'],
	created() {
      const planManejo = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/PlanManejo');
            if (planManejo) {
               this.resumen = { ...planManejo}
            }
		// this.planes_manejo = this.resumen;
	},
	data() {
		return {
			dialogoAbierto: false,
			preloadHistoria: false,
			loading: false,
			cargando: false,
			remisionProgramasItems: '',
			cargandoDato: false,
            resumen: {
                plan_manejo: '',
                recomendaciones: '',
                destino_paciente: '',
                finalidad_id: null,
                especialidad: null,
                curso_profilactico: null,
                asesoriaive: null,
                causa_consulta_externa_id: null,
            },
			remisionPrograma: {
				remision_programa: [],
				observacion: ''
			},
			especialidadRequerida: [
				v => !!v || 'Este campo es requerido',
			],
			cupHospitalizacionRequerido:[
			v => !!v || 'Este campo es requerido',
			],
			conciliacioRequerida: [
            v => v !== null && v !== undefined && v !== '' || 'Este campo es requerido',
			],
			planes_manejo: {
				plan_manejo: null,
				recomendaciones: null,
				destino_paciente: null,
				finalidad_id: null,
				especialidad: null,
				curso_profilactico: null,
				asesoriaive: null,
				causa_consulta_externa_id: null,
			},
			sino: ['Si', 'No'],

			headersRemision: [
				{
					text: "Programa",
					value: "remision_programa",
					align: "center",
				},
				{
					text: "Observacion",
					value: "observacion",
					align: "center",
				},
				{
					text: 'Registrado por',
					value: 'medico'
				},
				{
					text: "Acciones",
					value: "acciones",
					align: "center",
				}
			],
			// externa: [{
			//     value: '01',
			//     nombre: 'Accidente de trabajo'
			//   },
			//   {
			//     value: '02',
			//     nombre: 'Accidente de tránsito'
			//   },
			//   {
			//     value: '03',
			//     nombre: 'Accidente rábico'
			//   },
			//   {
			//     value: '04',
			//     nombre: 'Accidente ofídico'
			//   },
			//   {
			//     value: '05',
			//     nombre: 'Otro tipo de accidente'
			//   },
			//   {
			//     value: '06',
			//     nombre: 'Evento catastrófico'
			//   },
			//   {
			//     value: '07',
			//     nombre: 'Lesión por agresión'
			//   },
			//   {
			//     value: '08',
			//     nombre: 'Lesión auto inflingida'
			//   },
			//   {
			//     value: '09',
			//     nombre: 'Sospecha de maltrato físico'
			//   },
			//   {
			//     value: '10',
			//     nombre: 'Sospecha de abuso sexual'
			//   },
			//   {
			//     value: '11',
			//     nombre: 'Sospecha de violencia sexual'
			//   },
			//   {
			//     value: '12',
			//     nombre: 'Sospecha de maltrato emocional'
			//   },
			//   {
			//     value: '13',
			//     nombre: 'Enfermedad general'
			//   },
			//   {
			//     value: '14',
			//     nombre: 'Enfermedad profesional'
			//   },
			//   {
			//     value: '15',
			//     nombre: 'Otra'
			//   },
			// ],
			consultasExternas: [],
			especialidades: [
				{text:'ALERGOLOGIA',value:356},
				{text:'ANESTESIOLOGIA', value:301},
				{text:'AUDIOLOGIA', value:740},
				{text:'BIOENERGETICA',value:417},
				{text:'CARDIOLOGIA',value:302},
				{text:'CIRUGIA BARIATRICA', value:367},
				{text:'CIRUGIA CARDIOVASCULAR',value:303},
				{text:'CIRUGIA GENERAL',value:304},
				{text:'CIRUGIA MAXILOFACIAL',value:411},
				{text:'CIRUGIA PLASTICA',value:369},
				{text:'COLOPROCTOLOGIA',value:377},
				{text:'DERMATOLOGIA',value:308},
				{text:'ENDOCRINOLOGIA',value:310},
				{text:'GINECOLOGIA Y OBSTETRICIA',value:320},
				{text:'HEMATOLOGIA',value:321},
				{text:'INFECTOLOGIA',value:323},
				{text:'MASTOLOGIA',value:356},
				{text:'MEDICINA DEL DEPORTE',value:326},
				{text:'MEDICINA DEL DOLOR',value:309},
				{text:'MEDICINA DEL TRABAJO',value:407},
				{text:'MEDICINA FAMILIAR',value:325},
				{text:'MEDICINA FISICA Y REHABILITACION',value:327},
				{text:'MEDICINA GENERAL',value:328},
				{text:'MEDICINA INTERNA',value:329},
				{text:'NEFROLOGIA',value:330},
				{text:'NEUMOLOGIA',value:331},
				{text:'NEUROCIRUGIA',value:387},
				{text:'NEUROLOGIA',value:332},
				{text:'OFTALMOLOGIA',value:335},
				{text:'ONCOLOGIA CLINICA',value:336},
				{text:'ORTOPEDIA Y TRAUMATOLOGIA',value:339},
				{text:'OTORRINOLARINGOLOGIA',value:340},
				{text:'PEDIATRIA',value:342},
				{text:'PSIQUIATRIA',value:345},
				{text:'REUMATOLOGIA',value:348},
				{text:'TOXICOLOGIA CLINICA',value:354},
				{text:'UROLOGIA',value:355},
			],
			cupsReferenciaHospitalizacion:[
			'105M01	INTERNACIÓN EN UNIDAD DE CUIDADO INTERMEDIO NEONATAL',
			'106M01	INTERNACIÓN EN UNIDAD DE CUIDADO INTERMEDIO PEDIÁTRICO',
			'106M02	INTERNACIÓN EN UNIDAD DE CUIDADO INTERMEDIO PEDIÁTRICO PACIENTE QUEMADO',
			'107M01	INTERNACIÓN EN UNIDAD DE CUIDADO INTERMEDIO ADULTO',
			'107M02	INTERNACIÓN EN UNIDAD DE CUIDADO INTERMEDIO ADULTO PACIENTE QUEMADO',
			'108A01	INTERNACIÓN EN UNIDAD DE CUIDADO INTENSIVO NEONATAL',
			'109A01	INTERNACIÓN EN UNIDAD DE CUIDADO INTENSIVO PEDIÁTRICO',
			'109A02	INTERNACIÓN EN UNIDAD DE CUIDADO INTENSIVO PEDIÁTRICO PACIENTE QUEMADO',
			'109A03	INTERNACIÓN EN UNIDAD DE CUIDADO INTENSIVO PEDIÁTRICO PACIENTE TRASPLANTADO',
			'110A01	INTERNACIÓN EN UNIDAD DE CUIDADO INTENSIVO ADULTOS',
			'110A02	INTERNACIÓN EN UNIDAD DE CUIDADO INTENSIVO ADULTOS PACIENTE QUEMADO',
			'110A03	INTERNACIÓN EN UNIDAD DE CUIDADO INTERMEDIO ADULTO PACIENTE TRASPLANTADO',
			'120B01	INTERNACIÓN EN UNIDAD DE CUIDADO BÁSICO NEONATAL(CUNA O INCUBADORA)',
			'129A01	INTERNACIÓN ADULTOS COMPLEJIDAD ALTA HABITACION INDIVIDUAL(INCLUYE AISLAMIENTO GENERAL Y PARA TRASPLANTE DE CÉLULAS PROGENITORAS)',
			'129A02	INTERNACIÓN ADULTOS COMPLEJIDAD ALTA HABITACION MÚLTIPLE',
			'129B01	INTERNACIÓN ADULTOS COMPLEJIDAD BAJA HABITACIÓN INDIVIDUAL(INCLUYE AISLAMIENTO)',
			'129B02	INTERNACIÓN ADULTOS COMPLEJIDAD BAJA HABITACION MÚLTIPLE',
			'129M01	INTERNACIÓN ADULTOS COMPLEJIDAD MEDIANA HABITACION INDIVIDUAL(INCLUYE AISLAMIENTO GENERAL Y PARA TRASPLANTE DE CÉLULAS PROGENITORAS)',
			'129M02	INTERNACIÓN ADULTOS COMPLEJIDAD MEDIANA HABITACION MÚLTIPLE',
			'130A01	INTERNACIÓN PEDIÁTRICA COMPLEJIDAD ALTA HABITACION INDIVIDUAL(INCLUYE AISLAMIENTO GENERAL Y PARA TRASPLANTE DE CÉLULAS PROGENITORAS)',
			'130A02	INTERNACIÓN PEDIÁTRICA COMPLEJIDAD ALTA HABITACION MÚLTIPLE',
			'130B01	INTERNACIÓN PEDIÁTRICA COMPLEJIDAD BAJA HABITACIÓN INDIVIDUAL(INCLUYE AISLAMIENTO)',
			'130B02	INTERNACIÓN PEDIÁTRICA COMPLEJIDAD BAJA HABITACION MÚLTIPLE',
			'130M01	INTERNACIÓN PEDIÁTRICA COMPLEJIDAD MEDIANA HABITACION INDIVIDUAL(INCLUYE AISLAMIENTO GENERAL Y PARA TRASPLANTE DE CÉLULAS PROGENITORAS)',
			'130M02	INTERNACIÓN PEDIÁTRICA COMPLEJIDAD MEDIANA HABITACION MÚLTIPLE',
			'131A01	INTERNACIÓN EN UNIDAD DE SALUD MENTAL, COMPLEJIDAD ALTA, HABITACIÓN INDIVIDUAL(INCLUYE AISLAMIENTO)',
			'131A02	INTERNACIÓN EN UNIDAD DE SALUD MENTAL, COMPLEJIDAD ALTA, HABITACIÓN MÚLTIPLE',
			'131M01	INTERNACIÓN EN UNIDAD DE SALUD MENTAL, COMPLEJIDAD MEDIANA, HABITACIÓN INDIVIDUAL(INCLUYE AISLAMIENTO)',
			'131M02	INTERNACIÓN EN UNIDAD DE SALUD MENTAL, COMPLEJIDAD MEDIANA, HABITACIÓN MÚLTIPLE',
			'132P01	INTERNACIÓN PARCIAL EN INSTITUCIÓN HOSPITALARIA',
			'132P02	INTERNACIÓN PARCIAL EN INSTITUCIÓN NO HOSPITALARIA',
			'133M01	INTERNACIÓN DE PACIENTE CRÓNICO TERMINAL CON VENTILADOR COMPLEJIDAD MEDIANA',
			'134B01	INTERNACIÓN DE PACIENTE CRÓNICO TERMINAL SIN VENTILADOR COMPLEJIDAD BAJA',
			'134M01	INTERNACIÓN DE PACIENTE CRÓNICO TERMINAL SIN VENTILADOR COMPLEJIDAD MEDIANA',
			'135A01	INTERNACIÓN POR CONSUMO DE SUSTANCIAS PSICOACTIVAS, COMPLEJIDAD ALTA, HABITACIÓN INDIVIDUAL(INCLUYE AISLAMIENTO)',
			'135A02	INTERNACIÓN POR CONSUMO DE SUSTANCIAS PSICOACTIVAS, COMPLEJIDAD ALTA, HABITACIÓN MÚLTIPLE',
			'135M01	INTERNACIÓN POR CONSUMO DE SUSTANCIAS PSICOACTIVAS, COMPLEJIDAD MEDIANA, HABITACIÓN INDIVIDUAL(INCLUYE AISLAMIENTO)',
			'135M02	INTERNACIÓN POR CONSUMO DE SUSTANCIAS PSICOACTIVAS, COMPLEJIDAD MEDIANA, HABITACIÓN MÚLTIPLE'
			],
			destinoPaciente: ['Control', 'Interconsulta', 'Domiciliaria',
				'Urgencias', 'Hospitalización (Remision)', 'Contrarreferencia (Anexo 10)'
			],
			filtroDestinoPacienteUrg: ['Domiciliaria','Urgencias',],
			// finalidad: [
			//   'Atención del parto, del embarazo y posparto', 'Atención del recién nacido',
			//   'Atención planificación familiar', 'Atención crecimiento y desarrollo',
			//   'Atención joven Sano', 'Detección alteraciones del embarazo',
			//   'Detección alteraciones del adulto', 'Detección alteraciones agudeza Visual',
			//   'Enfermedad Profesional', 'Teleconsulta', 'No aplica'
			// ]
			finalidades: [],
			recomendacionesObtenidas: [],
			headers: [{
				text: "Recomendación",
				value: "descripcion"
			},],
			seleccionadas: [],
			remision: [],
		}
	},

	computed: {
		filtroDestinoPaciente() {
			if (this.datos.cita.tipo_historia_id === 1) {
				return this.destinoPaciente.filter(item => item === 'Control' || item === 'Interconsulta' || item ===
					'Domiciliaria' || item === 'Urgencias' || item === 'Hospitalización (Remision)' || item ===
					'Contrarreferencia (Anexo 10)');
			} else {
				return this.destinoPaciente;
			}
		},
		recomendacionesFiltradas() {
			const existentes = (this.resumen.recomendaciones || "").split("\n");
			return (Array.isArray(this.recomendacionesObtenidas) ? this.recomendacionesObtenidas : []).filter(
				(rec) => !existentes.includes(rec.descripcion)
			);
		},
		programaDemandaInducida() {
			const edadAfiliado = this.datos.afiliado.edad_cumplida;
			const sexoAfiliado = this.datos.afiliado.sexo;

			if (edadAfiliado >= 0 && edadAfiliado <= 5) {
				return [
					'VACUNACION',
					'CONSULTA PRIMERA INFANCIA  (0-5 años)',
					'CONTROL RECIEN NACIDO',
					'SALUD ORAL',
					'TALLERES EDUCATIVOS',
					'RIESGO CARDIOVASCULAR',
					'EVENTOS SALUD PUBLICA',
					'OTROS PROGRAMAS'
				];
			} else if (edadAfiliado >= 6 && edadAfiliado <= 11) {
				return [
					'VACUNACION',
					'CONSULTA INFANCIA (6-11años)',
					'SALUD ORAL',
					'TALLERES EDUCATIVOS',
					'RIESGO CARDIOVASCULAR',
					'EVENTOS SALUD PUBLICA',
					'OTROS PROGRAMAS'
				];
			} else if (edadAfiliado >= 12 && edadAfiliado <= 17 && sexoAfiliado === 'M') {
				return [
					'VACUNACION',
					'CONSULTA ADOLESCENCIA (12-17 años)',
					'SALUD ORAL',
					'PRECONCEPCIONAL',
					'PLANIFICACIÓN FAMILIAR',
					'TALLERES EDUCATIVOS',
					'RIESGO CARDIOVASCULAR',
					'EVENTOS SALUD PUBLICA',
					'OTROS PROGRAMAS'
				];
			} else if (edadAfiliado >= 12 && edadAfiliado <= 17 && sexoAfiliado === 'F') {
				return [
					'VACUNACION',
					'CONSULTA ADOLESCENCIA (12-17 años)',
					'PLANIFICACIÓN FAMILIAR',
					'PRECONCEPCIONAL',
					'CONTROL PRENATAL',
					'CONSULTA NUTRICION PRENATAL',
					'ASESORIA  LACTANCIA',
					'CURSO PSICOPROFILACTICO',
					'CITOLOGIA',
					'CONTROL POSPARTO',
					'SALUD ORAL',
					'TALLERES EDUCATIVOS',
					'RIESGO CARDIOVASCULAR',
					'EVENTOS SALUD PUBLICA',
					'OTROS PROGRAMAS'
				];
			} else if (edadAfiliado >= 18 && edadAfiliado <= 28 && sexoAfiliado === 'M') {
				return [
					'VACUNACION',
					'CONSULTA JUVENTUD (18-28 años)',
					'SALUD ORAL',
					'PRECONCEPCIONAL',
					'PLANIFICACIÓN FAMILIAR',
					'TALLERES EDUCATIVOS',
					'RIESGO CARDIOVASCULAR',
					'EVENTOS SALUD PUBLICA',
					'OTROS PROGRAMAS'
				];
			} else if (
				edadAfiliado >= 18 &&
				edadAfiliado <= 28 &&
				sexoAfiliado === "F"
			) {
				return [
					"VACUNACION",
					"CONSULTA JUVENTUD (18-28 años)",
					"SALUD ORAL",
					"PLANIFICACIÓN FAMILIAR",
					"TALLERES EDUCATIVOS",
					"RIESGO CARDIOVASCULAR",
					"EVENTOS SALUD PUBLICA",
					"OTROS PROGRAMAS",
				]
			} else if (edadAfiliado >= 29 && edadAfiliado <= 59 && sexoAfiliado === 'F') {
				return [
					'VACUNACION',
					'CONSULTA ADULTEZ (29-59 años)',
					'PLANIFICACIÓN FAMILIAR',
					'PRECONCEPCIONAL',
					'CONTROL PRENATAL',
					'CONSULTA NUTRICION PRENATAL',
					'ASESORIA  LACTANCIA',
					'CURSO PSICOPROFILACTICO',
					'CITOLOGIA',
					'MAMOGRAFIA',
					'CONTROL POSPARTO',
					'CONTROL RECIEN NACIDO',
					'SALUD ORAL',
					'TALLERES EDUCATIVOS',
					'RIESGO CARDIOVASCULAR',
					'EVENTOS SALUD PUBLICA',
					'OTROS PROGRAMAS'
				];
			} else if (edadAfiliado >= 29 && edadAfiliado <= 59 && sexoAfiliado === 'M') {
				return [
					'VACUNACION',
					'CONSULTA ADULTEZ (29-59 años)',
					'PLANIFICACIÓN FAMILIAR',
					'PRECONCEPCIONAL',
					'CURSO PSICOPROFILACTICO',
					'TAMIZAJE PROSTATA',
					'SALUD ORAL',
					'TALLERES EDUCATIVOS',
					'RIESGO CARDIOVASCULAR',
					'EVENTOS SALUD PUBLICA',
					'OTROS PROGRAMAS'
				];
			} else if (edadAfiliado >= 60 && sexoAfiliado === 'M') {
				return [
					'VACUNACION',
					'CONSULTA VEJEZ (60 años o más)',
					'PLANIFICACIÓN FAMILIAR',
					'TALLERES EDUCATIVOS',
					'RIESGO CARDIOVASCULAR',
					'EVENTOS SALUD PUBLICA',
					'OTROS PROGRAMAS'
				];
			} else if (edadAfiliado >= 60 && sexoAfiliado === 'F') {
				return [
					'VACUNACION',
					'CONSULTA VEJEZ (60 años o más)',
					'PLANIFICACIÓN FAMILIAR',
					'SALUD ORAL',
					'TALLERES EDUCATIVOS',
					'RIESGO CARDIOVASCULAR',
					'EVENTOS SALUD PUBLICA',
					'OTROS PROGRAMAS'
				];
			}
			return []
		},
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
	},

	mounted() {
		this.listarFinalidades();
		this.listarConsultasExternas();
		this.listarRecomendacionesCondicionadas();
		this.listarProgramasPorEdadYSexo()
		this.listarPorConsultaId();
	},
	methods: {
		llenarConDatos(datosHorus) {
			console.log('PlanManejo - Recibiendo datos de HorusVoice:', datosHorus);
			
			try {
				// Llenar plan de manejo con el resumen formal o diagnóstico
				if (datosHorus.resumen_formal && datosHorus.resumen_formal.trim()) {
					this.resumen.plan_manejo = datosHorus.resumen_formal;
					console.log('Plan de manejo llenado con resumen_formal:', datosHorus.resumen_formal);
				} else if (datosHorus.diagnostico_presuntivo && datosHorus.diagnostico_presuntivo.trim()) {
					this.resumen.plan_manejo = `Diagnóstico presuntivo: ${datosHorus.diagnostico_presuntivo}`;
					console.log('Plan de manejo llenado con diagnostico_presuntivo:', datosHorus.diagnostico_presuntivo);
				}
				
				// Construir recomendaciones combinando médicas y generales
				let recomendacionesCompletas = '';
				
				if (datosHorus.recomendaciones_medicas && datosHorus.recomendaciones_medicas.length > 0) {
					recomendacionesCompletas += 'RECOMENDACIONES MÉDICAS:\n';
					recomendacionesCompletas += datosHorus.recomendaciones_medicas.map(rec => `• ${rec}`).join('\n');
					console.log('Agregadas recomendaciones médicas:', datosHorus.recomendaciones_medicas);
				}
				
				if (datosHorus.recomendaciones_generales && datosHorus.recomendaciones_generales.length > 0) {
					if (recomendacionesCompletas) recomendacionesCompletas += '\n\n';
					recomendacionesCompletas += 'RECOMENDACIONES GENERALES:\n';
					recomendacionesCompletas += datosHorus.recomendaciones_generales.map(rec => `• ${rec}`).join('\n');
					console.log('Agregadas recomendaciones generales:', datosHorus.recomendaciones_generales);
				}
				
				// Agregar tratamiento farmacológico si existe
				if (datosHorus.tratamiento && datosHorus.tratamiento.length > 0) {
					if (recomendacionesCompletas) recomendacionesCompletas += '\n\n';
					recomendacionesCompletas += 'TRATAMIENTO FARMACOLÓGICO:\n';
					datosHorus.tratamiento.forEach(med => {
						let lineaTratamiento = `• ${med.medicamento}`;
						if (med.dosis && med.dosis.trim()) {
							lineaTratamiento += ` - Dosis: ${med.dosis}`;
						}
						if (med.frecuencia && med.frecuencia.trim()) {
							lineaTratamiento += ` - Frecuencia: ${med.frecuencia}`;
						}
						recomendacionesCompletas += lineaTratamiento + '\n';
					});
					console.log('Agregado tratamiento farmacológico:', datosHorus.tratamiento);
				}
				
				if (recomendacionesCompletas.trim()) {
					this.resumen.recomendaciones = recomendacionesCompletas;
					console.log('Recomendaciones finales aplicadas:', recomendacionesCompletas);
				}
				
				// Setear destino del paciente por defecto si no está definido
				if (!this.resumen.destino_paciente) {
					this.resumen.destino_paciente = 'Control';
				}
				
				console.log('Estado final del resumen:', this.resumen);
				
				// Forzar la validación del formulario después de llenar los datos
				this.$nextTick(() => {
					if (this.$refs.PlanManejo) {
						this.$refs.PlanManejo.validate();
					}
				});
				
				console.log('PlanManejo - Datos aplicados correctamente');
				this.$toast.success('Plan de manejo actualizado con información de audio');
				
			} catch (error) {
				console.error('Error aplicando datos de HorusVoice a PlanManejo:', error);
				this.$toast.error('Error al aplicar datos de audio al plan de manejo');
			}
		},

		validarErrores() {
			return this.$refs.PlanManejo.validate();
		},

        obtenerDatos() {
            const data = {
                ...this.resumen,
            }
            return { datos: data };
        },

		guardarRegistros() {
			this.$axios.post('historia/guardar/' + this.datos.id, this.resumen)
				.then(res => {
					this.$toast.success(res.data.mensaje)
				}).catch(err => {
					console.log(err.response.data)
				})
		},
		agregarRemisionPrograma() {
	if (!this.remisionPrograma.remision_programa || this.remisionPrograma.remision_programa.length === 0) {
		this.$toast.error('Debe seleccionar al menos un programa');
		return;
	}

	if (!this.remisionPrograma.observacion || this.remisionPrograma.observacion.trim() === '') {
		this.$toast.error('La observación es obligatoria');
		return;
	}

	this.loading = true;

	const promesas = this.remisionPrograma.remision_programa.map(programa => {
		const datos = {
			consulta_id: this.datos.id,
			remision_programa: programa,
			observacion: this.remisionPrograma.observacion
		};

		return this.$axios.post('remisionProgramas/crearRemision', datos);
	});

	Promise.all(promesas)
		.then(() => {
			this.loading = false;
			this.$toast.success('Se han agregado las remisiones con éxito');
			this.limpiarDatos();
			this.listarPorConsultaId();
		})
		.catch(error => {
			console.error(error);
			this.loading = false;
			this.$toast.error('Ocurrió un error al agregar alguna de las remisiones');
		});
},


		listarFinalidades() {
			this.cargandoDato = true;
			this.$axios.get('finalidadConsulta/listarActivas').then(res => {
				this.finalidades = res.data
			}).catch(error => {
				console.log(error)
			}).finally(res => {
				this.cargandoDato = false
			})
		},

		listarConsultasExternas() {
			this.cargando = true;
			this.$axios.get('consultaCausaExterna/listarActivas').then(res => {
				this.consultasExternas = res.data
			}).catch(error => {
				console.log(error)
			}).finally(res => {
				this.cargando = false;
			})
		},

		listarRecomendacionesCondicionadas() {
			const datos = {
				consulta_id: this.datos.id
			};
			this.loading = true;

			this.$axios.post("/recomendaciones/listarCondicionado", datos)
				.then(({
					data
				}) => {
					this.recomendacionesObtenidas = data;
					this.dialogoAbierto = data.length > 0;

					if (!this.dialogoAbierto) {
						this.$toast.info('No se han encontrado recomendaciones preestablecidas para el diagnóstico primario');
					}
				})
				.catch((err) => {
					console.error(err);
					this.$toast.error("Error al listar las recomendaciones");
				})
				.finally(() => {
					this.loading = false;
				});
		},

		agregarRecomendacion(descripcion) {
			if (this.resumen.recomendaciones) {
				this.resumen.recomendaciones += `\n${descripcion}`;
			} else {
				this.resumen.recomendaciones = descripcion;
			}
		},

		abrirDialogo() {
			this.dialogoAbierto = true;
		},
		cerrarDialogo() {
			this.dialogoAbierto = false;
		},

		guardarSeleccionadas() {
			this.resumen.recomendaciones = this.resumen.recomendaciones || "";

			const seleccionadasDescripciones = this.seleccionadas.map(
				(recomendacion) => recomendacion.descripcion
			);

			const existentes = this.resumen.recomendaciones
				.split("\n")
				.filter((linea) => linea);

			const nuevas = seleccionadasDescripciones.filter(
				(desc) => !existentes.includes(desc)
			);

			if (nuevas.length) {
				this.resumen.recomendaciones +=
					(this.resumen.recomendaciones ? "\n" : "") + nuevas.join("\n");
			}

			this.seleccionadas = [];
			this.cerrarDialogo();
		},

		listarProgramasPorEdadYSexo() {
			this.$axios.post('parametrizacionRemisionProgramas/listarPorEdadYSexo', {
				edad: this.datos.afiliado.edad_cumplida,
				sexo: this.datos.afiliado.sexo
			})
				.then(response => {
					this.remisionProgramasItems = response.data;
				})
				.catch(error => {
					console.error('Error al listar programas:', error.response ? error.response.data : error);
				});
		},

		async listarPorConsultaId() {
			try {
				this.loading = true;
				const data = {
					consulta_id: this.datos.afiliado.id
				};
				const response = await this.$axios.post('/remisionProgramas/listarPorAfiliado/', data);
				this.remision = response.data;
			} catch (error) {
				this.$toast.error(error);
			} finally {
				this.loading = false;
			}
		},

		eliminarItem(item) {
			return this.$swal({
				title: '¿Estás seguro?',
				text: "¡No podrás revertir esto!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sí, eliminarlo!',
				cancelButtonText: 'Cancelar'
			}).then((result) => {
				if (result.value) {
					this.$axios.delete(`remisionProgramas/eliminarRemision/${item.id}`)
						.then(() => {
							this.$toast.success('Eliminado con éxito');
							this.listarPorConsultaId();
						})
						.catch((error) => {
							console.log(error);
							this.$toast.error('Error al eliminar: ' + error.response.data.Error);
						});
				}
			});
		},

		limpiarDatos() {
			this.remisionPrograma = {}
		}
		// guardarPlanManejo() {

		// this.preloadHistoria = true
		// this.planesdeManejo.paciente_id = this.datosCita.paciente_id;
		// this.planesdeManejo.Citapaciente_id = this.datosCita.cita_paciente_id;
		// axios.post('/api/historia/savePlanManejo', this.planesdeManejo)
		//     .then(res => {
		//         this.$alertHistoria('<span style="color:#fff">' + res.data.message + '<span>');
		//         this.$emit('respuestaComponente')
		//         this.preloadHistoria = false
		//     })
		// },
		// }



	}
}

</script>

<style scoped>
.v-data-table {
	max-height: 300px;
	overflow-y: auto;
}
</style>
