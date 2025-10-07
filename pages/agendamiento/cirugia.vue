<template>
	<div>
		<v-card>
			<v-alert dense text color="info" border="left" class="text-center" :icon="false">
				<b>REGISTRO DE AGENDAS DE CIRUGIA</b>
			</v-alert>
			<v-container>
				<v-row dense>
                    <v-col cols="12" sm="12" md="4">
                        <v-autocomplete dense item-value="user_id" :item-text="a => a.documento+' - '+a.nombre+' '+a.apellido"
                                        :items="cirujanos" label="Cirujano" v-model="formFiltro.cirujano"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                        <v-select :items="estados" item-value="id" item-text="nombre" dense label="Estado Cirugia" v-model="formFiltro.estado"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                        <v-select dense :items="prestadores" item-text="nombre" return-object v-model="formFiltro.rep_id" label="Sede" @input="quirofanos = $event.quirofanos"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                        <v-select dense :items="quirofanos" item-text="nombre" return-object v-model="formFiltro.quirofano" label="Quirofano"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                        <v-text-field type="date" dense label="Desde" v-model="formFiltro.desde"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                        <v-text-field type="date" dense label="Hasta" v-model="formFiltro.hasta"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                        <v-btn small color="orange" dark>Limpiar</v-btn>
                        <v-btn small color="success" dark @click="generarReporte">Exportar</v-btn>
                        <v-btn small color="info" dark @click="buscarCirugias">Filtrar</v-btn>
                    </v-col>
				</v-row>
			</v-container>
            <v-col>
                <v-sheet height="64">
                    <v-toolbar flat>
                        <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
                            Dia Actual
                        </v-btn>
                        <v-btn
                            fab
                            text
                            small
                            color="grey darken-2"
                            @click="prev"
                        >
                            <v-icon small>
                                mdi-chevron-left
                            </v-icon>
                        </v-btn>
                        <v-btn
                            fab
                            text
                            small
                            color="grey darken-2"
                            @click="next"
                        >
                            <v-icon small>
                                mdi-chevron-right
                            </v-icon>
                        </v-btn>
                        <v-toolbar-title v-if="$refs.calendar">
                            {{ $refs.calendar.title }}
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-menu
                            bottom
                            right
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    outlined
                                    color="grey darken-2"
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    <span>{{ typeToLabel[type] }}</span>
                                    <v-icon right>
                                        mdi-menu-down
                                    </v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="type = 'category'">
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
                                <template>
											<span>
												<b>CLASE :</b>{{selectedEvent.detalles.clase}}
											</span>
                                    <br>
                                    <span>
												<b>AFILIADO: </b>{{selectedEvent.detalles.afiliado.tipo_documento.sigla}} {{selectedEvent.detalles.afiliado.numero_documento}} - {{selectedEvent.detalles.afiliado.nombre_completo}}
											</span>
                                    <br>
                                    <span v-for="(cup,index) in selectedEvent.detalles.cups_agenda" :key="cup.id">
												<b>SERVICIO {{ index+1 }} (CUP): </b>{{cup.codigo_nombre}} 
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
        </v-card>
	</div>
</template>
<script>
import {mapActions} from "vuex";

export default {
	data(){
		return{
            categorias:[],
            estados:[
                {id:1,nombre:'ACTIVO'}
            ],
            prestadores:[],
            quirofanos:[],
            formFiltro:{
                rep_id:null,
                cirujano:null,
                quirofano:null,
                desde:null,
                hasta:null,
                estado:null
            },
			cirujanos:[],
			cirujano:null,
            focus: '',
            type: 'week',
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
		}
	},
	mounted() {
		this.listarCirujanos();
        this.listarPrestadores();
	},
	methods:{
		...mapActions('app', ['setPreload']),
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
		listarCirujanos(){
			this.setPreload(true);
			this.$axios.get('usuarios/medicos-cirujanos').then(res => {
				this.cirujanos = res.data.cirujanos;
			}).catch(e => console.log(e.response)).finally( () => {this.setPreload(false)})
		},
        listarPrestadores() {
            this.setPreload(true);
            this.$axios.post('reps/listar', {
                cirugia: true
            }).then(res => {
                console.log(res.data);
                this.prestadores = res.data;
            }).catch(e => console.log(e)).finally( () => this.setPreload(false))
        },
        buscarCirugias(){
            this.setPreload(true);
            this.events = [];
            this.$axios.post('agenda/consulta-agenda-cirugia',this.formFiltro).then(res => {
                console.log(res.data.categorias.sort());
                this.categorias = res.data.categorias.sort();
                this.cargarEventos(res.data.registros);
            }).catch(e => console.log(e)).finally(() => {this.setPreload(false)})
        },
        cargarEventos(eventos){
            this.setPreload(true);
            eventos.forEach(s => {
                const fechaHoraInicio = this.$moment(s.fecha+' '+s.hora_inicio_estimada);
                const fechaHoraFin = this.$moment(s.fecha+' '+s.hora_fin_estimada);
                const evento = {
                    name:s?.cups_agenda[0]?.codigo_nombre,
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

        generarReporte(){
            if(!this.formFiltro.desde){
                return this.$toast.error('El campo "Desde" es requerido');
            }
            if(!this.formFiltro.hasta){
                return this.$toast.error('El campo "Hasta" es requerido');
            }
            this.setPreload(true);
            this.$axios.post('agenda/reporte-cirugias-programadas',this.formFiltro,{
                responseType: 'blob',
            }).then(res => {
                let blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');

                a.download = 'reporte-cirugias-programadas.xlsx';
                a.href = url;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }).catch(e => console.log(e.response)).finally( () => this.setPreload(false))
        }
	}
}
</script>
