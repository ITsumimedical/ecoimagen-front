<template>
	<div>
		<v-row>
			<v-col cols="12" sm="12" md="12">
				<v-card>
					<v-card-title>
						<v-toolbar flat>
							<v-toolbar-title>
								<div class="d-flex align-center">
									<img src="/images/ojo.svg" alt="" height="50px" width="50px" />
									<span>Agendamiento médico</span>
								</div>
							</v-toolbar-title>
							<v-divider class="mx-4" inset vertical></v-divider>
						</v-toolbar>
					</v-card-title>
					<v-form ref="formAgenda" lazy-validation>
						<v-col cols="12" sm="12" md="12">
							<v-row dense>
								<v-col cols="12" sm="3" md="3">
									<v-autocomplete outlined dense v-model="form.especialidad" :items="especialidades"
										item-text="nombre" item-value="id" label="Especialidad"
										@change="cargarDatosEspecialidades(), getMedicosyAuxiliares()"
										:rules="[requerido]"></v-autocomplete>
								</v-col>
								<v-col cols="12" sm="4" md="4">
									<v-autocomplete outlined dense v-model="form.medico" :items="medicos"
										:disabled="!form.especialidad"
										:item-text="medicos => medicos.documento + ' - ' + medicos.nombre + ' - ' + medicos.apellido"
										item-value="id" label="Médico" :rules="[requerido]"></v-autocomplete>
								</v-col>
								<v-col cols="12" sm="5" md="5">
									<v-autocomplete outlined dense :disabled="!form.medico" v-model="form.cita"
										:items="citas"
										:item-text="citas => `${citas.nombre} - ${citas.tiempo_consulta} Min -  ${(parseInt(citas.tipo_cita_id) === 2 ? 'Grupal' : 'Individual')}`"
										return-object label="Cita" :rules="[requerido]"></v-autocomplete>
								</v-col>

								<v-col cols="12" sm="12" md="12"
									v-if="form.cita && parseInt(form.cita.tipo_cita_id) === 2">

									<v-combobox v-model="form.adicional" dense outlined
										:items="medicosYAuxiliares.filter(f => parseInt(f.id) !== parseInt(form.medico))"
										label="Personal Adicional" small-chips deletable-chips
										:item-text="medicos => `${medicos.documento} - ${medicos.nombre} ${medicos.apellido}`"
										item-value="id" multiple clearable chips></v-combobox>
								</v-col>

								<v-col cols="12" sm="6" md="6">
									<v-autocomplete outlined dense :disabled="!form.cita" v-model="form.sede"
										:items="sedes" item-text="nombre" return-object label="Sede"
										@change="listarConsultorios" :rules="[requerido]"></v-autocomplete>
								</v-col>
								<v-col cols="12" sm="6" md="6">
									<v-autocomplete outlined dense :disabled="!form.sede" v-model="form.consultorio"
										:items="consultorios"
										:item-text="consultorios => `${consultorios.nombre} (Capacidad: ${consultorios.cantidad_paciente})`"
										item-value="id" label="Consultorio" :rules="[requerido]"></v-autocomplete>
								</v-col>
								<v-col cols="12" sm="3" md="3">
									<v-text-field outlined dense v-model="form.horaInicio" label="Hora inicio"
										prepend-icon="mdi-clock-time-four-outline" :rules="[requerido, horaValida]"
										:disabled="!form.consultorio" placeholder="HH:mm" required></v-text-field>
								</v-col>

								<v-col cols="12" sm="3" md="3">
									<v-text-field outlined dense v-model="form.horaFinal" label="Hora final"
										prepend-icon="mdi-clock-time-four-outline"
										:rules="[requerido, horaValida, horaFinalMayor]" :disabled="!form.horaInicio"
										placeholder="HH:mm" required></v-text-field>
								</v-col>

								<v-col cols="12" sm="12" md="12">
									<v-menu ref="menu" v-model="menu" :close-on-content-click="false"
										:return-value.sync="form.fechas" transition="scale-transition" offset-y
										min-width="auto">
										<template v-slot:activator="{ on, attrs }">
											<v-combobox outlined dense v-model="form.fechas" multiple chips small-chips
												label="Fechas agenda" prepend-icon="mdi-calendar" v-bind="attrs"
												v-on="on" :rules="[requerido]" :disabled="!form.horaFinal"></v-combobox>
										</template>
										<v-date-picker v-model="form.fechas" multiple no-title scrollable
											:disabled="!form.horaFinal" :min="fechaActual"
											:allowed-dates="diasFestivosNoPermitir">
											<v-spacer></v-spacer>
											<v-btn text color="primary" @click="menu = false">Cancel</v-btn>
											<v-btn text color="primary"
												@click="$refs.menu.save(form.fechas); generarEventos()">OK</v-btn>
										</v-date-picker>
									</v-menu>
								</v-col>
								<v-col cols="12">
									<v-row class="d-flex align-center justify-end" dense>
										<v-col cols="12" sm="auto" class="d-flex align-center">
											<v-switch v-if="$can('agendar.dias.festivos')"
												v-model="permitirDiasFestivos" inset dense hide-details
												label="Permitir selección de días festivos"
												@change="guardarPreferenciaFestivos" />
										</v-col>

										<v-col cols="12" sm="auto" class="d-flex my-1">
											<v-btn small color="blue-grey" dark
												@click="dialogReasignar = true, funcionarios()">
												Reasignar médico agenda
												<v-icon right>mdi-account-convert</v-icon>
											</v-btn>
										</v-col>

										<v-col cols="12" sm="auto" class="d-flex my-1">
											<v-btn small color="info" @click="dialogTraslado = true">
												Traslado ubicación agenda
												<v-icon right>mdi-swap-horizontal</v-icon>
											</v-btn>
										</v-col>

										<v-col cols="12" sm="auto" class="d-flex my-1">
											<v-btn small color="warning" @click="limpiarFormulario">
												Limpiar Campos
												<v-icon right>mdi-close</v-icon>
											</v-btn>
										</v-col>

										<v-col cols="12" sm="auto" class="d-flex my-1">
											<v-btn small color="boton" dark @click="guardarAgenda">
												Guardar
												<v-icon right>mdi-calendar-check-outline</v-icon>
											</v-btn>
										</v-col>
									</v-row>
								</v-col>
							</v-row>
						</v-col>
					</v-form>
				</v-card>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" sm="12" md="12">
				<v-card>
					<v-form>
						<v-row>
							<v-col>
								<v-sheet height="64">
									<v-toolbar flat>
										<v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Hoy</v-btn>
										<v-btn fab text small color="grey darken-2" @click="prev">
											<v-icon small>mdi-chevron-left</v-icon>
										</v-btn>
										<v-btn fab text small color="grey darken-2" @click="next">
											<v-icon small>mdi-chevron-right</v-icon>
										</v-btn>
										<v-toolbar-title v-if="$refs.calendar">
											{{ $refs.calendar.title }}
										</v-toolbar-title>
										<v-spacer></v-spacer>
										<v-menu bottom right>
											<template v-slot:activator="{ on, attrs }">
												<v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
													<span>{{ typeToLabel[type] }}</span>
													<v-icon right>
														mdi-menu-down
													</v-icon>
												</v-btn>
											</template>
											<v-list>
												<v-list-item @click="type = 'day'">
													<v-list-item-title>Dia</v-list-item-title>
												</v-list-item>
												<v-list-item @click="type = 'week'">
													<v-list-item-title>Semana</v-list-item-title>
												</v-list-item>
												<v-list-item @click="type = 'month'">
													<v-list-item-title>Mes</v-list-item-title>
												</v-list-item>
												<v-list-item @click="type = '4day'">
													<v-list-item-title>4 dias</v-list-item-title>
												</v-list-item>
											</v-list>
										</v-menu>
									</v-toolbar>
								</v-sheet>
								<v-sheet height="600">
									<v-calendar :start="fechaActual" ref="calendar" v-model="focus" color="primary"
										:events="events" :event-color="getEventColor" :type="type"
										@click:event="showEvent" @click:more="viewDay" @click:date="viewDay"
										:weekday-format="getDay"></v-calendar>
								</v-sheet>
							</v-col>
						</v-row>
					</v-form>
				</v-card>
			</v-col>
		</v-row>

		<template>
			<v-dialog v-model="dialogReasignar" width="1500">
				<v-card>
					<v-toolbar flat>
						<v-toolbar-title>
							<div class="d-flex align-center">
								<img src="/images/ojo.svg" alt="" height="50px" width="50px" />
								<span>Reasignación de agenda médica</span>
							</div>
						</v-toolbar-title>
						<v-divider class="mx-4" inset vertical></v-divider>
					</v-toolbar>
					<v-col cols="12" sm="12" md="12">
						<v-row dense>
							<v-col cols="12" sm="6" md="6">
								<v-autocomplete outlined dense v-model="form.medico" :items="medicosActivos"
									:item-text="medicos => `${medicos.operador.nombre_completo} - ${medicos.operador.documento} (${medicos.especialidad})`"
									item-value="id" label="Funcionario que posee la agenda"
									@change="consultarAgendamientoMedico"></v-autocomplete>
							</v-col>
							<v-col cols="12" sm="6" md="6" v-if="arrayEvents.length > 0">

								<v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40"
									transition="scale-transition" offset-y min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field outlined dense v-model="formReasignar.fechas" label="Fecha Agenda"
											prepend-icon="mdi-calendar" readonly v-bind="attrs"
											v-on="on"></v-text-field>
									</template>

									<v-date-picker locale="es-co" :min="fechaActual" :events="arrayEvents"
										v-model="formReasignar.fechas" @input="menu3 = false"
										:allowed-dates="diasFestivosNoPermitir" event-color="green lighten-1"
										@change="seleccionAgendas = []">
									</v-date-picker>
									
								</v-menu>


							</v-col>
							<v-col cols="12" sm="12" md="12" v-if="arrayEvents.length > 0">

								<v-data-table dense v-model="seleccionAgendas" hide-default-footer
									:headers="headersReasignar"
									:items="agendas.filter(a => a.fecha_inicio.substring(0, 10) === formReasignar.fechas)"
									item-key="id" show-select class="elevation-1" disable-pagination>
									<template v-slot:[`item.Asignados`]="{ item }">
										{{ item.consultas.length }} / {{ item.cita.cantidad_paciente }}
									</template>
								</v-data-table>
							</v-col>
							<v-col cols="12"></v-col>

							<template v-if="seleccionAgendas.length > 0">
								<v-col cols="12" sm="12" md="12">
									<v-autocomplete outlined dense v-model="formReasignar.medicoReemplazo"
										:items="medicosActivos.filter(s => parseInt(s.id) !== parseInt(form.medico))"
										:item-text="medicos => `${medicos.operador.nombre_completo} - ${medicos.operador.documento} (${medicos.especialidad})`"
										item-value="id" label="Funcionario que reemplaza"></v-autocomplete>
								</v-col>
								<v-col cols="12" sm="12" md="12">
									<v-textarea dense auto-grow label="Motivo" outlined
										v-model="formReasignar.motivo"></v-textarea>
								</v-col>
							</template>
						</v-row>
					</v-col>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="error" @click="dialogReasignar = false" small>Cerrar</v-btn>
						<v-btn small color="success" @click="generarReasignacion()">Generar</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</template>
		<v-dialog v-model="dialogTraslado" max-width="1200px">
			<v-card>
				<traslado-ubicacion-agenda />

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" @click="dialogTraslado = false" small>Cerrar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import {
	listarReps
} from '@/api/reps/reps';
import {
	listarEspecialidad
} from '@/api/especialidades/especialidad';
import {
	guardarAgenda
} from '@/api/agendamiento/agenda';
import { obtenerFestivosColombia } from '~/utils/festivos';
import TrasladoUbicacionAgenda from '~/components/agendamiento/TrasladoUbicacionAgenda.vue';
import { mapActions } from "vuex"
export default {
	components: { TrasladoUbicacionAgenda },
	middleware({
		$can,
		redirect
	}) {
		if (!$can('agendamiento.medico.vista')) {
			return redirect('/');
		}
	},
	name: 'AgendamientoMedico',


	data: () => ({
		dialogTraslado: false,
		seleccionAgendas: [],
		medicosYAuxiliares: [],
		requerido: v => !!v || 'Este campo es requerido',
		horaValida: v => {
			const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
			return regex.test(v) || 'Debe ingresar una hora válida en formato 24h (HH:mm)';
		},
		arrayEvents: [],
		medicosActivos: [],
		dialogReasignar: false,
		dialogReagendar: false,
		fechaActual: '2000-01-01',
		permitirDiasFestivos: false,
		menu1: false,
		menu2: false,
		menu3: false,
		formReasignar: {
			fechas: null,
			medicoReemplazo: null,
			motivo: null
		},
		form: {
			especialidad: null,
			medico: null,
			cita: null,
			sede: null,
			consultorio: null,
			horaInicio: null,
			horaFinal: null,
			fechas: [],
			adicional: []
		},
		especialidades: [],
		medicos: [],
		citas: [],
		sedes: [],
		consultorios: [],
		dates: ['2022-09-16'],
		menu: false,
		focus: '',
		type: 'week',
		typeToLabel: {
			month: 'Mes',
			week: 'Semana',
			day: 'Dia',
			'4day': '4 Dias',
		},
		selectedEvent: {},
		selectedElement: null,
		selectedOpen: false,
		events: [],
		colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
		names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
		headersReasignar: [
			{
				text: 'Cita',
				align: 'center',
				value: 'cita_nombre'
			},
			{
				text: 'Fecha y Hora',
				align: 'center',
				value: 'fecha_inicio'
			},
			{
				text: 'Sede',
				align: 'center',
				value: 'consultorio.rep.nombre'
			},
			{
				text: 'Consultorio',
				align: 'center',
				value: 'consultorio.nombre'
			},
		],
		diasFestivos: null,
		diasFestivosCargados: false,
	}),

	watch: {
		'form.especialidad': function (valor) {
			if (parseInt(this.form.cita?.tipo_cita_id) === 2) {

			}
		}
	},

	async mounted() {
		this.listarEspecialidades();
		this.listasSedes()
		const fecha = new Date();
		this.fechaActual = fecha.getFullYear() + "-" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "-" + ("0" + fecha.getDate()).slice(-2);

		this.diasFestivos = await obtenerFestivosColombia();
		console.log("Festivos cargados:", this.diasFestivos);
		this.diasFestivosCargados = true;
		this.cargarPreferenciaFestivos();
	},


	methods: {
		...mapActions('app', ['setPreload']),
		horaFinalMayor(v) {
			if (!v || !this.form.horaInicio) return true;

			const [hFinal, mFinal] = v.split(':').map(Number);
			const [hInicio, mInicio] = this.form.horaInicio.split(':').map(Number);

			const minutosFinal = hFinal * 60 + mFinal;
			const minutosInicio = hInicio * 60 + mInicio;

			return minutosFinal > minutosInicio || 'La hora final debe ser mayor que la hora inicio';
		},

		diasFestivosNoPermitir(date) {
			if (!this.diasFestivosCargados) {
				return true;
			}

			if (this.permitirDiasFestivos) {
				return true;
			}

			return !this.diasFestivos.includes(date);
		},

		//Guardamos en el storage lo que se selecciono
		guardarPreferenciaFestivos() {
			localStorage.setItem('permitir_dias_festivos', JSON.stringify(this.permitirDiasFestivos));
		},

		//Se carga lo que se guardo en el storage al ingresar de nuevo
		cargarPreferenciaFestivos() {
			const valor = localStorage.getItem('permitir_dias_festivos');
			if (valor !== null) {
				this.permitirDiasFestivos = JSON.parse(valor);
			}
		},

		getDay(date) {
			const WeekDays = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
			return WeekDays[date.weekday];
		},
		viewDay({
			date
		}) {
			this.focus = date
			this.type = 'day'
		},
		getEventColor(event) {
			return event.color
		},
		setToday() {
			this.focus = ''
		},
		prev() {
			this.$refs.calendar.prev()
		},
		next() {
			this.$refs.calendar.next()
		},
		showEvent({
			nativeEvent,
			event
		}) {
			const open = () => {
				this.selectedEvent = event
				this.selectedElement = nativeEvent.target
				requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
			}

			if (this.selectedOpen) {
				this.selectedOpen = false
				requestAnimationFrame(() => requestAnimationFrame(() => open()))
			} else {
				open()
			}

			nativeEvent.stopPropagation()
		},
		rnd(a, b) {
			return Math.floor((b - a + 1) * Math.random()) + a
		},

		getMedicosyAuxiliares() {
			this.$axios.get('/especialidades/listar-medicos-y-auxiliares/' + this.form.especialidad).then(response => {
				this.medicosYAuxiliares = response.data
			}).catch(error => {
				console.log(error)
			})
		},

		listarEspecialidades() {
			this.setPreload(true);
			this.$loadingGetRequest(listarEspecialidad()).then(res => {
				this.especialidades = res.data;
			}).catch(e => {
			}).finally(() => {
				this.setPreload(false);
			})
		},

		listasSedes() {
			this.setPreload(true);
			this.$loadingPostRequest(listarReps(0, 0, true, 1)).then(res => {
				this.sedes = res.data;
				this.form.sede = null;
				this.form.consultorio = null;
			}).catch(e => {
			}).finally(() => {
				this.setPreload(false);
			})
		},

		listarConsultorios() {
			this.setPreload(true);
			this.form.consultorio = null;
			this.$axios.post('/consultorios/listarRep', { rep_id: this.form.sede.id }).then(res => {
				this.consultorios = res.data
			}).catch(err => {

			}).finally(() => {
				this.setPreload(false);
			})

		},

		cargarDatosEspecialidades() {
			this.setPreload(true);
			this.form.medico = null;
			this.form.cita = null;
			this.form.sede = null;
			this.form.consultorio = null;
			this.$axios.post('/especialidades/especialidadMedico', { especialidad_id: this.form.especialidad }).then(res => {
				this.medicos = res.data
				console.log(this.medicos)
			}).catch(err => {

			})
			this.$axios.post('/especialidades/especialidadCita', { especialidad_id: this.form.especialidad }).then(res => {
				this.citas = res.data
			}).catch(err => {

			}).finally(() => {
				this.setPreload(false);
			})
		},

		async generarEventos() {
			if (this.form.horaInicio && this.form.horaFinal && this.form.cita.tiempo_consulta !== undefined && this.form
				.fechas.length > 0) {
				const minutosInicio = this.form.horaInicio.split(':').reduce((p, c) => parseInt(p) * 60 + parseInt(c));
				const minutosFinal = this.form.horaFinal.split(':').reduce((p, c) => parseInt(p) * 60 + parseInt(c));
				const diferencia = minutosFinal - minutosInicio;
				const minutos = Math.floor(diferencia)
				const numeroEventos = minutos / parseInt(this.form.cita.tiempo_consulta)
				await this.form.fechas.forEach(s => {
					const suma = 60000 * parseInt(this.form.cita.tiempo_consulta)
					let inicial = new Date(s + ' ' + this.form.horaInicio);
					let final = new Date(inicial.getTime() + suma)
					for (let i = 0; i < numeroEventos; i++) {
						this.events.push({
							color: 'green',
							name: 'Disponible',
							start: inicial,
							end: final,
							timed: true
						})
						let nuevaInicial = final;
						let nuevaFinal = new Date(final.getTime() + suma);
						inicial = nuevaInicial;
						final = nuevaFinal;
					}
				})
			}
		},

		guardarAgenda() {
			if (this.$refs.formAgenda.validate()) {
				this.$swal({
					title: 'Esta Seguro?',
					text: "Generar agenda por los dias seleccionados!",
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#28a745',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Guardar'
				}).then(async (result) => {
					if (result.value) {
						this.setPreload(true);
						try {
							const data = await this.$loadingPostRequest(guardarAgenda(), this.form)
							this.events = [];
							this.limpiarFormulario()
							this.$toast.success(data.data.mensaje)
						} catch (e) {
							console.log(e.response.data.error);
							this.$swal({
								type: 'error',
								title: "¡No puede ser!",
								text: e.response.data.mensaje,
							})
						}
					}
				}).finally(() => {
					this.setPreload(false);
				})
			}
		},

		requerido(value) {
			if (value instanceof Array && value.length === 0) {
				return 'Este campo es requerido';
			}
			return !!value || 'Este campo es requerido';
		},

		limpiarFormulario() {
			for (const prop of Object.getOwnPropertyNames(this.form)) {
				this.form[prop] = null;
			}
			this.$refs.formAgenda.resetValidation();
			this.form.fechas = [];
		},

		consultarAgendamientoMedico() {
			this.setPreload(true);
			this.arrayEvents = [];
			this.events = [];
			this.agendas = [];
			this.$axios.$get('/usuarios/agendaMedicoCompleta/' + this.form.medico).then(res => {
				this.agendas = res;
				res.forEach(s => {
					const found = this.arrayEvents.find(element => element === s.fecha_inicio.substring(0, 10));
					if (found === undefined) {
						if (s.fecha_inicio.substring(0, 10) >= this.fechaActual) {
							this.arrayEvents.push(s.fecha_inicio.substring(0, 10))
						}
					}
					this.events.push({
						color: 'primary',
						name: 'Ocupado',
						start: s.fecha_inicio.substring(0, 16),
						end: s.fecha_fin.substring(0, 16),
						timed: true
					})
				})
			}).catch(e => {
			}).finally(() => {
				this.setPreload(false);
			})
		},
		funcionarios() {
			this.setPreload(true);
			this.$axios.$get('/usuarios/medicosActivos').then(res => {
				this.medicosActivos = res.data;
			}).catch(e => {
			}).finally(() => {
				this.setPreload(false);
			})
		},

		generarReasignacion() {
			let datos = this.formReasignar;
			datos.agendas = this.seleccionAgendas;
			datos.medico = this.form.medico;
			this.setPreload(true);
			if (!this.formReasignar.fechas || !this.formReasignar.medicoReemplazo || !this.formReasignar.motivo) {
				this.preload = false;
				return this.$toast.error('Debes diligenciar todo el formulario, seleccionar fechas de reasignación, un médico reemplazante y un motivo')
			}
			this.$axios.$post('/agenda/reasignar', datos).then(res => {
				this.$toast.success(res.mensaje);
				this.form.medico = null;
				this.formReasignar.fechas = null;
				this.formReasignar.medicoReemplazo = null;
				this.formReasignar.motivo = null;
				this.seleccionAgendas = [];
				this.dialogReasignar = false;
			}).catch(e => {
				this.$toast.error(e.response.data.mensaje)
			}).finally(() => {
				this.setPreload(false);
			})
		},

	},
};

</script>
