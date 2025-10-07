<template>
	<div>
		<!-- Registro histórico de diligenciamiento de historia clínica -->
		<v-card elevation="0">
			<v-card-title>
				<v-toolbar flat>
					<v-toolbar-title>
						<div class="d-flex align-center">
							<img src="/images/ojo.svg" alt="" height="50px" width="50px" />
							<span>Registro diligenciamiento de historia clínica</span>
						</div>
					</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
				</v-toolbar>
			</v-card-title>
			<v-container fluid>
				<v-row dense>
					<v-expansion-panels multiple>
						<v-expansion-panel v-for="(obj, key) in encabezadosProcesados" :key="key">
							<v-expansion-panel-header>
								<div class="d-flex align-center" style="width: 100%; justify-content: flex-start;">
									<v-icon class="mr-2" color="#b8860b">
										{{ iconosEncabezado[key] || 'mdi-folder' }}
									</v-icon>
									<v-divider vertical class="mx-2" style="height: 24px;"></v-divider>
									<span>
										{{ encabezadosTraducidos[key] || homologoCampos[key] || key }}
									</span>
								</div>
							</v-expansion-panel-header>
							<v-expansion-panel-content>
								<v-simple-table dense>
									<template v-slot:default>
										<thead>
											<tr>
												<th class="text-left">Campo</th>
												<th class="text-left">Valor</th>
											</tr>
										</thead>
										<tbody>
											<!-- Se itera sobre cada campo del objeto procesado -->
											<tr v-for="(value, campo) in obj" :key="campo"
												v-if="value !== null && value !== '' && !campoExcluir(campo)">
												<td>{{ homologoCampos[campo] || campo }}</td>
												<td>{{ valorFormateado(key, campo, value) }}</td>
											</tr>
										</tbody>
									</template>
								</v-simple-table>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-row>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="$emit('cerrarDialogoDiligenciamiento')" color="error" small>Cerrar</v-btn>
				</v-card-actions>
			</v-container>
		</v-card>
	</div>
</template>

<script>
	export default {
		name: 'WorkspaceJsonModalDiligenciamientoHistoria',

		data() {
			return {
				homologoCampos: {
					// agenda
					id: "Identificador Único del Registro",
					cita_id: "Consecutivo de cita",
					fecha_inicio: "Fecha y hora de inicio",
					fecha_fin: "Fecha y hora de finalización",
					// afiliado
					id_afiliado: 'Identificador unico de afiliado',
					nombre_compelto: 'Nombre completo',
					numero_documento: 'Número de documento de identidad',
					fecha_afiliacion: 'Fecha de afiliación',
					fecha_nacimiento: 'Fecha de nacimiento',
					edad_cumplida: 'Edad actual',
					celular1: 'Celular principal',
					correo1: 'Correo electrónico',
					direccion: 'Dirección de residencia',
					tipo_documento: 'Tipo de documento',
					tipo_cotizante: 'Tipo de afiliación',
					ciclo_vida_atencion: 'Ciclo de vida',
					nivel_educativo: 'Nivel de edicación',
					estado_civil: 'Estado civil',
					nombre_acompanante: 'Nombre del acompañante',
					nombre_responsable: 'Nombre del responsable',
					telefono_responsable: 'Teléfono del resposable',
					parentesco_responsable: 'Parentesco del resposable',
					nombre: 'Nombre completo',
					// Médico ordena
					email: 'Correo electrónico',
					numero_documento: 'Profesional',
					// História clínica
					consulta_id: "ID de consulta",
					motivo_consulta: "Motivo de la consulta médica",
					enfermedad_actual: "Enfermedad actual",
					neurologico: "Evaluación neurológica",
					valor_scala_karnofski: "Valor escala Karnofsky",
					valor_scala_ecog: "Valor escala ECOG",
					sin_dolor: "Sin dolor",
					sin_cansancio: "Sin cansancio",
					sin_nauseas: "Sin náuseas",
					sin_tristeza: "Sin tristeza",
					sin_ansiedad: "Sin ansiedad",
					sin_somnolencia: "Sin somnolencia",
					sin_disnea: "Sin disnea",
					buen_apetito: "Buen apetito",
					sin_dificulta_para_dormir: "Sin dificultad para dormir",
					dieta_saludable: "Dieta saludable",
					frecuencia_dieta_saludable: "Frecuencia de dieta saludable",
					dieta_balanceada: "Dieta balanceada",
					cuantas_comidas: "Cantidad de comidas",
					sueno_reparador: "Sueño reparador",
					tipo_sueno: "Tipo de sueño",
					duracion_sueno: "Duración del sueño",
					actividad_fisica: "Actividad física",
					duracion_actividad_fisica: "Duración de la actividad física",
					frecuencia_actividad_fisica: "Frecuencia de actividad física",
					esfinter: "Esfínter",
					esfinter_rectal: "Esfínter rectal",
					caracteristicas_orina: "Características de la orina",
					anios_expuesto: "Años expuesto",
					expuesto_humo: "Expuesto a humo",
					expuesto_psicoactivos: "Expuesto a psicoactivos",
					anios_expuesto_sustancias: "Años expuesto a sustancias",
					fuma_cantidad: "Cantidad fumada",
					fumamos: "Fumamos",
					tabaquico: "Tabaquismo",
					riesgo_epoc: "Riesgo de EPOC",
					consumo_psicoactivo: "Consumo psicoactivo",
					psicoactivo_cantidad: "Cantidad de psicoactivos",
					licor_frecuencia: "Frecuencia de licor",
					cantidad_licor: "Cantidad de licor",
					estilo_vida_observaciones: "Observaciones sobre el estilo de vida",
					barthel_comer: "Barthel: Comer",
					barthel_lavarse: "Barthel: Lavarse",
					barthel_vestirse: "Barthel: Vestirse",
					barthel_arreglarse: "Barthel: Arreglarse",
					barthel_deposiciones: "Barthel: Deposiciones",
					barthel_miccion: "Barthel: Micción",
					barthel_trasladarse: "Barthel: Trasladarse",
					barthel_deambular: "Barthel: Deambular",
					barthel_escalones: "Barthel: Escalones",
					plan_manejo: "Plan de manejo",
					recomendaciones: "Recomendaciones",
					destino_paciente: "Destino del paciente",
					peso: "Peso",
					talla: "Talla",
					imc: "IMC",
					isc: "ISC",
					clasificacion: "Clasificación",
					circunferencia_brazo: "Circunferencia del brazo",
					presion_sistolica: "Presión sistólica",
					presion_diastolica: "Presión diastólica",
					presion_arterial_media: "Presión arterial media",
					frecuencia_cardiaca: "Frecuencia cardíaca",
					pulsos: "Pulsos",
					frecuencia_respiratoria: "Frecuencia respiratoria",
					temperatura: "Temperatura",
					saturacion_oxigeno: "Saturación de oxígeno",
					fio: "FIO",
					abdomen: "Abdomen",
					condicion_general: "Condición general",
					cabeza_cuello: "Cabeza y cuello",
					examen_extremidades: "Examen de extremidades",
					funciones: "Funciones",
					desempenio_comunicativo: "Desempeño comunicativo",
					factores_oido: "Factores de oído",
					violencia_mental: "Violencia mental",
					violencia_conflicto: "Violencia/conflicto",
					proximo_control: "Próximo control",
					fecha_ultima_menstruacion: "Fecha de la última menstruación",
					presente_menarquia: "Presencia de menarquia",
					edad: "Edad",
					clasificacion_ciclos: "Clasificación de ciclos",
					frecuencia_ciclos: "Frecuencia de ciclos",
					duracion_ciclos: "Duración de ciclos",
					presente_transmisionsexual: "Presencia de transmisión sexual",
					descripcion_transmision_sexual: "Descripción de transmisión sexual",
					edad_primera: "Edad del primer evento",
					presente_metodo_anticonceptivo: "Presencia de método anticonceptivo",
					descripcion_metodo_anticonceptivo: "Descripción del método anticonceptivo",
					fecha_metodo_anticonceptivo: "Fecha del método anticonceptivo",
					presente_tratamiento_infertilidad: "Presencia de tratamiento de infertilidad",
					tratamiento_tratamiento_infertilidad: "Tratamiento para la infertilidad",
					fecha_tratamiento_infertilidad: "Fecha de tratamiento de infertilidad",
					presente_auto_examen_senos: "Presencia de autoexamen de senos",
					frecuencia_auto_examen_senos: "Frecuencia de autoexamen de senos",
					presente_procedimiento_cuello_uterino: "Presencia de procedimiento cuello uterino",
					tratamiento_procedimiento_cuello_uterino: "Tratamiento de procedimiento cuello uterino",
					fecha_procedimiento_cuello_uterino: "Fecha de procedimiento cuello uterino",
					tratamiento_otro_tipo_tratamiento: "Tratamiento de otro tipo",
					fecha_ultimo_parto: "Fecha del último parto",
					planea_embarazo: "Planea embarazo",
					gesta: "Gesta",
					parto: "Parto",
					aborto: "Aborto",
					vivos: "Vivos",
					cesarea: "Cesárea",
					mortinato: "Mortinato",
					ectopicos: "Ectópicos",
					molas: "Molas",
					gemelos: "Gemelos",
					fecha_ultima_menstruacion_gestante: "Fecha última menstruación gestante",
					gestacional_fum: "Gestacional FUM",
					fecha_probable: "Fecha probable",
					embarazo_deseado: "Embarazo deseado",
					embarazo_planeado: "Embarazo planeado",
					embarazo_aceptado: "Embarazo aceptado",
					fecha_pimera_eco: "Fecha de primera eco",
					gestacional_eco_1: "Gestacional eco 1",
					descripcion_eco_1: "Descripción eco 1",
					fecha_segunda_eco: "Fecha segunda eco",
					gestacional_eco_2: "Gestacional eco 2",
					descripcion_eco_2: "Descripción eco 2",
					fecha_tercera_eco: "Fecha tercera eco",
					gestacional_eco_3: "Gestacional eco 3",
					descripcion_eco_3: "Descripción eco 3",
					gestacional_captacion: "Gestacional de captación",
					tratamiento_metodo_anticonceptivo: "Tratamiento método anticonceptivo",
					lateralidad_od: "Lateralidad OD",
					esf_od: "Esfera OD",
					cyl_od: "Cilindro OD",
					eje_od: "Eje OD",
					add_od: "Add OD",
					lateralidad_oi: "Lateralidad OI",
					esf_oi: "Esfera OI",
					cyl_oi: "Cilindro OI",
					eje_oi: "Eje OI",
					add_oi: "Add OI",
					checkboxsc: "Checkbox SC",
					checkboxcc: "Checkbox CC",
					agudeza_od: "Agudeza OD",
					agudezavp_od: "Agudeza VP OD",
					agudeza_oi: "Agudeza OI",
					agudezavp_oi: "Agudeza VP OI",
					ocular_vl: "Ocular VL",
					ocular_ppc: "Ocular PPC",
					biomicroscopiaod: "Biomicroscopia OD",
					biomicroscopiaoi: "Biomicroscopia OI",
					piood: "PIO OD",
					piooi: "PIO OI",
					oftalmoscopiaod: "Oftalmoscopia OD",
					oftalmoscopiaoi: "Oftalmoscopia OI",
					queratometria_od: "Queratometría OD",
					queratometria_oi: "Queratometría OI",
					refraccion_od: "Refracción OD",
					refraccionav_od: "Refracción AV OD",
					refraccion_oi: "Refracción OI",
					refraccionav_oi: "Refracción AV OI",
					subjetivo_od: "Subjetivo OD",
					subjetivoav_od: "Subjetivo AV OD",
					subjetivo_oi: "Subjetivo OI",
					subjetivoav_oi: "Subjetivo AV OI",
					procedimiento_menor: "Procedimiento menor",
					cup_id: "Cup ID",
					frecuencia_cepillado: "Frecuencia de cepillado",
					realiza_higiene: "Realiza higiene",
					uso_crema_dental: "Uso de crema dental",
					uso_seda_dental: "Uso de seda dental",
					uso_enjuague_bucal: "Uso de enjuague bucal",
					uso_aparatologia_ortopedica: "Uso de aparatología ortopédica",
					uso_adimentos_protesicos_removibles: "Uso de aditamentos protésicos removibles",
					higiene_aparatos_protesis: "Higiene de aparatos/protésis",
					respiracion_bucal: "Respiración bucal",
					succion_digital: "Succión digital",
					lengua_protactil: "Lengua protractil",
					onicofagia: "Onicofagia",
					queilofagia: "Queilofagia",
					mordisqueo: "Mordisqueo",
					biberon: "Biberón",
					chupos: "Chupos",
					otros: "Otros",
					avcc_ojoderecho: "AVCC ojo derecho",
					avcc_ojoizquierdo: "AVCC ojo izquierdo",
					avsc_ojoderecho: "AVSC ojo derecho",
					avsc_ojoizquierdo: "AVSC ojo izquierdo",
					ph_ojoderecho: "pH ojo derecho",
					ph_ojoizquierdo: "pH ojo izquierdo",
					motilidad_ojoderecho: "Motilidad ojo derecho",
					covert_ojoderecho: "Covert ojo derecho",
					motilidad_ojoizquierdo: "Motilidad ojo izquierdo",
					covert_ojoizquierdo: "Covert ojo izquierdo",
					biomicros_ojoderecho: "Biomicroscopía ojo derecho",
					biomicros_ojoizquierdo: "Biomicroscopía ojo izquierdo",
					presionintra_ojoderecho: "Presión intraocular ojo derecho",
					presionintra_ojoizquierdo: "Presión intraocular ojo izquierdo",
					gionios_ojoderecho: "Gionios ojo derecho",
					gionios_ojoizquierdo: "Gionios ojo izquierdo",
					fondo_ojoderecho: "Fondo ojo derecho",
					fondo_ojoizquierdo: "Fondo ojo izquierdo",
					hallazgos_clinicos: "Hallazgos clínicos",
					hallazgos_radiograficos: "Hallazgos radiográficos",
					paciente_controlado_odontologia: "Paciente controlado en odontología",
					descripcion_revision_sistemas: "Descripción de revisión de sistemas",
					sintomatico_respiratorio: "Sintomático respiratorio",
					sintomatico_piel: "Sintomático piel",
					examen_cardiorespiratorio: "Examen cardiorespiratorio",
					examen_genitales: "Examen genitales",
					piel_anexos: "Piel y anexos",
					finalidad_id: "Finalidad ID",
					causa_consulta_externa_id: "Causa consulta externa ID",
					edad_gestacional_ecografia1: "Edad gestacional ecografía 1",
					edad_gestacional_ecografia2: "Edad gestacional ecografía 2",
					edad_gestacional_ecografia3: "Edad gestacional ecografía 3",
					documento_afiliado: "Documento del afiliado",
					edad_afiliado: "Edad del afiliado",
					sexo_afiliado: "Sexo del afiliado",
					tipo_documento_afiliado: "Tipo de documento del afiliado",
					consume_alcohol: "Consume alcohol",
					menopausia_presente: "Menopausia presente",
					fecha_inicio_menopausia: "Fecha de inicio de la menopausia",
					afiliado_fumador: "Afiliado fumador",
					agudeza_visual_ojo_izquierdo: "Agudeza visual ojo izquierdo",
					agudeza_visual_ojo_derecho: "Agudeza visual ojo derecho"
				},
				encabezadosTraducidos: {
					afiliado: "Información del Afiliado",
					agenda: "Información del Agendamiento",
					cita: "Información de la Cita",
					medico_ordena: "Información del Médico que ordena",
					historia_clinica: "Diligenciamiento de Historia Clínica",
					antecedente_personales: "Antecedentes Personales",
					antecedentes_farmacologicos: "Antecedentes Farmacológicos",
					antecedentes_familiares: "Antecedentes Familiares",
					vacunacion: "Antecedentes Vaculanes",
					antecedente_quirurgicos: "Antecedentes Quirúrgicos",
					antecedente_hospitalarios: "Antecedentes Hospitalarios",
					antecedente_ecomapa: "Antecedentes ecomapa",
					resultado_laboratorios: "Resultados de laboratorio",
					cie10_afiliado: 'Diagnóstico de la consulta',
					plan_cuidado: 'Plan de cuidado',
					antecedentes_odontologicos: 'Antecedentes odontológicos',
					examen_fisico_odontologicos: 'Examen físico odontológico',
					examen_tejido_odontologicos: 'Examen de tejidos odontológico',
					paraclinicos_odontologicos: 'Paraclínicos odontológico',
					plan_tramiento_odontologia: "Plan de tratamiento odontológico",
					adherencia_farmaceutica: "Adherencia farmacéutica",
					cup_ginecologicos: "Diagnóstico ginecológico",
					cup_mamografias: "Diagnóstico mamografía",
					rx_final: 'Revisión oftalmológica',
					cuestionario_vale: 'Cuestionario Vale',
					test_rqc: 'Test RQC',
					figura_humana: 'Figura humana',
					test_srq: 'Test SRQ',
					estado_comportamiento: 'Estado y comportamiento',
					organos_fonoarticulatorios: 'Órganos fonoarticulatorios',
					estructura_dinamica: 'Estructura dinámica',
					minuta: 'Minuta de nutrición',
					valoracion_antropometrica: 'Valoración antropométrica',
					rep: 'Prestador',
				},
				mapeoAnidados: {
					agenda: {
						consultorio: 'nombre'
					},
					afiliado: {
						tipo_documento: "nombre"
					},
					medico_ordena: {
						operador: 'nombre'
					},
					antecedente_personales: {
						includeFields: ["patologias"]
					},
					antecedentes_farmacologicos: {
						includeFields: ["alimento", "ambiental", "otras", "observacion_ambiental",
							"observacion_alimento", "observacion_otro", "observacion_medicamento", "medicamento"
						]
					},
					resultado_laboratorios: {
						includeFields: ["laboratorio", "fecha_laboratorio"]
					},
					cie10_afiliado: {
						includeFields: ["cie10"]
					},
					insumos: {
						includeFields: ["codesumi"]
					},
					paraclinicos_odontologicos: {
						includeFields: ["laboratorio", "lectura_radiografica", 'otros']
					},
					cup_ginecologicos: {
						includeFields: ["resultados", "fecha_realizacion"]
					},
					cup_mamografias: {
						includeFields: ["resultados", "fecha_realizacion"]
					},
					antecedentes_familiares: {
						includeFields: ["parentesco", "edad"]
					},
					vacunacion: {
						includeFields: ["vacuna", "dosis", "laboratorio"]
					},
					antecedente_quirurgicos: {
						includeFields: ["cirugia", "a_que_edad", "observaciones"]
					},
					antecedente_hospitalarios: {
						includeFields: ["descripcion_hospiurg", "descripcion_hospi_uci", "fecha_ultimas_hospitalizaciones",
							"fecha_hospitalizacion_uci_ultimo_ano"
						]
					},
					plan_cuidado: {
						includeFields: ["plan"]
					},
					ordenes: {
						includeFields: ["procedimientos", "articulos"]
					}
				},
				camposExcluir: [
					'consultorio_id', 'created_by', 'created_at', 'updated_at', 'estado_id',
					'departamento_afiliacion_id', 'municipio_afiliacion_id', 'departamento_atencion_id',
					'municipio_atencion_id', 'ips_id', 'user_id', 'estado_afiliacion_id', 'tipo_afiliado_id',
					'tipo_afiliacion_id', 'dpto_residencia_id', 'mpio_residencia_id', 'entidad_id', 'ocupacion',
					'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'tipocon_documento',
					'direccion_residencia_cargue', 'tipo_usuario_id', 'activo', 'deleted_at', 'cup_id',
					'requiere_telesalud', 'cantidad_paciente', 'requiere_orden', 'especialidade_id', 'tipo_cita_id',
					'primera_vez_cup_id', 'control_cup_id', 'modalidad_id', 'procedimiento_no_especifico', 'firma',
					'reps_id', 'numero_sede', 'nivel_atencion', 'sede_principal', 'prestador_id', 'municipio_id',
					'ips_primaria', 'tipo_historia_id', 'tipo_consulta_id', 'agendamiento_interno', 'cirugia',
				],
				iconosEncabezado: {
					agenda: 'mdi-calendar-clock',
					afiliado: 'mdi-account-circle',
					cita: 'mdi-calendar-multiselect',
					medico_ordena: 'mdi-doctor',
					historia_clinica: 'mdi-stethoscope',
					antecedente_personales: 'mdi-history',
					antecedentes_farmacologicos: 'mdi-history',
					antecedentes_familiares: 'mdi-history',
					vacunacion: 'mdi-history',
					antecedente_quirurgicos: 'mdi-history',
					antecedente_hospitalarios: 'mdi-history',
					antecedente_ecomapa: 'mdi-history',
					resultado_laboratorios: 'mdi-test-tube',
					cie10_afiliado: 'mdi-medication',
					plan_cuidado: 'mdi-account-file-text',
					especialidad: 'mdi-folder-star-outline',
					insumos: 'mdi-pill',
					antecedentes_odontologicos: 'mdi-tooth-outline',
					examen_fisico_odontologicos: 'mdi-tooth-outline',
					examen_tejido_odontologicos: 'mdi-tooth-outline',
					paraclinicos_odontologicos: 'mdi-tooth-outline',
					plan_tramiento_odontologia: 'mdi-tooth-outline',
					adherencia_farmaceutica: 'mdi-pill',
					cup_ginecologicos: 'mdi-human-female',
					cup_mamografias: 'mdi-mother-nurse',
					rx_final: 'mdi-eye',
					framingham: 'mdi-heart-search',
					odontograma_imagen: 'mdi-tooth-outline',
					cuestionario_vale: 'mdi-human-edit',
					test_rqc: 'mdi-brain',
					figura_humana: 'mdi-human-handsdown',
					test_srq: 'mdi-head-snowflake-outline',
					estado_comportamiento: 'mdi-head-cog-outline',
					organos_fonoarticulatorios: 'mdi-volume-high',
					estructura_dinamica: 'mdi-stairs-up',
					minuta: 'mdi-nutrition',
					valoracion_antropometrica: 'mdi-weight-kilogram',
					neuropsicologia: 'mdi-brain',
					ordenes: 'mdi-room-service',
					rep: 'mdi-hospital-building'
				}
			};
		},

		props: {
			datosRegistro: {
				type: Object,
				default: () => null
			}
		},

		computed: {
			encabezados() {
				let datos = this.datosRegistro[0] || {};
				return Object.fromEntries(
					Object.entries(datos)
					.filter(([_, value]) => typeof value === "object" && value !== null)
					.filter(([_, obj]) => Object.values(obj).some(val => val !== null && val !== ''))
				);
			},

			encabezadosProcesados() {
				let procesados = JSON.parse(JSON.stringify(this.encabezados));

				Object.entries(procesados).forEach(([encabezadoKey, data]) => {
					if (Array.isArray(data)) {
						const mapping = this.mapeoAnidados[encabezadoKey];
						if (mapping && mapping.includeFields) {
							procesados[encabezadoKey] = {
								detalle: this.processArray(data, mapping)
							};
						} else {
							procesados[encabezadoKey] = {
								detalle: data.join(', ')
							};
						}
					} else if (typeof data === "object" && data !== null) {
						Object.entries(data).forEach(([campo, valor]) => {
							if (this.camposExcluir.includes(campo)) {
								delete procesados[encabezadoKey][campo];
								return;
							}

							if (Array.isArray(valor)) {
								const mapping = this.mapeoAnidados[encabezadoKey] && this.mapeoAnidados[
									encabezadoKey][campo];
								procesados[encabezadoKey][campo] = this.processArray(valor, mapping);
							} else if (typeof valor === "object" && valor !== null) {
								const mapping = this.mapeoAnidados[encabezadoKey] && this.mapeoAnidados[
									encabezadoKey][campo];
								if (mapping && typeof mapping === "string") {
									procesados[encabezadoKey][campo] = valor[mapping];
								}
							}
						});
					}
				});

				return procesados;
			}

		},

		methods: {
			processArray(arr, mapping) {
				if (mapping) {
					if (typeof mapping === "string") {
						return arr.map(el => el[mapping]).join(', ');
					} else if (typeof mapping === "object") {
						if (Array.isArray(mapping.includeFields)) {
							return arr.map(el => {
								let result = {};
								mapping.includeFields.forEach(field => {
									if (el.hasOwnProperty(field)) {
										result[field] = el[field];
									}
								});
								if (result && result.articulos && result.articulos.length > 0) {
								return result.articulos
									.map(articulo => `${articulo.codesumi.nombre} - Cantidad ordenada: ${articulo.cantidad_medico} - Codigo: ${articulo.codesumi.codigo}`)
									.join('  |  ');
								}else {
							console.log(result);
							return result.cie10.codigo_cie10 + ' ' + result.cie10.descripcion
							}

							}).join(' | ');
						} else if (Array.isArray(mapping.excludeFields)) {
							return arr.map(el => {
								let result = {
									...el
								};
								mapping.excludeFields.forEach(field => {
									delete result[field];
								});
								return JSON.stringify(result);
							}).join(' | ');
						}
					}
				}
				return arr.join(', ');
			},

			valorFormateado(encabezadoKey, campo, value) {
				if (Array.isArray(value)) {
					return value.join(', ');
				} else if (typeof value === "object" && value !== null) {
					return JSON.stringify(value);
				}
				return value;
			},

			campoExcluir(campo) {
				return this.camposExcluir.includes(campo);
			}
		}
	};

</script>
