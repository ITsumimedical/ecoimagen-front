<template>
	<div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Agendamiento citas afiliado</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
		<v-container fluid>
			<!-- Buscar Afiliado -->
			<v-row dense>
				<v-col cols="12" md="4" sm="12">
					<v-autocomplete dense outlined label="Tipo de documento" :items="tiposDocumentos" :loading="loading"
						no-data-text="No hay resultados" item-value="id" item-text="nombre"
						v-model="datosBuscarAfiliado.tipo_documento" />
				</v-col>
				<v-col cols="12" md="4" sm="12">
					<v-text-field dense outlined label="Número documento" @keyup.enter="consultarAfiliado()"
						v-model.trim="datosBuscarAfiliado.numero_documento" />
				</v-col>
				<v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
					<v-btn color="primary" dark @click="consultarAfiliado()" style="width: 50%">Consultar <v-icon
							right>mdi-magnify</v-icon></v-btn>
					<v-btn color="red" dark @click="
						limpiarAfiliado();
					limpiarRegistroCita();
					" style="width: 50%">Limpiar<v-icon right>mdi-close</v-icon></v-btn>
				</v-col>
			</v-row>

			<!-- Afiliado -->
			<v-row dense v-if="afiliado">
				<v-col cols="12" md="12" sm="12">
					<EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true"
                    :modoEdicion="true" :mostrarClasificaciones="true"/>
				</v-col>
			</v-row>

			<!-- Citas del paciente -->
			<v-row dense v-if="afiliado">
				<CitasAfiliado ref="citasAfiliado" :afiliadoId="afiliado.id" />
			</v-row>

			<!-- Agendamiento Médico -->
			<v-row dense v-if="afiliado && afiliado.estado_afiliado.id !== 31">
				<v-col cols="12" sm="12" md="12">
					<v-alert dense text border="left" icon="mdi-calendar-search" type="info">
						Proceso de asignación de cita
					</v-alert>
					<!-- <pre>{{ordenesAfiliado}}</pre> -->
					<v-row dense>
						<v-col cols="12" md="6" sm="12">
							<v-autocomplete outlined dense label="Especialidad" v-model="formGenerarCita.especialidad"
								:items="especialidades" :loading="loading" no-data-text="No hay resultados"
								return-object item-text="nombre" @change="onEspecialidadChange"></v-autocomplete>
						</v-col>
						<v-col cols="12" md="6" sm="12">
							<v-autocomplete outlined dense label="Cita" v-model="formGenerarCita.cita" return-object
								:items="citas" no-data-text="Debe seleccionar una especialidad" :item-text="(citas) =>
									`${citas.nombre} - ${citas.tiempo_consulta} Min -  ${parseInt(citas.tipo_cita_id) === 2
										? 'Grupal'
										: 'Individual'
									}`
									" :loading="loading" @change="onCitaChange"></v-autocomplete>
						</v-col>
						<!-- <v-col cols="12" md="12" sm="12" v-if="coincidenciasCups.length > 0">
							<v-autocomplete dense label="Seleccione Orden y CUP" :items="coincidenciasCups"
								v-model="seleccionOrdenCup" item-text="itemText" item-value="itemValue"
								no-data-text="No hay coincidencias"></v-autocomplete>
						</v-col> -->

						<!-- <v-col cols="12" md="12" sm="12" v-if="coincidenciasCups.length > 0">
							<v-textarea dense label="Observación de la Orden" v-model="observacionOrdenSeleccionada"
								readonly></v-textarea>
						</v-col> -->

						<v-col cols="12" md="6" sm="12">
							<v-autocomplete outlined dense label="Sede" v-model="formGenerarCita.sede" :items="sedes"
								no-data-text="Debe seleccionar una una cita" return-object item-text="nombre"
								@change="onSedeChange"></v-autocomplete>
						</v-col>
						<!-- <v-col cols="12" md="3" sm="3">
              <v-text-field
                dense
                type="date"
                label="Fecha Solicitada"
                v-model="formGenerarCita.fecha_solicitada"
              ></v-text-field>
            </v-col> -->
						<v-col cols="12" md="6" sm="12">
							<v-menu dense v-model="menu" :close-on-content-click="false" :nudge-right="40"
								transition="scale-transition" offset-y min-width="auto">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field outlined v-model="formGenerarCita.fecha_solicitada"
										label="Fecha deseada por el paciente" prepend-icon="mdi-calendar" readonly dense
										v-bind="attrs" v-on="on"></v-text-field>
								</template>
								<v-date-picker v-model="formGenerarCita.fecha_solicitada" :min="fechaMinima"
									:allowed-dates="noPermitirDiasFestivos" @input="menu = false"></v-date-picker>
							</v-menu>
						</v-col>

                        <v-col cols="12" md="12" sm="12" v-if="seleccionOrdenCup">
                            <v-alert text dense border="left" color="primary" icon="mdi-human-handsdown">
                                <b>Orden seleccionada:</b>
                            </v-alert>

                            <v-card outlined class="pa-3">
                                <div class="d-flex flex-column">
                                    <div class="d-flex justify-space-between align-center">
                                        <div><strong>Afiliado:</strong> {{ nombreCompletoOrden(seleccionOrdenCup) }}</div>
                                        <v-tooltip bottom>
                                            <template #activator="{ on, attrs }">
                                            <v-icon color="primary" dense v-bind="attrs" v-on="on" @click="verificarOrdenesDialog = true; seleccionOrdenCupData = []" class="ml-2">
                                                mdi-file-document-refresh
                                            </v-icon>
                                            </template>
                                            <span>Visualizar órdenes de nuevo</span>
                                        </v-tooltip>
                                    </div>
                                <div><strong>Estado:</strong>
                                    <v-chip small dark :color="getEstadoColor(seleccionOrdenCup.estado_id)">
                                    {{ getEstadoTexto(seleccionOrdenCup.estado_id) }}
                                    </v-chip>
                                </div>
                                <div><strong>Observaciones:</strong> {{ seleccionOrdenCup.observaciones || 'N/D' }}</div>
                                <div><strong>Cantidad:</strong> {{ seleccionOrdenCup.cantidad ?? 'N/D' }}</div>
                                <div><strong>Codigo Servicio:</strong> {{ seleccionOrdenCup.codigoServicio ?? 'N/D' }}</div>
                                <div><strong>Servicio:</strong> {{ seleccionOrdenCup.servicio ?? 'N/D' }}</div>
                                </div>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" small @click="limpiarOrdenSeleccionada()">Limpiar selección</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>

						<v-col cols="12" md="12" sm="12">
							<v-date-picker v-if="formGenerarCita.sede" event-color="green lighten-1"
								v-model="formGenerarCita.fecha" :events="eventos" :min="fechaMinima" locale="es-es"
								:allowed-dates="noPermitirDiasFestivos" full-width
								@change="onFechaChange"></v-date-picker>
						</v-col>
						<v-col cols="12" md="12" sm="12"> </v-col>
						<v-col cols="12" md="12" sm="12">
							<v-autocomplete outlined dense label="Médico" v-model="formGenerarCita.medico" :items="medicos"
								no-data-text="Debe elegir una fecha disponible" return-object item-text="nombre"
								@change="onMedicoChange"></v-autocomplete>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-textarea outlined dense auto-grow label="Observaciones"
								v-model="formGenerarCita.observacion"></v-textarea>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-data-table dense :headers="headersAgendasDisponibles" :items="agendasFiltradas">
								<template v-slot:[`item.horario`]="{ item }">
									{{ item.fecha_inicio?.substring(11, 20) }}
								</template>
								<template v-slot:[`item.disponibilidad`]="{ item }">
									{{
										item.consultas.filter(
											(consulta) => consulta.estado_id !== 5
										).length
									}}
									/
									{{ item.cita.cantidad_paciente }}
								</template>
								<template v-slot:[`item.acciones`]="{ item }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                            color="teal"
                                            class="mr-2"
                                            v-bind="attrs"
                                            v-on="on"
                                            @click="verificarInfo(item)"
                                        >
                                            mdi-account-check
                                        </v-icon>
                                    </template>
                                    <span>Agendar Cita</span>
                                </v-tooltip>
                            </template>
							</v-data-table>
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<!-- Dialog Asignación de Cita -->
			<v-dialog persistent v-if="dialogAsignarCita" v-model="dialogAsignarCita" max-width="600px" scrollable>
				<v-card>
					<v-alert dense text border="left" icon="mdi-clipboard-text" type="info" color="info">
						<b>Asignar Cita</b>
					</v-alert>
					<v-card-text>
						<v-row dense>
							<v-col cols="12" sm="12" md="12">
								<p v-if="
									formGenerarCita.cita &&
									formGenerarCita.agenda &&
									formGenerarCita.sede &&
									formGenerarCita.medico
								">
									Asignar Cita de tipo
									<b>{{ formGenerarCita.cita.nombre }}</b> al Afiliado
									<b>{{ afiliado.primer_nombre }} {{ afiliado.segundo_nombre }}
										{{ afiliado.primer_apellido }}
										{{ afiliado.segundo_apellido }}</b>
									identificado con
									<b>{{ afiliado.tipo_documento.nombre }}</b> N°
									<b>{{ afiliado.numero_documento }}</b> el día
									<b>{{
										$moment(
											formGenerarCita.agenda.fecha_inicio?.substring(0, 10)
										).format("dddd, D MMMM YYYY")
									}}</b>
									a las
									<b>{{
										$moment(formGenerarCita.agenda.fecha_inicio).format(
											"h:mm a"
										)
									}}</b>
									en la Sede <b>{{ formGenerarCita.sede.nombre }}</b>, <b>{{
										formGenerarCita.agenda.consultorio.nombre }}</b> con
									el Médico
									<b>{{ formGenerarCita.medico.nombre }}</b>
								</p>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-btn color="success" small dark @click="asignarCita()">Asignar Cita</v-btn>
						<v-btn @click="dialogAsignarCita = false" color="error" small>Cerrar</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

          <v-dialog v-model="verificarOrdenesDialog" max-width="1000px" persistent>
                <v-card flat>
                    <v-alert text dense color="primary" border="bottom" icon="mdi-book-account-outline">
                        <b>ÓRDENES DEL AFILIADO</b>
                    </v-alert>

                    <v-card-text>
                        <v-alert border="left" color="error" text dense><b>¡Atención! Seleccione la orden que usará para asignar la cita</b></v-alert>
                        <v-divider></v-divider>
                    <v-data-table v-model="seleccionOrdenCupData" :headers="headersOrdenes" :items="ordenesAfiliadoParaCita"  :single-select="true" show-select item-value="id" dense class="elevation-1" no-data-text="No se encontraron órdenes"
                                 @input="ordenSeleccionada" >
                        <template v-slot:[`item.nombre_afiliado`]="{ item }">
                        <div class="d-flex align-center">
                            <v-avatar color="primary" size="24" class="mr-2">
                                <span class="white--text text-caption">
                                    {{ item.primer_nombre?.charAt(0) || '' }}
                                </span>
                            </v-avatar>
                            {{ item.primer_nombre }} {{ item.segundo_nombre || '' }} {{ item.primer_apellido }} {{ item.segundo_apellido || '' }}
                        </div>
                        </template>

                        <template v-slot:[`item.estado_id`]="{ item }">
                        <v-chip label :color="getEstadoColor(item.estado_id)" dark small>
                            {{ getEstadoTexto(item.estado_id) }}
                        </v-chip>
                        </template>

                        <template v-slot:[`item.estado_cobro`]="{ item }">
                            <v-chip label :color="colorCobrosEstados(item)" dark small>
                               {{ estadoTextosCobro(item) }}
                            </v-chip>
                        </template>

                        <template v-slot:[`item.observaciones`]="{ item }">
                        {{ item.observaciones || '-' }}
                        </template>

                        <template v-slot:[`item.cantidad`]="{ item }">
                        {{ item.cantidad ?? 'N/D' }}
                        </template>
                    </v-data-table>
                    </v-card-text>

                    <v-card-actions class="justify-end">
                    <v-btn color="error" small dark @click="verificarOrdenesDialog = false">Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


		</v-container>
        </v-card>

	</div>
</template>

<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import CitasAfiliado from "@/components/afiliado/CitasAfiliado.vue";
import moment from "moment";
import { obtenerFestivosColombia } from "~/utils/festivos";
moment.locale("es");

export default {
	middleware({ $can, redirect }) {
		if (!$can("cita.agendamiento.vista")) {
			return redirect("/");
		}
	},
	components: {
		EditarAfiliadoComponente,
		CitasAfiliado
	},
	data() {
		return {
			menu: false,
			loading: false,
			tiposDocumentos: [],
            ordenesAfiliadoParaCita: [],
            verificarOrdenesDialog: false,
			datosBuscarAfiliado: {
				numero_documento: null,
				tipo_documento: null,
			},
			afiliado: null,
			datosBasicos: true,
			editar: true,
			contadorCitasPendientes: null,
			consultasPendientes: [],
			consultasAtendidas: [],
             headersOrdenes: [
                { text: '#', value: 'id', sortable: false },
                { text: 'Nombre Afiliado', value: 'nombre_afiliado', sortable: false },
                { text: 'Orden ID', value: 'orden_id' },
                { text: 'Código servicio', value: 'codigoServicio' },
                { text: 'Nombre Servicio', value: 'servicio'},
                { text: 'Observaciones', value: 'observaciones' },
                { text: 'Cantidad', value: 'cantidad' },
                { text: 'Estado de la orden', value: 'estado_id' },
                { text: 'Estado del cobro', value: 'estado_cobro'}
            ],
			formGenerarCita: {
				especialidad: null,
				cita: null,
				sede: null,
				fecha_solicitada: null,
				fecha: null,
				medico: null,
				observacion: null,
				agenda: null,
				paciente: null,
				orden_id: null,
				cup_id: null,
				servicio_id: null,
			},
			especialidades: [],
			citas: [],
			sedes: [],
			eventos: [],
			medicos: [],
			agendasDisponibles: [],
			agendas: [],
			fechaMinima: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
				.toISOString()
				.substring(0, 10),
			headersAgendasDisponibles: [
				{ text: "Hora", value: "horario", align: "center" },
				{ text: "Consultorio", value: "consultorio.nombre", align: "center" },
				{
					text: "Asignados/Disponibilidad",
					value: "disponibilidad",
					align: "center",
				},
				{
					text: "Acciones",
					value: "acciones",
					sortable: false,
					align: "center",
				},
			],
			dialogAsignarCita: false,
			ordenesAfiliado: [],
			coincidenciasCups: [],
			// seleccionOrdenCup: null,
            seleccionOrdenCupData: [],
			observacionOrdenSeleccionada: "",
			diasFestivos: null,
			diasFestivosCargados: false,
		};
	},
	async mounted() {
		this.listarTiposDocumentos();
		this.listarEspecialidadesConCitas();

		this.diasFestivos = await obtenerFestivosColombia();
		this.diasFestivosCargados = true;
	},
	filters: {
		formatoFecha(fecha) {
			return moment(fecha).format("dddd, D MMMM, YYYY");
		},

		formatoHora(Hora_Inicio) {
			return moment(Hora_Inicio).format("hh:mm A");
		},
	},
    computed: {
        seleccionOrdenCup() {
            return this.seleccionOrdenCupData[0] || null;
        },
       agendasFiltradas() {
            const clasificaciones = this.afiliado?.clasificacion || [];

            const tieneAislamiento = clasificaciones.some(c =>
                c.nombre?.toLowerCase().includes('aislamiento')
            );

            // Si no tiene aislamiento, retorna todas
            if (!tieneAislamiento) {
                return this.agendas;
            }

            const agendasVirtuales = this.agendas.filter(agenda =>
                agenda.cita?.modalidad_id === 2
            );

            // Aislamiento aplica solo a las presenciales
            const agendasPresenciales = this.agendas.filter(agenda =>
                agenda.cita?.modalidad_id !== 2
            );

            const agrupadas = {};

            agendasPresenciales.forEach((agenda) => {
                const key = `${agenda.consultorio_id}_${agenda.fecha_inicio?.substring(0, 10)}`;
                if (!agrupadas[key]) {
                    agrupadas[key] = [];
                }
                agrupadas[key].push(agenda);
            });

            const filtradas = [];
            Object.values(agrupadas).forEach((agendasDelDia) => {
                const ultima = agendasDelDia.reduce((ultima, actual) =>
                    new Date(actual.fecha_fin) > new Date(ultima.fecha_fin) ? actual : ultima,
                    agendasDelDia[0]
                );
                filtradas.push(ultima);
            });

            // Combinar agendas presenciales filtradas con las virtuales
            return [...filtradas, ...agendasVirtuales];
        }

    },
	watch: {
		seleccionOrdenCup(newVal) {
			if (newVal) {
				const seleccionada = this.coincidenciasCups.find(
					(item) =>
						item.itemValue.orden_id === newVal.orden_id &&
						item.itemValue.cup_id === newVal.cup_id
				);
				this.observacionOrdenSeleccionada = seleccionada
					? seleccionada.observacion
					: "Sin Observación";
			} else {
				this.observacionOrdenSeleccionada = "Sin Observación";
			}
		},
	},
	methods: {
		...mapActions("app", ["setPreload"]),

		noPermitirDiasFestivos(date) {
			if (!this.diasFestivosCargados) {
				return true;
			}

			const esFestivo = this.diasFestivos.includes(date);

			return !esFestivo;
		},

		listarTiposDocumentos() {
			(this.loading = true),
				this.$axios
					.get("/tipo-documento/listar")
					.then((res) => {
						this.tiposDocumentos = res.data;
					})
					.catch((error) => {
						this.$toast.error(
							"Ocurrió un error al cargar los tipos de documento"
						);
						console.log(error);
					})
					.finally(() => {
						this.loading = false;
					});
		},

		consultarAfiliado() {
			this.limpiarRegistroCita();
			this.setPreload(true);
			this.$axios
				.get(
					`/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
				)
				.then((res) => {
					this.afiliado = res.data;
					this.formGenerarCita.paciente = this.afiliado;
					this.buscarOrdenesAfiliado();
				})
				.catch((error) => {
					this.$toast.error(
						"El afiliado no se encuentra registrado en la base de datos."
					);
					console.log(error);
				})
				.finally(() => {
					this.setPreload(false);
				});
		},

		limpiarAfiliado() {
			this.datosBuscarAfiliado = {
				numero_documento: null,
				tipo_documento: null,
			};
			this.afiliado = null;
		},

		listarEspecialidadesConCitas() {
			this.loading = true;
			this.$axios
				.get("/especialidades/listarEspecialidadesConMedicos")
				.then((res) => {
					this.especialidades = res.data;
				})
				.catch((error) => {
					this.$toast.error("Ocurrio un error al cargar las especialidades");
					console.log(error);
				})
				.finally(() => {
					this.loading = false;
				});
		},

		listarCitasEspecialidad() {
			const especialidadSeleccionada = this.formGenerarCita.especialidad?.id;
			const especialidad = this.especialidades.find(
				(e) => e.id === especialidadSeleccionada
			);
			this.citas = especialidad ? especialidad.citas : [];
			this.formGenerarCita.cita = null;
			this.formGenerarCita.sede = null;
			this.sedes = [];
		},

		listarSedes() {
			const citaSeleccionada = this.formGenerarCita.cita?.id;
			if (citaSeleccionada) {
				this.setPreload(true);
				this.$axios
					.post("/agenda/sede", { cita: citaSeleccionada })
					.then((res) => {
						this.sedes = res.data;
					})
					.catch((error) => {
						this.$toast.error("Ocurrió un error al cargar las sedes");
						console.log(error);
					})
					.finally(() => {
						this.setPreload(false);
					});
			} else {
				this.sedes = [];
			}
			this.formGenerarCita.sede = null;
		},

		listarAgendaDisponible() {
			this.setPreload(true);
			this.$axios
				.get(
					`/agenda/agendaDisponible?cita=${this.formGenerarCita.cita?.id}&sede=${this.formGenerarCita.sede?.id}`
				)
				.then((res) => {
					this.agendasDisponibles = res.data;
					res.data.forEach((agenda) => {
						const found = this.eventos.find(
							(elemento) => elemento === agenda.fecha_inicio?.substring(0, 10)
						);
						if (found === undefined) {
							this.eventos.push(agenda.fecha_inicio?.substring(0, 10));
						}
					});
				})
				.catch((error) => {
					this.$toast.error("Ocurrio un error al cargar las sedes");
					console.log(error);
				})
				.finally(() => {
					this.setPreload(false);
				});
		},

		listarMedicosPorAgenda() {
			this.setPreload(true);
			this.$axios
				.post("/agenda/medicos", {
					cita: this.formGenerarCita.cita?.id,
					fecha: this.formGenerarCita.fecha,
					sede: this.formGenerarCita.sede,
				})
				.then((res) => {
					res.data.forEach((agenda) => {
						agenda.medicos.forEach((medico) => {
							const id = this.medicos.findIndex(
								(agenda) => parseInt(agenda.id) === parseInt(medico.id)
							);
							if (id < 0) {
								this.medicos.push({
									id: medico.id,
									nombre: medico.operador.nombre_completo,
									agendas: [agenda],
								});
							} else {
								this.medicos[id].agendas.push(agenda);
							}
						});
					});
				})
				.catch((error) => {
					this.$toast.error("Error al cargar los médicos");
					console.log(error);
				})
				.finally(() => {
					this.setPreload(false);
				});
		},

		//Esta funcion busca las ordenes activas de un afiliado
		buscarOrdenesAfiliado() {
			this.setPreload(true);
			this.$axios
				.get(`/ordenamiento/listarOrdenesAfiliado/${this.afiliado.id}`)
				.then((res) => {
					this.ordenesAfiliado = res.data;
				})
				.catch(() => {
					this.$toast.error(
						"Ocurrió un error al cargar las ordenes de afiliado"
					);
				})
				.finally(() => {
					this.setPreload(false);
				});
		},

		/* Verificar si los cups de las ordenes del afiliado coinciden
		con los cups parametrizados en la cita (Si aplica) */
		verificarCupOrden() {
			// console.log("Verificando coincidencias de cups.", {
			//   RequiereOrden: this.formGenerarCita.cita?.requiere_orden,
			//   CitaCups: this.formGenerarCita.cita?.cups,
			//   OrdenesAfiliado: this.ordenesAfiliado,
			// });

			// Verificar si la cita requiere orden
			if (this.formGenerarCita.cita) {
				if (!this.formGenerarCita.cita.requiere_orden) {
					// console.log("La cita seleccionada no requiere orden.");
					return;
				}

				// console.log("La cita seleccionada requiere orden.");

				// Verificar si el afiliado tiene órdenes
				if (this.ordenesAfiliado.length === 0) {
					this.$swal({
						type: "warning",
						title: "¡Sin órdenes activas!",
						text: "El afiliado no tiene órdenes activas para la cita seleccionada.",
					});
					return;
				}

				// Buscar coincidencias entre los CUPs de la cita y las órdenes del afiliado
				const cupIdsCita = this.formGenerarCita.cita.cups.map((cup) => cup.id);
				console.log('sdsds', cupIdsCita);

				this.coincidenciasCups = this.ordenesAfiliado
					.filter((orden) => cupIdsCita.includes(orden.cup_id))
					.map((orden) => ({
						itemText: `Orden N° ${orden.orden_id} - Servicio: ${orden.cup_codigo
							} - ${orden.cup_nombre} - Sede: ${orden.rep.nombre} - Tipo: ${orden.tipo === "procedimiento"
								? "Procedimiento"
								: "Otros Servicios"
							}- Cantidad pendiente: ${orden.cantidad_pendiente == null
								? orden.cantidad
								: orden.cantidad_pendiente
							}`,
						itemValue: {
							orden_id: orden.orden_id,
							cup_id: orden.cup_id,
							servicio_id: orden.id,
							tipo: orden.tipo,
							cantidad: orden.cantidad,
							cantidad_pendiente: orden.cantidad_pendiente,
							cantidad_usada: orden.cantidad_usada
						},
						observacion: orden.observaciones,
					}));

				// Si no hay coincidencias de CUPs
				if (this.coincidenciasCups.length === 0) {
					this.$swal({
						type: "warning",
						title: "¡CUP no coincide!",
						text: "El CUP de las órdenes del afiliado no coincide con los CUPs de la cita seleccionada.",
					});
				}
			}
		},

		onEspecialidadChange() {
			this.citas = [];
			this.sedes = [];
			this.eventos = [];
			this.medicos = [];
			this.agendasDisponibles = [];
			this.agendas = [];
			this.coincidenciasCups = [];
			this.seleccionOrdenCup = null;
			this.observacionOrdenSeleccionada = "Sin Observación";
			this.listarCitasEspecialidad();
		},

		onCitaChange() {
			// console.log("Cita cambiada");
			this.sedes = [];
			this.medicos = [];
			this.eventos = [];
			this.agendas = [];
			this.agendasDisponibles = [];
			this.coincidenciasCups = [];
			this.seleccionOrdenCup = null;
			this.observacionOrdenSeleccionada = "Sin Observación";
			this.listarSedes();
			// this.verificarCupOrden();
		},

		onSedeChange() {
            this.verificarOrdenesAfiliado();
			this.eventos = [];
			this.medicos = [];
			this.agendasDisponibles = [];
			this.agendas = [];
			this.listarAgendaDisponible();
		},

		onFechaChange() {
			this.medicos = [];
			this.agendas = [];
			this.agendasDisponibles = [];
			this.listarMedicosPorAgenda();
		},
		onMedicoChange() {
			this.agendas = [];
			const medicoSeleccionado = this.formGenerarCita.medico?.id;
			const medico = this.medicos.find((m) => m.id === medicoSeleccionado);
			this.agendas = medico ? medico.agendas : [];
		},

		verificarInfo(item) {
			if (!this.formGenerarCita.fecha_solicitada) {
				this.$toast.error("Debe seleccionar una Fecha Solicitada");
				return;
			}

			if (this.formGenerarCita.cita.requiere_orden && !this.seleccionOrdenCup) {
				this.$toast.error("Debe seleccionar una orden y CUP para continuar.");
				return;
			}

			const consultasValidas = item.consultas.filter(
				(consulta) => consulta.estado_id !== 5
			);

			if (consultasValidas.length >= item.cita.cantidad_paciente) {
				this.$toast.error(
					"La agenda ya tiene una consulta asignada a esa hora."
				);
				return;
			}

			this.formGenerarCita.agenda = item;
			this.dialogAsignarCita = true;
		},

		asignarCita() {
			if (this.formGenerarCita.cita.requiere_orden) {
				this.formGenerarCita.orden_id = this.seleccionOrdenCup.orden_id;
				this.formGenerarCita.cup_id = this.seleccionOrdenCup.cup_id;
				this.formGenerarCita.servicio_id = this.seleccionOrdenCup.servicio_id;
				this.formGenerarCita.tipo_orden = this.seleccionOrdenCup.tipo;
				this.formGenerarCita.cantidad_usada = this.seleccionOrdenCup.cantidad_usada == null ? 1 : this.seleccionOrdenCup.cantidad_usada + 1;
				this.formGenerarCita.cantidad_pendiente = this.seleccionOrdenCup.cantidad_pendiente == null ? this.seleccionOrdenCup.cantidad - 1 : this.seleccionOrdenCup.cantidad_pendiente - 1
			}

			// console.log("asignando cita", this.formGenerarCita);
			// console.log('sdsdsd',this.seleccionOrdenCup);


			this.setPreload(true);

            const data = {
                ...this.formGenerarCita,
            }

            data.paciente.nombre_completo = `${this.afiliado.primer_nombre} ${this.afiliado.segundo_nombre || ''} ${this.afiliado.primer_apellido} ${this.afiliado.segundo_apellido || ''}`;
			this.$axios
				.post("/consultas/crear", this.formGenerarCita)
				.then((res) => {
					if (res.data.mensaje === "Cita asignada al afiliado con exito!") {
						this.$toast.success(res.data.mensaje);
						this.limpiarRegistroCita();
						this.$refs.citasAfiliado.recargarDatos();
					} else {
						this.$swal({
							type: "error",
							title: "¡No es posible asignar esa cita!",
							text: res.data.mensaje,
						});
					}
				})
				.catch((error) => {
					this.$swal({
						type: "error",
						title: "¡No puede ser!",
						text: error.response.data.mensaje,
					});
				})
				.finally(() => {
					this.dialogAsignarCita = false;
					this.setPreload(false);
				});
		},

		limpiarRegistroCita() {
			this.formGenerarCita = {
				especialidad: null,
				cita: null,
				sede: null,
				fecha_solicitada: null,
				fecha: null,
				medico: null,
				observacion: null,
				agenda: null,
				paciente: this.afiliado,
				orden_id: null,
				cup_id: null,
				servicio_id: null,
			};
			this.citas = [];
			this.sedes = [];
			this.eventos = [];
			this.medicos = [];
			this.agendasDisponibles = [];
			this.agendas = [];
			this.coincidenciasCups = [];
            this.seleccionOrdenCupData = [];
			this.observacionOrdenSeleccionada = "Sin Observación";
		},

        verificarOrdenesAfiliado() {
            const data = {
                afiliado_id: this.afiliado.id,
                cita_id: this.formGenerarCita.cita?.id,
                rep_id: this.formGenerarCita.sede?.id
            }
            this.$axios.get('ordenamiento/listar-ordenes-afiliado', { params: data }).then((res) => {
                this.ordenesAfiliadoParaCita = res.data;
                if (this.ordenesAfiliadoParaCita.length > 0) {
                     this.verificarOrdenesDialog = true;
                }
            }).catch((error) => {
                console.log(error)
            })
        },

        getEstadoTexto(estadoId) {
            switch (estadoId) {
            case 1: return 'Activo';
            case 4: return 'Autorizada';
            default: return 'Desconocido';
            }
        },
        getEstadoColor(estadoId) {
            switch (estadoId) {
            case 1: return 'success';
            case 4: return 'blue';
            default: return 'grey';
            }
        },

        estadoTextosCobro(item){
            if(item.tipo_cobro === 'Exento') {
                switch(item.estado_cobro) {
                    case 1: return 'Exento a cobro';
                    case 14: return 'Asistido';
                    default: return 'Desconocido';
                }
            } else if (item.tipo_cobro === 'cuota' || item.tipo_cobro === 'copago') {
               switch(item.estado_cobro) {
                    case 1: return 'Sin pago registrado';
                    case 14: return 'Cobro registrado';
                    default: return 'Desconocido';
                }
            }
            return 'Desconocido'
        },

        colorCobrosEstados(item){
            if(item.tipo_cobro === 'Exento') {
                switch(item.estado_cobro) {
                    case 1: return 'primary';
                    case 14: return 'success';
                    default: return 'grey';
                }
            } else if (item.tipo_cobro === 'cuota' || item.tipo_cobro === 'copago') {
               switch(item.estado_cobro) {
                    case 1: return 'orange';
                    case 14: return 'success';
                    default: return 'grey';
                }
            }
            return 'grey'
        },

        nombreCompletoOrden(orden) {
            return `${orden.primer_nombre || ''} ${orden.segundo_nombre || ''} ${orden.primer_apellido || ''} ${orden.segundo_apellido || ''}`.trim();
        },

        limpiarOrdenSeleccionada() {
            this.seleccionOrdenCupData = [];
            this.formGenerarCita.sede = null
        },

        ordenSeleccionada(ordenSeleccionada) {
            if (ordenSeleccionada && ordenSeleccionada.length > 0) {
                this.verificarOrdenesDialog = false;
            }
        },
	},
};
</script>
