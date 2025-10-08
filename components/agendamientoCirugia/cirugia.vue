<template>
	<div>
		<v-card>
			<v-alert text dense border="left" type="info" :icon="false" class="text-center">
				<b>MÓDULO DE AGENDAMIENTO CIRUGIA</b>
			</v-alert>
			<v-form ref="formAgendamientoCirugia" v-model="validacion" lazy-validation>
			<v-card-text>
				<v-container fluid>

					<v-row dense>

						<v-col cols="12" md="4" sm="12">
							<v-select :items="clases" label="Clase" v-model="formCirugia.clase"  @input="eventoPrevio()" required :rules="rules"></v-select>
						</v-col>
						<v-col cols="12" md="4" sm="12" v-if="!servicio">
							<v-autocomplete :search-input.sync="FiltroCups" :items="cups" item-text="nombre" return-object v-model="formCirugia.cup_id" label="Cup" @input="eventoPrevio()" required :rules="rules"></v-autocomplete>
						</v-col>
						<v-col cols="12" md="4" sm="12" v-else>
							<v-select :search-input.sync="FiltroCups" multiple :items="serviciosSeleccionados" item-text="nombre" return-object v-model="formCirugia.cup_id" label="Cup" @input="eventoPrevio()" required :rules="rules"></v-select>
						</v-col>
						<v-col cols="12" md="4" sm="12">
							<v-select :items="prestadores" item-text="nombre" return-object v-model="formCirugia.rep_id" label="Sede" @input="quirofanos = $event.quirofanos;eventoPrevio();datosQuirofano()" required :rules="rules"></v-select>
						</v-col>
                        <v-col cols="12" md="2" sm="12">
                            <v-text-field v-model="formCirugia.fecha_cirugia" type="date" label="Fecha" @input="datosQuirofano();eventoPrevio()" required :rules="rules"></v-text-field>
                        </v-col>
						<v-col cols="12" md="4" sm="12">
							<v-select :items="quirofanos" item-text="nombre" return-object v-model="formCirugia.quirofano_id" label="Quirofano" @input="datosQuirofano();eventoPrevio()" required :rules="rules"></v-select>
						</v-col>
						<v-col cols="12" md="2" sm="12">
							<v-menu ref="menu" v-model="menu1" :close-on-content-click="false" :nudge-right="40" :return-value.sync="formCirugia.hora_inicio_estimada" transition="scale-transition"
									offset-y
									max-width="290px"
									min-width="290px">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										v-model="formCirugia.hora_inicio_estimada"
										label="Hora Inicio Estimada"
										prepend-icon="mdi-clock-time-four-outline"
										readonly
										v-bind="attrs"
										v-on="on"
										required :rules="rules"
									></v-text-field>
								</template>
								<v-time-picker
									v-if="menu1"
									v-model="formCirugia.hora_inicio_estimada"
									full-width
									@click:minute="$refs.menu.save(formCirugia.hora_inicio_estimada)" @input="eventoPrevio()"
									required :rules="rules"
								></v-time-picker>
							</v-menu>
						</v-col>
						<v-col cols="12" md="2" sm="12">

							<v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="formCirugia.hora_fin_estimada" transition="scale-transition"
									offset-y
									max-width="290px"
									min-width="290px">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										v-model="formCirugia.hora_fin_estimada"
										label="Hora Fin Estimada"
										prepend-icon="mdi-clock-time-four-outline"
										readonly
										v-bind="attrs"
										v-on="on"
										required :rules="rules"
									></v-text-field>
								</template>
								<v-time-picker
									v-if="menu2"
									v-model="formCirugia.hora_fin_estimada"
									full-width
									@click:minute="$refs.menu2.save(formCirugia.hora_fin_estimada)" @input="eventoPrevio()"
									required :rules="rules"
								></v-time-picker>
							</v-menu>
						</v-col>
						<v-col cols="12" md="2" sm="12">
							<v-btn dark class="ma-3" :color="colors[formCirugia.colorSeleccionado]" @click="siguienteColor();eventoPrevio()">color Evento</v-btn>
						</v-col>
						<v-col cols="12" md="2" sm="12">
							<v-select v-model="formCirugia.tipo_anestesia" :items="tipoAnestesia" label="Tipo anestesia" required :rules="rules"></v-select>
						</v-col>
						<template v-if="formCirugia.tipo_anestesia !== 'LOCAL'">
							<v-col cols="12" md="4" sm="12">
								<v-autocomplete return-object :item-text="a => a.documento+' - '+a.nombre+' '+a.apellido" :items="anestesiologos" v-model="formCirugia.anestesiologo" label="Anestesiologo" :required="formCirugia.tipo_anestesia !== 'LOCAL'" :rules="rules"></v-autocomplete>
							</v-col>
							<v-col cols="12" md="3" sm="12">
								<v-text-field v-model="formCirugia.fecha_aval_cirugia" type="date" label="Fecha Aval Cirugia" :required="formCirugia.tipo_anestesia !== 'LOCAL'" :rules="rules"></v-text-field>
							</v-col>
							<v-col cols="12" md="3" sm="12">
								<v-checkbox v-model="formCirugia.aval_cirugia" label="Aval Cirugia"></v-checkbox>
							</v-col>
							<v-col cols="12" md="12" sm="12" v-if="!formCirugia.aval_cirugia">
								<v-textarea v-model="formCirugia.observacion_negacion_aval_cirugia" label="Observacion Negacion Aval Cirugia" :required="formCirugia.tipo_anestesia !== 'LOCAL' && formCirugia.aval_cirugia !== true" :rules="rules"></v-textarea>
							</v-col>
						</template>
						<template v-else>
							<v-col cols="12" md="10" sm="12"></v-col>
						</template>


						<v-col cols="12" md="6" sm="12">
							<v-autocomplete item-value="id" :item-text="a => a.documento+' - '+a.nombre+' '+a.apellido" :items="cirujanos" v-model="formCirugia.cirujano" label="Cirujano" return-object @input="buscarEspecialida();eventoPrevio()" required :rules="rules"></v-autocomplete>
						</v-col>
						<v-col cols="12" md="6" sm="12">
							<v-text-field v-model="formCirugia.especialidad_cirujano" label="Especialidad" readonly></v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="warning" @click="limpiarFormulario()">Limpiar</v-btn>
				<v-btn color="success" @click="guardarAgenda">Guardar</v-btn>
			</v-card-actions>
			</v-form>
		</v-card>
				<v-row class="fill-height">
					<v-col>
						<v-sheet height="64">
							<v-toolbar flat>
<!--								<v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">-->
<!--									Dia Actual-->
<!--								</v-btn>-->
<!--								<v-btn-->
<!--									fab-->
<!--									text-->
<!--									small-->
<!--									color="grey darken-2"-->
<!--									@click="prev"-->
<!--								>-->
<!--									<v-icon small>-->
<!--										mdi-chevron-left-->
<!--									</v-icon>-->
<!--								</v-btn>-->
<!--								<v-btn-->
<!--									fab-->
<!--									text-->
<!--									small-->
<!--									color="grey darken-2"-->
<!--									@click="next"-->
<!--								>-->
<!--									<v-icon small>-->
<!--										mdi-chevron-right-->
<!--									</v-icon>-->
<!--								</v-btn>-->
								<v-toolbar-title v-if="$refs.calendar">
									{{ $refs.calendar.title.toUpperCase() }}
								</v-toolbar-title>
								<v-spacer></v-spacer>
<!--								<v-menu bottom right>-->
<!--									<template v-slot:activator="{ on, attrs }">-->
<!--										<v-btn-->
<!--											outlined-->
<!--											color="grey darken-2"-->
<!--											v-bind="attrs"-->
<!--											v-on="on"-->
<!--										>-->
<!--											<span>{{ typeToLabel[type] }}</span>-->
<!--											<v-icon right>-->
<!--												mdi-menu-down-->
<!--											</v-icon>-->
<!--										</v-btn>-->
<!--									</template>-->
<!--									<v-list>-->
<!--										<v-list-item @click="type = 'category'">-->
<!--											<v-list-item-title>Dia</v-list-item-title>-->
<!--										</v-list-item>-->
<!--										<v-list-item @click="type = 'week'">-->
<!--											<v-list-item-title>Semana</v-list-item-title>-->
<!--										</v-list-item>-->
<!--										<v-list-item @click="type = 'month'">-->
<!--											<v-list-item-title>Mes</v-list-item-title>-->
<!--										</v-list-item>-->
<!--										<v-list-item @click="type = '4day'">-->
<!--											<v-list-item-title>4 dias</v-list-item-title>-->
<!--										</v-list-item>-->
<!--									</v-list>-->
<!--								</v-menu>-->
							</v-toolbar>
						</v-sheet>
						<v-sheet height="600">
							<v-calendar
								ref="calendar"
								v-model="focus"
								color="primary"
								:events="events"
								:event-color="getEventColor"
								:type="type"
                                category-show-all
                                :categories="categorias"
								@click:event="showEvent"
								@click:more="viewDay"
								@click:date="viewDay"
								:weekday-format="getDay"
							></v-calendar>
							<v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
								<v-card color="grey lighten-4" min-width="350px" flat>
									<v-toolbar :color="selectedEvent.color" dark>
										<v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
									</v-toolbar>
									<v-card-text v-if="selectedEvent.detalles">
										<template v-if="selectedEvent.id === 'cargado'">
											<span>
												<b>CLASE :</b>{{selectedEvent.detalles.clase}}
											</span>
											<br>
											<span>
												<b>AFILIADO: </b>{{selectedEvent.detalles.afiliado_id.tipo_documento.sigla}} {{selectedEvent.detalles.afiliado_id.numero_documento}} - {{selectedEvent.detalles.afiliado_id.nombre_completo}}
											</span>
											<br>
											<span v-for="(cup,index) in selectedEvent.detalles.cup_id" :key="cup.id">
												<b>SERVICIO {{ index+1 }} (CUP): </b>{{ cup.codigo + ' - '+ cup.nombre }}
												<br>
											</span>
											<span>
												<b>SEDE: </b>{{selectedEvent.detalles.rep_id.codigo_habilitacion_completo}} - {{selectedEvent.detalles.rep_id.nombre}}
											</span>
											<br>
											<span>
												<b>QUIROFANO: </b>{{selectedEvent.detalles.quirofano_id.nombre}}
											</span>
											<br>
											<span>
												<b>CIRUJANO: </b>{{selectedEvent.detalles.cirujano.tipo_documento_documento}} {{selectedEvent.detalles.cirujano.nombre_completo}}
											</span>
											<template v-if="selectedEvent.detalles.anestesiologo">
												<br>
												<span>
												<b>ANESTESIOLOGO: </b>CC - {{selectedEvent.detalles.anestesiologo.documento}} {{selectedEvent.detalles.anestesiologo.nombre}} {{selectedEvent.detalles.anestesiologo.apellido}}
												</span>
												<br>
												<span>
												<b>TIPO ANESTESIA: </b>{{selectedEvent.detalles.tipo_anestesia}}
												</span>
												<br>
												<span>
												<b>FECHA AVAL CIRUGIA: </b>{{selectedEvent.detalles.fecha_aval_cirugia}}
												</span>
												<br>
												<span>
												<b>AVAL CIRUGIA?: </b>{{selectedEvent.detalles.aval_cirugia?'SI':'NO'}}
												</span>
											</template>
											<br>
											<span>
												<b>FECHA CIRUGIA: </b>{{selectedEvent.detalles.fecha_cirugia}}
											</span>
											<br>
											<span>
												<b>HORA INICIO ESTIMADA: </b>{{$moment(selectedEvent.detalles.fecha_cirugia+' '+selectedEvent.detalles.hora_inicio_estimada).format('hh:mm A')}}
											</span>
											<br>
											<span>
												<b>HORA FIN ESTIMADA: </b>{{$moment(selectedEvent.detalles.fecha_cirugia+' '+selectedEvent.detalles.hora_fin_estimada).format('hh:mm A')}}
											</span>
										</template>
										<template v-else>
											<span>
												<b>CLASE :</b>{{selectedEvent.detalles.clase}}
											</span>
											<br>
											<span>
												<b>AFILIADO: </b>{{selectedEvent.detalles.afiliado.tipo_documento.sigla}} {{selectedEvent.detalles.afiliado.numero_documento}} - {{selectedEvent.detalles.afiliado.nombre_completo}}
											</span>
											<br>
											<span v-for="(cup,index) in selectedEvent.detalles.cups_agenda" :key="cup.id">
												<b>SERVICIO {{ index+1 }} (CUP): </b>{{ cup.codigo + ' - '+ cup.nombre }}
												<br>
											</span>
											<span>
												<b>SEDE: </b>{{selectedEvent.detalles.sede.codigo_habilitacion_completo}} - {{selectedEvent.detalles.sede.nombre}}
											</span>
											<br>
											<span>
												<b>QUIROFANO: </b>{{selectedEvent.detalles.consultorio.nombre}}
											</span>
											<br>
											<span>
												<b>CIRUJANO: </b>{{selectedEvent.detalles.cirujano.operador.tipo_documento_documento}} {{selectedEvent.detalles.cirujano.operador.nombre_completo}}
											</span>

											<template v-if="selectedEvent.detalles.anestesiologo">
												<br>
												<span>
												<b>ANESTESIOLOGO: </b>{{selectedEvent.detalles.anestesiologo.operador.tipo_documento_documento}} {{selectedEvent.detalles.anestesiologo.operador.nombre_completo}}
												</span>
												<br>
												<span>
												<b>TIPO ANESTESIA: </b>{{selectedEvent.detalles.tipo_anestesia}}
												</span>
												<br>
												<span>
												<b>FECHA AVAL CIRUGIA: </b>{{selectedEvent.detalles.fecha_aval_cirugia}}
												</span>
												<br>
												<span>
												<b>AVAL CIRUGIA?: </b>{{selectedEvent.detalles.aval_cirugia?'SI':'NO'}}
												</span>
											</template>
											<br>
											<span>
												<b>FECHA CIRUGIA: </b>{{selectedEvent.detalles.fecha}}
											</span>
											<br>
											<span>
												<b>HORA INICIO ESTIMADA: </b>{{$moment(selectedEvent.detalles.fecha+' '+selectedEvent.detalles.hora_inicio_estimada).format('hh:mm A')}}
											</span>
											<br>
											<span>
												<b>HORA FIN ESTIMADA: </b>{{$moment(selectedEvent.detalles.fecha+' '+selectedEvent.detalles.hora_fin_estimada).format('hh:mm A')}}
											</span>

										</template>
									</v-card-text>
									<v-card-actions>
										<v-btn
											text
											color="secondary"
											@click="selectedOpen = false"
										>
											Cerrar
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-menu>
						</v-sheet>
					</v-col>
				</v-row>

				<v-dialog v-model="dialogoRecordatorio" persistent width="800">
					<v-card>
						<v-card-title>Registre la observacion y anticipación del usuario en Clinica</v-card-title>
						<v-card-text>
							<v-form ref="formRecordatorio">
								<v-row>
									<v-col cols="12">
										<v-textarea label="Observación" no-resize outlined dense v-model="recordatorio.observacion" :rules="[v => !!v || 'Debe diligenciarlo' ]"></v-textarea>
									</v-col>
									<v-col cols="12">
										<v-text-field :rules="[v => !!v || 'Debe diligenciarlo' ]" type="number" label="Número de horas de anticipación" outlined dense v-model="recordatorio.horasAntes" hint="Ejemplo: 1, si desea que esté 1 hora antes"></v-text-field>
									</v-col>
								</v-row>

							</v-form>
						</v-card-text>
						<v-card-actions>
							<v-col cols="12">
								<v-btn color="success" @click="confirmarRecordatorio()">Confirmar</v-btn>
								<v-btn color="error" @click="dialogoRecordatorio = false">Cancelar</v-btn>
							</v-col>
						</v-card-actions>
					</v-card>
				</v-dialog>
	</div>
</template>
<script>
import {mapActions} from "vuex";
import {PDFDocument, StandardFonts, rgb, PageSizes} from 'pdf-lib';

export default {
	name:'agendamientoCirugia',
	props:{
		afiliado:Object,
		servicio:{
			default:null,
			type:Array
		},
		ordenId: {
			default: null,
			type: Number
		},
		tipoOrden:{
			default: null,
			type: String
		}
	},
	data(){
		return{
            categorias:[],
			rules:[v => !!v || 'El campo es requerido.'],
			validacion:true,
			especialidadesCirugia:[],
			cirujanos:[],
			anestesiologos:[],
			clases: ['INTRAHOSPITALARIA','PROGRAMADA','URGENCIA','REMITIDA'],
			tipoAnestesia:['RAQUIDEA','GENERAL','LOCAL','SEDACION'],
			quirofanos:[],
			prestadores:[],
			FiltroCups:'',
			funcionario:'',
			cups:[],
			formCirugia:{
				observacion_negacion_aval_cirugia:null,
				clase:null,
				funcionario_id:null,
				afiliado_id:null,
				cup_id:null,
				rep_id:null,
				quirofano_id:null,
				fecha_cirugia:null,
				hora_inicio_estimada:null,
				hora_fin_estimada:null,
				colorSeleccionado:0,
				anestesiologo:null,
				tipo_anestesia:'LOCAL',
				fecha_aval_cirugia:null,
				aval_cirugia:false,
				cirujano:null,
				especialidad_cirujano:null,
                orden_id: null
			},
			menu1:false,
			menu2:false,
			focus: '',
			type: 'category',
			typeToLabel: {
				month: 'Mes',
				week: 'Semana',
                category: 'Dia',
				'4day': '4 Dias',
			},
			selectedEvent: {},
			selectedElement: null,
			selectedOpen: false,
			events: [],
			colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
			names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
			serviciosSeleccionados:[],
			recordatorio:{
				observacion:'',
				horasAntes:1
			},
			dialogoRecordatorio: false,
			seguimiento:null
		}
	},
	mounted() {
		this.formCirugia.afiliado_id = this.afiliado;
		this.listarPrestadores();
		this.listarAnestesiologos();
		this.listarCirujanos();
		if(this.servicio.length > 0){
			this.FiltroCups = this.servicio.map(s => s);

			this.serviciosSeleccionados = this.servicio.map(s => s);
			
            this.formCirugia.orden_id = this.ordenId;
		}
	},
	computed:{
		prueba(){
			console.log(this.formCirugia)
		},
	},
	watch: {

		FiltroCups(val) {
			if (val) {
				if (val.length === 6) {
					this.listaCups();
				} else if (val.length < 6) {
					this.cups = null;
				}
			} else {
				this.cups = null;

			}
		},
		funcionario(val) {
			if (val) {
				if (val.length === 6) {
					this.funcionarios();
				} else if (val.length < 6) {
					this.cirujanos = null;
				}
			} else {
				this.cirujanos = null;

			}
		},
	},
	methods:{
		...mapActions('app', ['setPreload']),
		limpiarFormulario(){
			for (const item in Object.entries(this.formCirugia)){
				if(item !== 'afiliado_id'){
					this.formCirugia[item] = null;
				}
			}
			this.formCirugia.colorSeleccionado = 0;
			this.formCirugia.tipo_anestesia = 'LOCAL';
			this.events = [];
		},
		getDay(date) {
			const WeekDays = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
			return WeekDays[date.weekday];
		},
		viewDay ({ date }) {
			this.focus = date
			this.type = 'category'
		},
		getEventColor (event) {
			return event.color
		},
		setToday () {
			this.focus = ''
		},
		prev () {
			this.$refs.calendar.prev()
		},
		next () {
			this.$refs.calendar.next()
		},
		showEvent ({ nativeEvent, event }) {
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
		siguienteColor() {
			this.formCirugia.colorSeleccionado +=1;
			if(this.formCirugia.colorSeleccionado +1 === this.colors.length){
				this.formCirugia.colorSeleccionado = 0;
			}
		},
		listaCups() {
			this.setPreload(true);
			this.$axios.get('/cup/BuscarCup/'+this.FiltroCups).then(res => {
				this.cups = res.data.original
			}).catch(e => console.log(e.response)).finally( () => this.setPreload(false))
		},
		listarPrestadores() {
			this.setPreload(true);
			this.$axios.post('reps/listar', {
				cirugia: true
			}).then(res => {
				this.prestadores = res.data
			}).catch(e => console.log(e)).finally( () => this.setPreload(false))
		},

		funcionarios() {
			this.setPreload(true);
			this.$axios.post('usuarios/listarConfiltro?page=0', {
				funcionario: this.funcionario
			}).then(res => {
				this.cirujanos = res.data;
			}).catch(e => console.log(e)).finally( () => this.setPreload(false))
		},
		datosQuirofano(){
			this.events = []
            this.focus = this.formCirugia.fecha_cirugia
			if(this.formCirugia.fecha_cirugia && this.formCirugia.rep_id){
				this.setPreload(true);
                const data = {
                    rep_id: this.formCirugia.rep_id,
                    desde: this.formCirugia.fecha_cirugia,
                    hasta: this.formCirugia.fecha_cirugia,
                }
				this.$axios.post('agenda/consulta-agenda-cirugia',data).then(res => {
                    this.categorias = res.data.categorias.sort();
                    this.cargarEventos(res.data.registros);
				}).catch(e => console.log(e)).finally( () => this.setPreload(false))
			}
		},
		async guardarAgenda(){
			if(!this.formCirugia.cup_id){
				this.$toast.error('El formulario no es valido, seleccione al menos un procedimiento y diligencie todos los campos del formulario');
				return;
			}

			if(this.tipoOrden === 'servicio'){
				const servicios = this.formCirugia.cup_id.map(s => s.id);
				this.formCirugia.cup_id = servicios;
			}else if(this.tipoOrden === 'codigo_propio'){
				const servicios = this.formCirugia.cup_id.map(s => s.cup_id);
				this.formCirugia.cup_id = servicios;
			}
			
			if(this.$refs.formAgendamientoCirugia.validate()){
				this.setPreload(true);
				this.$axios.post('agenda/guardar-agenda-cirugias',this.formCirugia).then(res => {
					if(this.servicio.length > 0){
						this.seguimiento = {
							fecha:this.formCirugia.fecha_cirugia,
							fecha_solicitada:this.formCirugia.fecha_cirugia,
							medico:this.formCirugia.cirujano.nombre_completo,
							observaciones:'Agendamiento modulo cirugia'
						}
						
					}
					this.abrirDialogoRecordatorio()
					this.$toast.success(res.data.mensaje);
					this.limpiarFormulario();
					


				})
				.catch(e => {
					this.$toast.error(e.response);
				}).finally( () => {
					this.setPreload(false)
				})
			}

		},
		eventoPrevio(){
			if (this.formCirugia.hora_inicio_estimada && this.formCirugia.hora_fin_estimada) {
				const inicio = this.$moment(this.formCirugia.hora_inicio_estimada, "HH:mm");
				const fin = this.$moment(this.formCirugia.hora_fin_estimada, "HH:mm");

				// diferencia en minutos
				const diff = fin.diff(inicio, "minutes");

				if (diff < 30) {
					this.$nextTick(() => {
						this.formCirugia.hora_fin_estimada = null
						this.$toast.error('La hora de fin debe ser al menos 30 minutos después de la hora de inicio')
					})
				}
			}
			const index = this.events.findIndex(obj => obj.id === 'cargado');
			if(index > -1){
				this.events.splice(index, 1);
			}
			if(this.formCirugia.clase && this.formCirugia.cup_id && this.formCirugia.rep_id && this.formCirugia.quirofano_id && this.formCirugia.cirujano && this.formCirugia.fecha_cirugia && this.formCirugia.hora_inicio_estimada && this.formCirugia.hora_fin_estimada){
                const fechaHoraInicio = this.$moment(this.formCirugia.fecha_cirugia+' '+this.formCirugia.hora_inicio_estimada);
				const fechaHoraFin = this.$moment(this.formCirugia.fecha_cirugia+' '+this.formCirugia.hora_fin_estimada);
				const evento = {
					name:this.formCirugia?.cup_id[0]?.nombre,
					start:fechaHoraInicio.format('YYYY-MM-DD HH:mm'),
					end: fechaHoraFin.format('YYYY-MM-DD HH:mm'),
					color: this.colors[this.formCirugia.colorSeleccionado],
					detalles:this.formCirugia,
					id:'cargado',
                    category:this.formCirugia.quirofano_id.nombre
				}
				this.events.push(evento);
			}

		},
		listarAnestesiologos(){
			this.setPreload(true);
			const data = {
				especialidad_id:14
			};
			this.$axios.post('especialidades/especialidadMedico',data).then(res => {
				this.anestesiologos = res.data
			}).catch(e => console.log(e.response)).finally( () => {this.setPreload(false)})
		},
		listarCirujanos(){
			this.setPreload(true);
			this.$axios.get('usuarios/medicos-cirujanos').then(res => {
				this.cirujanos = res.data.cirujanos;
				this.especialidadesCirugia = res.data.especialidades;
			}).catch(e => console.log(e.response)).finally( () => {this.setPreload(false)})
		},
		cargarEventos(eventos){
			this.setPreload(true);
			eventos.forEach(s => {
				const fechaHoraInicio = this.$moment(s.fecha+' '+s.hora_inicio_estimada);
				const fechaHoraFin = this.$moment(s.fecha+' '+s.hora_fin_estimada);
				const evento = {
					name:s?.cups_agenda[0]?.nombre,
					start:fechaHoraInicio.format('YYYY-MM-DD HH:mm'),
					end: fechaHoraFin.format('YYYY-MM-DD HH:mm'),
					color: this.colors[s.color_evento],
					detalles:s,
					id:s.id,
                    category:s.consultorio.nombre
				}
				this.events.push(evento)
			})
			this.setPreload(false);
		},
		buscarEspecialida(){
			const registro = this.especialidadesCirugia.find(e => parseInt(e.id) === parseInt(this.formCirugia.cirujano.especialidade_id))
			this.formCirugia.especialidad_cirujano = registro.nombre;
		},
		abrirDialogoRecordatorio(){
			this.dialogoRecordatorio = true
		},

		async crearRecordatorio(){

			const pdf = await PDFDocument.create();
			const page = pdf.addPage(PageSizes.A4);
			const { height} = page.getSize();
			const font = await pdf.embedFont(StandardFonts.Helvetica);
			const negrita = await pdf.embedFont(StandardFonts.HelveticaBold)

			// 1. Cargar el logo desde /images/logoEcoimagen.png
			const logoUrl = "/images/victoriana.png";
			const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
			const logoImage = await pdf.embedPng(logoBytes);
			const logoDims = logoImage.scale(0.1); 

			page.drawImage(logoImage, {
				x: 20,
				y: height - 60,
				width: logoDims.width,
				height: logoDims.height,
			});


			const nombreUsuario = this.afiliado.nombre_completo
			const documento = this.afiliado.numero_documento
			const tipoDoc = this.afiliado.tipo_documento.sigla
			const fecha = this.$moment(this.formCirugia.fecha_cirugia);
			const dia = fecha.format("dddd D [de] MMMM [de] YYYY")
			const hora = this.$moment(this.formCirugia.hora_inicio_estimada, 'HH:mm').format('hh:mm A')
			const lugar = "CLÍNICA VICTORIANA CR 49 # 58-19 / PISO 2 ";
			const observacion = this.wrapText(this.recordatorio.observacion || "Ninguna",70);
			const horasAntes = this.recordatorio.horasAntes;
			const horaAntes = this.$moment(this.formCirugia.hora_inicio_estimada, 'HH:mm').subtract(horasAntes, 'hours').format('hh:mm A');
			const text1 = `Recuerde que debe presentarse el dia ${dia} a las ${horaAntes} `;
			const text2 = 'en el piso 2 de la Clinica Victoriana.'

			page.drawText('RECORDATORIO DE PROGRAMACIÓN DE CIRUGÍA', {
				x: 40 + logoDims.width + 10,
				y: height - 50,
				size: 14,
				font: negrita,
				color: rgb(0, 0, 0),
			});

			page.drawLine({
				start: { x: 50, y: height - 65 },   // inicio de la línea
				end: { x: 550, y: height - 65 },    // fin de la línea
				thickness: 1,
				color: rgb(0, 0, 0),
			});

			const contenido = [
				`Señor(a) ${nombreUsuario}, ${tipoDoc} ${documento}`,
				'A continuación, se relaciona información para tener en cuenta el día del procedimiento.',
				'',
				`DÍA: ${dia}`,
				'',
				`HORA DE CITACIÓN : ${hora}`,
				'',
				`LUGAR: ${lugar}`,
				'',
				`OBSERVACIÓN:`,
				...observacion,
				'',
				text1,
				text2
			];

			let y = height - 100;
			for (const line of contenido) {
				page.drawText(line, {
					x: 50,
					y,
					size: 12,
					font,
					color: rgb(0, 0, 0),
				});
				y -= 20;
			}

			const pdfBytes = await pdf.save();

			// Descargar en navegador
			const blob = new Blob([pdfBytes], { type: "application/pdf" });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);

			link.href = url;
			link.download = "recordatorio_cita.pdf";

			link.click();

			URL.revokeObjectURL(url);



		},
		async confirmarRecordatorio(){
			if(!this.$refs.formRecordatorio.validate()){
				return this.$toast.error('Debe diligenciar los campos para el recordatorio')
			}
			this.dialogoRecordatorio = false
			await this.crearRecordatorio()
			this.$refs.formRecordatorio.reset()
			this.$emit('datos-agendamiento',this.seguimiento)
		},

		wrapText(text, maxChars = 60) {
			const words = text.split(" ");
			let line = "";
			const lines = [];

			for (const word of words) {
				if ((line + word).length > maxChars) {
					lines.push(line.trim());
					line = "";
				}
				line += word + " ";
			}
			if (line.trim()) lines.push(line.trim());
			return lines;
		}



	}
}
</script>
